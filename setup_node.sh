#!/bin/bash
set -e

NEW_USER="$2"

if [ -z "NEW_$USER" ]; then
    echo "Usage: $0 <type> <username>"
    exit 1
fi

PASSWORD="Nd${NEW_USER}123"
SSH_CONFIG="/etc/ssh/sshd_config"

echo "[1/5] Creating user: $NEW_USER"

adduser -D "$NEW_USER"
echo "$NEW_USER:$PASSWORD" | chpasswd

echo "[2/5] Installing sudo and granting wheel access"

apk add --no-cache sudo >/dev/null 2>&1 || true
rc-update add sudo boot

addgroup "$NEW_USER" wheel

# Enable wheel sudo group (safe append)
if ! grep -q "^%wheel" /etc/sudoers; then
    echo "%wheel ALL=(ALL) ALL" >> /etc/sudoers
fi

echo "[3/5] Optional: passwordless sudo for testing user"

# Only for testing environments
echo "$NEW_USER ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/$NEW_USER
chmod 440 /etc/sudoers.d/$NEW_USER

echo "[4/5] Disabling root SSH login"

cp "$SSH_CONFIG" "${SSH_CONFIG}.bak"

if grep -q "^#*PermitRootLogin" "$SSH_CONFIG"; then
    sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' "$SSH_CONFIG"
else
    echo "PermitRootLogin no" >> "$SSH_CONFIG"
fi

echo "  ssh $NEW_USER@<vm>"
echo "Password: $PASSWORD"

echo "[5/5] Restarting VM"
reboot
