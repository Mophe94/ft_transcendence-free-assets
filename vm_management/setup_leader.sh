#!/bin/bash
set -e

#Safeguard
SCRIPT_NAME="${0##*/}"

if [ $# -ne 3 ]; then
    echo "Usage: ${SCRIPT_NAME} <node new username> <host_ip> <resize_disk_flag>"
    exit 1
elif [ -z "$1" ]; then
    echo "Usage: ${SCRIPT_NAME} <node new username> <host_ip> <resize_disk_flag>"
    exit 1
else
    NEW_USER="$1"
    HOST_IP="$2"
    RESIZE_DISK="$3"
fi

#Setup
TYPE="leader"
IP=$(ip -4 route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if($i=="src") print $(i+1)}')
CERT_DIR="/etc/certs/"
SSH_CONFIG="/etc/ssh/sshd_config"
HEADSCALE_DIR="/opt/headscale"
HEADSCALE_PORT="8080"
TAILSCALE_IP_FILE="/etc/tailscale_ip"

echo "[${SCRIPT_NAME}] VM ip: ${IP}"
if [ "$RESIZE_DISK" = "true" ]; then
    echo "[$SCRIPT_NAME] Expanding root partition"

    apk update && apk add --no-cache cloud-utils-growpart e2fsprogs-extra

    growpart /dev/sda 3
    resize2fs /dev/sda3
fi

echo "[$SCRIPT_NAME] Waiting for network"

TIMEOUT=60
ELAPSED=0

until ip route get 1.1.1.1 >/dev/null 2>&1; do
    sleep 1
    ELAPSED=$((ELAPSED + 1))

    if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
        echo "[$SCRIPT_NAME] Network failed to become ready"
        exit 1
    fi
done

echo "[$SCRIPT_NAME] Synchronizing system clock"

rc-service ntpd stop

TIMEOUT=90
ELAPSED=0

until ntpd -nq -p pool.ntp.org; do
    echo "[$SCRIPT_NAME] NTP synchronization failed, retrying..."
    sleep 5
    ELAPSED=$((ELAPSED + 5))

    if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
        echo "[$SCRIPT_NAME] Failed to synchronize system clock"
        exit 1
    fi
done

rc-service ntpd start

date -u

#Change for env procured password
NEW_USER_HOME="/home/$NEW_USER"

echo "[$SCRIPT_NAME] Creating user: $NEW_USER"
adduser -D -h "$NEW_USER_HOME" "$NEW_USER"
IFS= read -r NEW_USER_PASSWORD
echo "${NEW_USER}:${NEW_USER_PASSWORD}" | chpasswd
unset NEW_USER_PASSWORD

echo "[$SCRIPT_NAME] Setting up ${NEW_USER} permissions"
addgroup "$NEW_USER" wheel
addgroup "$NEW_USER" docker

echo "[$SCRIPT_NAME] Setting up ${NEW_USER} SSH login"
mkdir -p "$NEW_USER_HOME/.ssh"
chmod 700 "${NEW_USER_HOME}/.ssh"
cat "${HOME}/.ssh/authorized_keys" > "${NEW_USER_HOME}/.ssh/authorized_keys" 
chmod 600 "${NEW_USER_HOME}/.ssh/authorized_keys"
chown -R ${NEW_USER}:${NEW_USER} "${NEW_USER_HOME}/.ssh"

echo "[$SCRIPT_NAME] Disabling root SSH login"
cp "$SSH_CONFIG" "${SSH_CONFIG}.bak"
if grep -q "^#*PermitRootLogin" "$SSH_CONFIG"; then
    sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' "$SSH_CONFIG"
else
    echo "PermitRootLogin no" >> "$SSH_CONFIG"
fi

echo "[$SCRIPT_NAME] Changing VM hostname to: swarmnode.${NEW_USER}"
echo "swarmnode.${NEW_USER}" > /etc/hostname

#Server CA creation

echo "[$SCRIPT_NAME] Setting up directory"
mkdir -p ${CERT_DIR}
mv /cert_info.env ${CERT_DIR}/cert_info.env 

#Server CA generation
echo "[$SCRIPT_NAME] Generating CA"

chmod +x /cert_rootCA.sh
bash /cert_rootCA.sh ${CERT_DIR}

echo "[$SCRIPT_NAME] Adding utils"
apk update
apk add --no-cache \
	curl \
	vim \
	jq \
	sshpass

echo "[$SCRIPT_NAME] Setting up tailscape"
apk add tailscale
rc-update add tailscale default
service tailscale start

echo "[${SCRIPT_NAME}] Configuring Docker startup dependency on Tailscale"
mkdir -p /etc/conf.d
if [ -f /etc/conf.d/docker ]; then
    if ! grep -q 'rc_need="tailscale"' /etc/conf.d/docker; then
        echo 'rc_need="tailscale"' | doas tee -a /etc/conf.d/docker >/dev/null
    fi
else
    echo 'rc_need="tailscale"' | doas tee /etc/conf.d/docker >/dev/null
fi

echo "[$SCRIPT_NAME] Setting up Headscale"
mkdir -p ${HEADSCALE_DIR}/{config,data}


cat > ${HEADSCALE_DIR}/config/config.yaml <<EOF
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

cat > ${HEADSCALE_DIR}/docker-compose.yml <<EOF

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

cd ${HEADSCALE_DIR}
docker compose up -d
TIMEOUT=60
ELAPSED=0
until docker exec headscale headscale version >/dev/null 2>&1; do
    sleep 2
    ELAPSED=$((ELAPSED+2))

    if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
        echo "[$SCRIPT_NAME] Headscale failed to become ready"
        docker logs headscale
        exit 1
    fi
done

echo "[$SCRIPT_NAME] Creating Headscale user"
docker exec headscale \
headscale users create swarm || true

echo "[$SCRIPT_NAME] Creating Headscale auth key"
USER_ID=$(
    docker exec headscale headscale users list -o json \
    | jq -r '.[] | select(.name=="swarm") | .id'
)

echo "[$SCRIPT_NAME] USER_ID=$USER_ID"
if [ -z "$USER_ID" ]; then
    echo "[$SCRIPT_NAME] Failed to determine Headscale user ID"
    docker exec headscale headscale users list
    exit 1
fi

AUTH_KEY=$(docker exec headscale \
    headscale preauthkeys create \
    --user "$USER_ID" \
    --reusable \
    --expiration 24h)

echo "${AUTH_KEY}" > /etc/headscale_authkey
chmod 600 /etc/headscale_authkey

echo "[$SCRIPT_NAME] Registering leader in Tailscale"
tailscale up \
 --login-server=http://${HOST_IP}:9090 \
 --authkey=${AUTH_KEY} \
 --hostname=swarmnode.${NEW_USER}

TAILSCALE_IP=$(tailscale ip -4)
echo "${TAILSCALE_IP}" > ${TAILSCALE_IP_FILE}
echo "[$SCRIPT_NAME] Tailscale IP: ${TAILSCALE_IP}"

echo "[$SCRIPT_NAME] Setting up NFS"
apk add nfs-utils
rc-update add rpcbind
rc-update add nfs

echo "[$SCRIPT_NAME] Setting up nfs-storage"
mkdir -p /nfs-storage/{registry,monitoring,backups} \
    && chown -R ${NEW_USER}:${NEW_USER} "/nfs-storage"
echo "/nfs-storage *(rw,sync,no_subtree_check,no_root_squash)" >> "/etc/exports"
exportfs -ra
#check with exportfs -v

echo "[$SCRIPT_NAME] Setting up Docker Daemon"
mkdir -p "/etc/docker"
if [ ! -f ${CERT_DIR}/ca.crt ]; then
    echo "[$SCRIPT_NAME] Missing CA certificate, marking registry as insecure"
    if [ -f "/etc/docker/daemon.json" ]; then
	rm -f "/etc/docker/daemon.json"
    fi
    cat > "/etc/docker/daemon.json" << EOF
    {
	"insecure-registries": [
	    "${TAILSCALE_IP}:5050"
	]
	"log-driver": "json-file",
	"log-opts": {
	    "max-size": "10m",
	    "max-file": "3"
	}
    }
EOF
else
    echo "[$SCRIPT_NAME] Found CA certificate, marking registry as secure"
    mkdir -p "/etc/docker/certs.d/${TAILSCALE_IP}:5050/"
    cp "${CERT_DIR}/ca.crt" "/etc/docker/certs.d/${TAILSCALE_IP}:5050/"
    if [ -f "/etc/docker/daemon.json" ]; then
	rm -f "/etc/docker/daemon.json"
    fi
    cat > "/etc/docker/daemon.json" << EOF
    {
	"log-driver": "json-file",
	"log-opts": {
	    "max-size": "10m",
	    "max-file": "3"
	}
    }
EOF
fi

echo "[${SCRIPT_NAME}] VM ip: ${IP}"

echo "[$SCRIPT_NAME] Setup complete"

echo "--------------------------------"
echo "Tailscale IP:"
cat /etc/tailscale_ip
echo
echo "Headscale auth key:"
cat /etc/headscale_authkey
echo "--------------------------------"

echo "[$SCRIPT_NAME] Restarting VM"
reboot
