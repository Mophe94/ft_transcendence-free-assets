#!/bin/bash
set -e

#Safeguard
SCRIPT_NAME="${0##*/}"

if [ ! $# -eq 3 ]; then
    echo "Usage: ${SCRIPT_NAME} <node new username> <host ip> <flag resize>"
    exit 1
elif [ -z "$1" ]; then
    echo "Usage: ${SCRIPT_NAME} <node new username> <host ip> <flag resize>"
    exit 1
fi

#Setup
TYPE="worker"
NEW_USER="$1"
IP=$(ip -4 route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if($i=="src") print $(i+1)}')
HOST_IP="$2"
CERT_DIR="/etc/certs/"
SSH_CONFIG="/etc/ssh/sshd_config"

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

# Docker configuration
mkdir -p /etc/docker

cat >/etc/docker/daemon.json <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

#echo "[$SCRIPT_NAME] Adding utils"

echo "[$SCRIPT_NAME] Setting up tailscale"
apk add -U tailscale
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

echo "[$SCRIPT_NAME] Setting up NFS"
apk add nfs-utils
rc-update add rpcbind
rc-update add nfs

echo "[${SCRIPT_NAME}] VM ip: ${IP}"

echo "[$SCRIPT_NAME] Restarting VM"
reboot
