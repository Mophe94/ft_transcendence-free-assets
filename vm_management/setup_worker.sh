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
set -eux

if [ $# -ne 3 ]; then
    log_error "Usage: ${SCRIPT_NAME} <node new username> <host ip> <flag resize>"
    exit 1
elif [ -z "$1" ]; then
    log_error "Usage: ${SCRIPT_NAME} <node new username> <host ip> <flag resize>"
    exit 1
else
    NEW_USER="$1"
    HOST_IP="$2"
    RESIZE_DISK="$3"
fi

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

TYPE="worker"
IP="$(ip -4 route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if($i=="src") print $(i+1)}')"
CERT_DIR="/etc/certs/"
SSH_CONFIG="/etc/ssh/sshd_config"

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
# Configure Docker
# ---------------------------------------------------------------------------

log_info "Configuring Docker"

docker system prune -af
mkdir -p /etc/docker

cat > /etc/docker/daemon.json <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

# ---------------------------------------------------------------------------
# Configure Tailscale
# ---------------------------------------------------------------------------

log_info "Setting up Tailscale"

apk add -U tailscale
rc-update add tailscale default
service tailscale start

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
# Configure NFS
# ---------------------------------------------------------------------------

log_info "Setting up NFS"

apk add nfs-utils
rc-update add rpcbind
rc-update add nfs

# ---------------------------------------------------------------------------
# Configure login welcome message
# ---------------------------------------------------------------------------

log_info "Configuring login welcome message"

cat > /etc/motd <<EOF

============================================================
             WELCOME TO A SWARM WORKER NODE
============================================================

  Hostname       : swarmnode.${NEW_USER}
  Local IP       : ${IP}
  Swarm role     : WORKER
  SSH user       : ${NEW_USER}

  Leader         : ${HOST_IP}

------------------------------------------------------------
  Services
------------------------------------------------------------

  Docker         : docker ps
  Tailscale      : tailscale status
  NFS            : exportfs -v

------------------------------------------------------------
  Useful commands
------------------------------------------------------------

  Check Tailscale:
      tailscale status

  Check Tailscale IP:
      tailscale ip -4

  Check Docker:
      docker ps

  Check Docker logs:
      docker logs <container>

  Check Docker service:
      rc-service docker status

  Check Tailscale service:
      rc-service tailscale status

  Check NFS:
      rc-service nfs status

------------------------------------------------------------
  Important paths
------------------------------------------------------------

  Docker config  : /etc/docker/daemon.json
  Certificates   : ${CERT_DIR}

------------------------------------------------------------
  Swarm
------------------------------------------------------------

  This machine is configured as a WORKER node.
  The swarm leader is reachable at:

      ${HOST_IP}

============================================================

EOF

log_info "Restarting VM"

reboot
