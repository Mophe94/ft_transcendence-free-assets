#!/bin/bash

SCRIPT_NAME="${0##*/}"
SCRIPT_LOCATION="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOGS_LOCATION="${LOGS_LOCATION:-"."}/${SCRIPT_NAME%.sh}"
LOG_FILE="${LOGS_LOCATION}/${SCRIPT_NAME%.sh}_$(date '+%Y-%m-%d_%H-%M-%S').log"

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

COLOR_RESET='\033[0m'
COLOR_GREEN='\033[32m'
COLOR_ORANGE='\033[38;5;208m'
COLOR_RED='\033[31m'

mkdir -p "$LOGS_LOCATION"
mkdir -p "$(dirname "$LOG_FILE")"

# File descriptor 3: log file
exec 3>>"$LOG_FILE"

# File descriptor 4: terminal
exec 4>&1

# Log everything else to the log and terminal
exec > >(tee -a "$LOG_FILE") 2>&1

log_info() {
    local message="$*"
    local timestamp
    timestamp="$(date '+%Y-%m-%d %H:%M:%S')"

    printf '%b[INFO]%b[%s] %s\n' \
        "$COLOR_GREEN" \
        "$COLOR_RESET" \
        "$SCRIPT_NAME" \
        "$message" >&4

    printf '[INFO][%s][%s] %s\n' \
        "$timestamp" \
        "$SCRIPT_NAME" \
        "$message" >&3
}

log_warn() {
    local message="$*"
    local timestamp
    timestamp="$(date '+%Y-%m-%d %H:%M:%S')"

    printf '%b[WARN]%b[%s] %s\n' \
        "$COLOR_ORANGE" \
        "$COLOR_RESET" \
        "$SCRIPT_NAME" \
        "$message" >&4

    printf '[WARN][%s][%s] %s\n' \
        "$timestamp" \
        "$SCRIPT_NAME" \
        "$message" >&3
}

log_error() {
    local message="$*"
    local timestamp
    timestamp="$(date '+%Y-%m-%d %H:%M:%S')"

    printf '%b[ERROR]%b[%s] %s\n' \
        "$COLOR_RED" \
        "$COLOR_RESET" \
        "$SCRIPT_NAME" \
        "$message" >&4

    printf '[ERROR][%s][%s] %s\n' \
        "$timestamp" \
        "$SCRIPT_NAME" \
        "$message" >&3
}

log_wait() {
    local message="$*"
    local timestamp
    timestamp="$(date '+%Y-%m-%d %H:%M:%S')"

    printf '%b[INFO]%b[%s] %s' \
        "$COLOR_GREEN" \
        "$COLOR_RESET" \
        "$SCRIPT_NAME" \
        "$message" >&4

    printf '[INFO][%s][%s] %s' \
        "$timestamp" \
        "$SCRIPT_NAME" \
        "$message" >&3
}

# ---------------------------------------------------------------------------
# Safeguard
# ---------------------------------------------------------------------------
set -e

if [ $# -ne 3 ]; then
    log_error "Usage: ${SCRIPT_NAME} <node new username> <host_ip> <resize_disk_flag>"
    exit 1
elif [ -z "$1" ]; then
    log_error "Usage: ${SCRIPT_NAME} <node new username> <host_ip> <resize_disk_flag>"
    exit 1
else
    NEW_USER="$1"
    HOST_IP="$2"
    RESIZE_DISK="$3"
fi

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

TYPE="leader"
IP="$(ip -4 route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if($i=="src") print $(i+1)}')"
CERT_DIR="/etc/certs/"
SSH_CONFIG="/etc/ssh/sshd_config"
HEADSCALE_DIR="/opt/headscale"
HEADSCALE_PORT="8080"
TAILSCALE_IP_FILE="/etc/tailscale_ip"

log_info "VM IP: ${IP}"

# ---------------------------------------------------------------------------
# Resize root partition
# ---------------------------------------------------------------------------

if [ "$RESIZE_DISK" = "true" ]; then
    log_info "Expanding root partition"

    apk update
    apk add --no-cache cloud-utils-growpart e2fsprogs-extra

    growpart /dev/sda 3
    resize2fs /dev/sda3
fi

# ---------------------------------------------------------------------------
# Wait for network
# ---------------------------------------------------------------------------

TIMEOUT=60
ELAPSED=0

log_wait "Waiting for network"

until ip route get 1.1.1.1 >/dev/null 2>&1; do
    sleep 1
    ELAPSED=$((ELAPSED + 1))

    printf '.' >&4
    printf '.' >&3

    if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
        printf '\n' >&4
        printf '\n' >&3
        log_error "Network failed to become ready"
        exit 1
    fi
done

printf '\n' >&4
printf '\n' >&3

# ---------------------------------------------------------------------------
# Synchronize system clock
# ---------------------------------------------------------------------------

log_info "Synchronizing system clock"

rc-service ntpd stop

TIMEOUT=90
ELAPSED=0

until ntpd -nq -p pool.ntp.org; do
    log_warn "NTP synchronization failed, retrying"
    sleep 5
    ELAPSED=$((ELAPSED + 5))

    if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
        log_error "Failed to synchronize system clock"
        exit 1
    fi
done

rc-service ntpd start

date -u

# ---------------------------------------------------------------------------
# Create user
# ---------------------------------------------------------------------------

NEW_USER_HOME="/home/$NEW_USER"

log_info "Creating user: $NEW_USER"

adduser -D -h "$NEW_USER_HOME" "$NEW_USER"

IFS= read -r NEW_USER_PASSWORD
echo "${NEW_USER}:${NEW_USER_PASSWORD}" | chpasswd
unset NEW_USER_PASSWORD

log_info "Setting up ${NEW_USER} permissions"

addgroup "$NEW_USER" wheel
addgroup "$NEW_USER" docker

# ---------------------------------------------------------------------------
# Configure SSH access
# ---------------------------------------------------------------------------

log_info "Setting up ${NEW_USER} SSH login"

mkdir -p "$NEW_USER_HOME/.ssh"
chmod 700 "${NEW_USER_HOME}/.ssh"

cat "${HOME}/.ssh/authorized_keys" > "${NEW_USER_HOME}/.ssh/authorized_keys"

chmod 600 "${NEW_USER_HOME}/.ssh/authorized_keys"
chown -R "${NEW_USER}:${NEW_USER}" "${NEW_USER_HOME}/.ssh"

log_info "Disabling root SSH login"

cp "$SSH_CONFIG" "${SSH_CONFIG}.bak"

if grep -q "^#*PermitRootLogin" "$SSH_CONFIG"; then
    sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' "$SSH_CONFIG"
else
    echo "PermitRootLogin no" >> "$SSH_CONFIG"
fi

# ---------------------------------------------------------------------------
# Configure hostname
# ---------------------------------------------------------------------------

log_info "Changing VM hostname to: swarmnode.${NEW_USER}"

echo "swarmnode.${NEW_USER}" > /etc/hostname

# ---------------------------------------------------------------------------
# Install utilities
# ---------------------------------------------------------------------------

log_info "Adding utilities"

apk update
apk add --no-cache \
    curl \
    vim \
    jq \
    sshpass

docker system prune -af

# ---------------------------------------------------------------------------
# Configure Tailscale
# ---------------------------------------------------------------------------

log_info "Setting up Tailscale"

apk add tailscale
rc-update add tailscale default
service tailscale start

# ---------------------------------------------------------------------------
# Configure Headscale
# ---------------------------------------------------------------------------

log_info "Setting up Headscale"

mkdir -p "${HEADSCALE_DIR}"/{config,data}

cat > "${HEADSCALE_DIR}/config/config.yaml" <<EOF
server_url: http://${HOST_IP}:9090

listen_addr: 0.0.0.0:${HEADSCALE_PORT}

prefixes:
  allocation: sequential
  v4: 100.64.0.0/10
  v6: fd7a:115c:a1e0::/48

database:
  type: sqlite
  sqlite:
    path: /var/lib/headscale/db.sqlite

private_key_path: /var/lib/headscale/private.key

noise:
  private_key_path: /var/lib/headscale/noise_private.key

dns:
  magic_dns: false
  override_local_dns: false

derp:
  server:
    enabled: false

  urls:
    - https://controlplane.tailscale.com/derpmap/default

log:
  format: text
  level: info

EOF

cat > "${HEADSCALE_DIR}/docker-compose.yml" <<EOF
services:

  headscale:

    image: headscale/headscale:v0.29.2

    container_name: headscale

    restart: unless-stopped

    volumes:
      - ${HEADSCALE_DIR}/config:/etc/headscale
      - ${HEADSCALE_DIR}/data:/var/lib/headscale

    ports:
      - "${HEADSCALE_PORT}:${HEADSCALE_PORT}"

    command: serve

EOF

cd "${HEADSCALE_DIR}"
docker compose up -d

TIMEOUT=60
ELAPSED=0

log_wait "Waiting for Headscale to become ready"

until docker exec headscale headscale version >/dev/null 2>&1; do
    sleep 2
    ELAPSED=$((ELAPSED + 2))

    printf '.' >&4
    printf '.' >&3

    if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
        printf '\n' >&4
        printf '\n' >&3
        log_error "Headscale failed to become ready"
        docker logs headscale
        exit 1
    fi
done

printf '\n' >&4
printf '\n' >&3

# ---------------------------------------------------------------------------
# Create Headscale user
# ---------------------------------------------------------------------------

log_info "Creating Headscale user"

docker exec headscale headscale users create swarm || true

log_info "Creating Headscale auth key"

USER_ID=$(
    docker exec headscale headscale users list -o json |
        jq -r '.[] | select(.name=="swarm") | .id'
)

log_info "USER_ID=$USER_ID"

if [ -z "$USER_ID" ]; then
    log_error "Failed to determine Headscale user ID"
    docker exec headscale headscale users list
    exit 1
fi

AUTH_KEY=$(
    docker exec headscale \
        headscale preauthkeys create \
        --user "$USER_ID" \
        --reusable \
        --expiration 24h
)

echo "${AUTH_KEY}" > /etc/headscale_authkey
chmod 600 /etc/headscale_authkey

# ---------------------------------------------------------------------------
# Register leader in Tailscale
# ---------------------------------------------------------------------------

log_info "Registering leader in Tailscale"

tailscale up \
    --login-server="http://${HOST_IP}:9090" \
    --authkey="${AUTH_KEY}" \
    --hostname="swarmnode.${NEW_USER}"

TAILSCALE_IP="$(tailscale ip -4)"

echo "${TAILSCALE_IP}" > "${TAILSCALE_IP_FILE}"

log_info "Tailscale IP: ${TAILSCALE_IP}"

# ---------------------------------------------------------------------------
# Configure NFS
# ---------------------------------------------------------------------------

log_info "Setting up NFS"

apk add nfs-utils
rc-update add rpcbind
rc-update add nfs

log_info "Setting up NFS storage"

mkdir -p /nfs-storage/{monitoring,backups}
chown -R "${NEW_USER}:${NEW_USER}" /nfs-storage

echo "/nfs-storage *(rw,sync,no_subtree_check,no_root_squash)" >> /etc/exports
exportfs -ra

# ---------------------------------------------------------------------------
# Configure server certificates
# ---------------------------------------------------------------------------

log_info "Setting up certificate directory"

mkdir -p "${CERT_DIR}"
mv /cert_info.env "${CERT_DIR}/cert_info.env"

log_info "Generating CA"

chmod +x /cert_rootCA.sh
bash /cert_rootCA.sh "${CERT_DIR}" "${TAILSCALE_IP}"

# ---------------------------------------------------------------------------
# Configure Docker startup dependency
# ---------------------------------------------------------------------------

log_info "Configuring Docker startup dependency on Tailscale"

mkdir -p /etc/conf.d

if [ -f /etc/conf.d/docker ]; then
    if ! grep -q 'rc_need="tailscale"' /etc/conf.d/docker; then
        echo 'rc_need="tailscale"' | doas tee -a /etc/conf.d/docker >/dev/null
    fi
else
    echo 'rc_need="tailscale"' | doas tee /etc/conf.d/docker >/dev/null
fi

# ---------------------------------------------------------------------------
# Configure Docker daemon
# ---------------------------------------------------------------------------

log_info "Setting up Docker daemon"

mkdir -p /etc/docker

if [ ! -f "${CERT_DIR}/ca.crt" ]; then
    log_warn "Missing CA certificate, marking registry as insecure"

    if [ -f "/etc/docker/daemon.json" ]; then
        rm -f "/etc/docker/daemon.json"
    fi

    cat > "/etc/docker/daemon.json" <<EOF
{
    "insecure-registries": [
        "${TAILSCALE_IP}:5050"
    ],
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "10m",
        "max-file": "3"
    }
}
EOF
else
    log_info "Found CA certificate, marking registry as secure"

    mkdir -p "/etc/docker/certs.d/${TAILSCALE_IP}:5050/"
    cp "${CERT_DIR}/ca.crt" "/etc/docker/certs.d/${TAILSCALE_IP}:5050/"

    if [ -f "/etc/docker/daemon.json" ]; then
        rm -f "/etc/docker/daemon.json"
    fi

    cat > "/etc/docker/daemon.json" <<EOF
{
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "10m",
        "max-file": "3"
    }
}
EOF
fi

log_info "VM IP: ${IP}"

# ---------------------------------------------------------------------------
# Display setup information
# ---------------------------------------------------------------------------

log_info "Setup complete"

echo "--------------------------------"
echo "Tailscale IP:"
cat /etc/tailscale_ip
echo
echo "Headscale auth key:"
cat /etc/headscale_authkey
echo "--------------------------------"

# ---------------------------------------------------------------------------
# Configure login welcome message
# ---------------------------------------------------------------------------

log_info "Configuring login welcome message"

cat > /etc/motd <<EOF

============================================================
          WELCOME TO THE LEADER OF THE SWARM
============================================================

  Hostname       : swarmnode.${NEW_USER}
  Local IP       : ${IP}
  Tailscale IP   : ${TAILSCALE_IP}
  Headscale      : http://${HOST_IP}:9090

  Swarm role     : LEADER
  SSH user       : ${NEW_USER}

------------------------------------------------------------
  Services
------------------------------------------------------------

  Docker         : docker ps
  Headscale      : docker logs headscale
  Tailscale      : tailscale status
  NFS exports    : exportfs -v

------------------------------------------------------------
  Important files
------------------------------------------------------------

  Tailscale IP   : ${TAILSCALE_IP_FILE}
  Headscale key  : /etc/headscale_authkey
  Certificates   : ${CERT_DIR}
  Headscale      : ${HEADSCALE_DIR}
  NFS storage    : /nfs-storage

------------------------------------------------------------
  Useful commands
------------------------------------------------------------

  Check Tailscale IP:
      tailscale ip -4

  Check Tailscale status:
      tailscale status

  Check Docker containers:
      docker ps

  Check Headscale:
      docker exec headscale headscale users list

  Check NFS exports:
      exportfs -v

============================================================

EOF

log_info "Setup complete"
log_info "Restarting VM"

reboot
