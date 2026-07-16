#!/bin/sh

#Safeguard
SCRIPT_NAME="${0##*/}"
set -eu

if [ ! $# -eq 2 ]; then
    echo "Usage: ${SCRIPT_NAME} <leader host ip> <NFS port>"
    exit 1
elif [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: ${SCRIPT_NAME} <node type> <NFS port>"
    exit 1
fi

# Setup
NFS_SERVER="$1"
NFS_PORT="$2"

# Path to the CA certificate copied by the leader
CA_CERT="/tmp/ca.crt"
SSH_KEY="/tmp/host_ssh_key"

#echo "[$SCRIPT_NAME] Setting up leader SSH login"
#mkdir -p "$USER/.ssh"
#chmod 700 "/home/${USER}/.ssh"
#cat "${SSH_KEY}" > "/home/${USER}/.ssh/authorized_keys" 
#chmod 600 "/home/${USER}/.ssh/authorized_keys"
#chown -R ${USER}:${USER} "/home/${USER}/.ssh"

# Install leader CA
if [ -f "$CA_CERT" ]; then
    doas mkdir -p /usr/local/share/ca-certificates
    doas cp "$CA_CERT" /usr/local/share/ca-certificates/leader-ca.crt
    doas update-ca-certificates
    echo "[INFO[$SCRIPT_NAME]: CA certificate found"
else
    echo "[WARNING][$SCRIPT_NAME]: CA certificate not found: $CA_CERT"
fi

# Check install of NFS client
if ! command -v mount.nfs >/dev/null 2>&1; then
    doas apk add --no-cache nfs-utils
fi

# Check NFS connectivity
if ! nc -z "$NFS_SERVER" ${NFS_PORT}; then
    echo "[WARNING][$SCRIPT_NAME]: Could not reach NFS server ${NFS_SERVER}:${NFS_PORT}i"
else
    echo "[INFO][$SCRIPT_NAME]: NFS server ${NFS_SERVER}:${NFS_PORT} reached"
fi

echo "Worker successfully configured."
