#!/bin/bash

#Safeguard
SCRIPT_NAME="${0##*/}"
set -eu

addnote_help() {
    echo "[INFO] Script Usage: ${SCRIPT_NAME} <leader host ip> <node host ip> <join command> <NFS port>"
}

is_ip() {
    local ip="$1"
    local octet

    echo "$ip" | grep -Eq '^([0-9]{1,3}\.){3}[0-9]{1,3}$' || return 1

    IFS='.' read -r -a octets <<< "$ip"

    for octet in "${octets[@]}"; do
        if [ "$octet" -gt 255 ]; then
            return 1
        fi
    done

    return 0
}

if [ ! $# -eq 4 ]; then
    addnote_help
    exit 1
elif ! is_ip "$1" \
  || ! is_ip "$2" \
  || [ -z "$3" ] \
  || [ -z "$4" ]; then
    addnote_help
    exit 1
else
    LEADER_IP="$1"
    LEADER_TAILSCALE_IP="$2"
    JOIN_CMD="$3"
    NFS_PORT="$4"
fi

# Path to the CA certificate copied by the leader
CA_CERT="/tmp/ca.crt"

# Install leader CA
if [ -f "$CA_CERT" ]; then
    doas mkdir -p /usr/local/share/ca-certificates
    doas rm -rf /usr/local/share/ca-certificates/leader-ca.crt
    doas cp "$CA_CERT" /usr/local/share/ca-certificates/leader-ca.crt
    doas update-ca-certificates
    echo "[INFO[$SCRIPT_NAME]: CA certificate found"
else
    echo "[WARNING][$SCRIPT_NAME]: CA certificate not found: $CA_CERT"
fi

echo "[${SCRIPT_NAME}] Connecting to Headscale"

AUTH_KEY=$(cat /tmp/headscale_authkey)

doas tailscale up \
    --login-server=http://${LEADER_IP}:9090 \
    --authkey="${AUTH_KEY}" \
    --hostname="swarmnode.${USER}"

TAILSCALE_IP=$(tailscale ip -4)

if ! docker info 2>/dev/null | grep -q "Swarm: active"; then
    docker swarm join \
        --advertise-addr "${TAILSCALE_IP}" \
        --data-path-addr "${TAILSCALE_IP}" \
        --token "${JOIN_CMD}" \
        "${LEADER_TAILSCALE_IP}:2377"
else
    echo "[INFO][$SCRIPT_NAME] Node already in the swarm"
fi

# Check NFS connectivity
if ! nc -z "$LEADER_TAILSCALE_IP" ${NFS_PORT}; then
    echo "[WARNING][$SCRIPT_NAME]: Could not reach NFS server ${LEADER_TAILSCALE_IP}:${NFS_PORT}"
else
    echo "[INFO][$SCRIPT_NAME]: NFS server ${LEADER_TAILSCALE_IP}:${NFS_PORT} reached"
fi

# Adding certificates to docker
doas mkdir -p /etc/docker/certs.d/${LEADER_TAILSCALE_IP}:5050
doas rm -rf /etc/docker/cert.d/${LEADER_TAILSCALE_IP}:5050/client.*
doas cp /tmp/worker.crt /etc/docker/certs.d/${LEADER_TAILSCALE_IP}:5050/client.cert
doas cp /tmp/worker.key /etc/docker/certs.d/${LEADER_TAILSCALE_IP}:5050/client.key

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

echo "[INFO][$SCRIPT_NAME] Worker successfully configured."
