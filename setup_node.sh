#!/bin/bash
set -e
SCRIPT_NAME="${0##*/}"

NEW_USER="$2"

if [ -z "NEW_$USER" ]; then
    echo "Usage: $0 <type> <username>"
    exit 1
fi

PASSWORD="Nd${NEW_USER}123"
SSH_CONFIG="/etc/ssh/sshd_config"

echo "[$SCRIPT_NAME] Creating user: $NEW_USER"

adduser -D "$NEW_USER"
echo "$NEW_USER:$PASSWORD" | chpasswd
addgroup "$NEW_USER" wheel
addgroup "$NEW_USER" docker

#delete once base VM is update
apk add doas
mkdir -p "/etc/doas.d/"
cat > "/etc/doas.d/doas.conf" << EOF
permit persist :wheel
permit nopass :wheel
EOF
  
echo "[$SCRIPT_NAME] Disabling root SSH login"

cp "$SSH_CONFIG" "${SSH_CONFIG}.bak"

if grep -q "^#*PermitRootLogin" "$SSH_CONFIG"; then
    sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' "$SSH_CONFIG"
else
    echo "PermitRootLogin no" >> "$SSH_CONFIG"
fi

echo "[$SCRIPT_NAME] Restarting VM"
reboot
