#!/bin/bash
set -e
SCRIPT_NAME="${0##*/}"

NEW_USER="$2"
IP=$(ip -4 route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if($i=="src") print $(i+1)}')
echo "[${SCRIPT_NAME}] VM ip: ${IP}"

if [ -z "${NEW_USER}" ]; then
    echo "Usage: $0 <node type> <node username>"
    exit 1
fi

PASSWORD="Nd${NEW_USER}123"
SSH_CONFIG="/etc/ssh/sshd_config"

echo "[$SCRIPT_NAME] Creating user: $NEW_USER"

adduser -D "$NEW_USER"
echo "${NEW_USER}:${PASSWORD}" | chpasswd
addgroup "$NEW_USER" wheel
addgroup "$NEW_USER" docker

mkdir -p "/home/${NEW_USER}/.ssh"
chown -R ${NEW_USER}:${NEW_USER} "/home/${NEW_USER}/.ssh/"
chmod 700 "/home/${NEW_USER}/.ssh"

echo "[$SCRIPT_NAME] Disabling root SSH login"

cp "$SSH_CONFIG" "${SSH_CONFIG}.bak"

if grep -q "^#*PermitRootLogin" "$SSH_CONFIG"; then
    sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' "$SSH_CONFIG"
else
    echo "PermitRootLogin no" >> "$SSH_CONFIG"
fi

echo "[$SCRIPT_NAME] Changing VM hostname to: swarmnode.${NEW_USER}"
echo "swarmnode.${NEW_USER}" > /etc/hostname

echo "[$SCRIPT_NAME] Setting up Docker Daemon"
mkdir -p /etc/docker
if [ -f "/etc/docker/daemon.json" ]; then
    rm -f "/etc/docker/daemon.json"
fi
cat > "/etc/docker/daemon.json" << EOF
{
    "insecure-registries": [
        "${IP}:5050"
    ]
}
EOF
echo "[${SCRIPT_NAME}] VM ip: ${IP}"
#"registry",
#"registry:5000",

echo "[$SCRIPT_NAME] Restarting VM"
reboot
