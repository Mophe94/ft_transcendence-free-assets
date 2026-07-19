#!/bin/sh

#Safeguard
SCRIPT_NAME="${0##*/}"
set -eu

if [ ! $# -eq 4 ]; then
    echo "Usage: ${SCRIPT_NAME} <leader host ip> <node host ip> <join command> <NFS port>"
    exit 1
elif [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: ${SCRIPT_NAME} <leader host ip> <node host ip> <join command> <NFS port>"
    exit 1
fi

# Setup
LEADER_IP="$1"
NODE_IP="$2"
JOIN_CMD="$3"
NFS_PORT="$4"

# Path to the CA certificate copied by the leader
CA_CERT="/tmp/ca.crt"

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
if ! nc -z "$LEADER_IP" ${NFS_PORT}; then
    echo "[WARNING][$SCRIPT_NAME]: Could not reach NFS server ${LEADER_IP}:${NFS_PORT}i"
else
    echo "[INFO][$SCRIPT_NAME]: NFS server ${LEADER_IP}:${NFS_PORT} reached"
fi

# Adding certificates to docker
doas mkdir -p /etc/docker/certs.d/${LEADER_IP}:5050
doas cp /tmp/worker.crt /etc/docker/certs.d/${LEADER_IP}:5050/client.cert
doas cp /tmp/worker.key /etc/docker/certs.d/${LEADER_IP}:5050/client.key

doas rc-service docker restart
COUNTER=0
TIMEOUT=30
echo "[INFO][$SCRIPT_NAME] Waiting for docker to restart"
while ! docker info >/dev/null 2>&1; do
    if [ "$COUNTER" -ge "$TIMEOUT" ]; then
        echo "[ERROR][$SCRIPT_NAME] Docker took to much time"
        exit 1
    fi
    COUNTER=$((COUNTER + 1))
    sleep 2
    echo -n "."
done

docker swarm join --advertise-addr ${NODE_IP} --data-path-addr ${NODE_IP} --token ${JOIN_CMD} ${LEADER_IP}:2377
echo "[INFO][$SCRIPT_NAME] Worker successfully configured."

#echo "[$SCRIPT_NAME] Setting up leader SSH login"
#SSH_KEY="/tmp/host_ssh_key"
#mkdir -p "$USER/.ssh"
#chmod 700 "/home/${USER}/.ssh"
#cat "${SSH_KEY}" > "/home/${USER}/.ssh/authorized_keys" 
#chmod 600 "/home/${USER}/.ssh/authorized_keys"
#chown -R ${USER}:${USER} "/home/${USER}/.ssh"

