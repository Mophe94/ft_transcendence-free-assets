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
# Usage
# ---------------------------------------------------------------------------

addnote_help() {
    log_info "Usage: ${SCRIPT_NAME} <leader host ip> <node host ip> <join command> <NFS port>"
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

# ---------------------------------------------------------------------------
# Safeguard
# ---------------------------------------------------------------------------
set -eu

if [ $# -ne 4 ]; then
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

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

CA_CERT="/tmp/ca.crt"

# ---------------------------------------------------------------------------
# Install leader CA
# ---------------------------------------------------------------------------

if [ -f "$CA_CERT" ]; then
    doas mkdir -p /usr/local/share/ca-certificates
    doas rm -rf /usr/local/share/ca-certificates/leader-ca.crt
    doas cp "$CA_CERT" /usr/local/share/ca-certificates/leader-ca.crt
    doas update-ca-certificates

    log_info "CA certificate found"
else
    log_warn "CA certificate not found: $CA_CERT"
fi

# ---------------------------------------------------------------------------
# Configure Headscale
# ---------------------------------------------------------------------------

log_info "Connecting to Headscale"

AUTH_KEY="$(cat /tmp/headscale_authkey)"

doas tailscale up \
    --login-server="http://${LEADER_IP}:9090" \
    --authkey="${AUTH_KEY}" \
    --hostname="swarmnode.${USER}"

TAILSCALE_IP="$(tailscale ip -4)"

# ---------------------------------------------------------------------------
# Join Docker Swarm
# ---------------------------------------------------------------------------

if ! docker info 2>/dev/null | grep -q "Swarm: active"; then
    log_info "Joining Docker Swarm"

    docker swarm join \
        --advertise-addr "${TAILSCALE_IP}" \
        --data-path-addr "${TAILSCALE_IP}" \
        --token "${JOIN_CMD}" \
        "${LEADER_TAILSCALE_IP}:2377"
else
    log_info "Node already in the swarm"
fi

# ---------------------------------------------------------------------------
# Check NFS connectivity
# ---------------------------------------------------------------------------

if ! nc -z "$LEADER_TAILSCALE_IP" "$NFS_PORT"; then
    log_warn "Could not reach NFS server ${LEADER_TAILSCALE_IP}:${NFS_PORT}"
else
    log_info "NFS server ${LEADER_TAILSCALE_IP}:${NFS_PORT} reached"
fi

# ---------------------------------------------------------------------------
# Configure Docker certificates
# ---------------------------------------------------------------------------

log_info "Configuring Docker certificates"

doas mkdir -p "/etc/docker/certs.d/${LEADER_TAILSCALE_IP}:5050"
doas rm -rf "/etc/docker/cert.d/${LEADER_TAILSCALE_IP}:5050/client.*"
doas cp /tmp/worker.crt \
    "/etc/docker/certs.d/${LEADER_TAILSCALE_IP}:5050/client.cert"
doas cp /tmp/worker.key \
    "/etc/docker/certs.d/${LEADER_TAILSCALE_IP}:5050/client.key"

# ---------------------------------------------------------------------------
# Restart Docker
# ---------------------------------------------------------------------------

log_info "Restarting Docker"

doas rc-service docker restart

COUNTER=0
TIMEOUT=30

log_wait "Waiting for Docker to restart"

while ! docker info >/dev/null 2>&1; do
    if [ "$COUNTER" -ge "$TIMEOUT" ]; then
        printf '\n' >&4
        printf '\n' >&3
        log_error "Docker took too much time"
        exit 1
    fi

    COUNTER=$((COUNTER + 1))
    sleep 2

    printf '.' >&4
    printf '.' >&3
done

printf '\n' >&4
printf '\n' >&3

log_info "Worker successfully configured"
