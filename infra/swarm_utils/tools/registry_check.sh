#!/usr/bin/env bash

SCRIPT_NAME="${0##*/}"

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

COLOR_RESET='\033[0m'
COLOR_GREEN='\033[32m'
COLOR_ORANGE='\033[38;5;208m'
COLOR_RED='\033[31m'

LOGS_LOCATION="${LOGS_LOCATION:-"."}/${SCRIPT_NAME%.sh}"
LOG_FILE="${LOGS_LOCATION}/${SCRIPT_NAME%.sh}_$(date '+%Y-%m-%d_%H-%M-%S').log"

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

# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------

set -euo pipefail

if [ $# -ne 1 ]; then
    log_error "Invalid argument count"
    log_info "Usage: ${SCRIPT_NAME} <registry url>"
    exit 1
fi

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

REGISTRY="$1"
IMAGE="registry-healthcheck"
TAG="test-$(date +%s)"

# ---------------------------------------------------------------------------
# Registry Availability
# ---------------------------------------------------------------------------

TIMEOUT=120
INTERVAL=1
ELAPSED=0

log_info "Waiting for registry: $REGISTRY"

while ! curl \
    --cacert /etc/certs/ca.crt \
    --cert "/home/${USER}/certs/worker.crt" \
    --key "/home/${USER}/certs/worker.key" \
    -fsS \
    "https://${REGISTRY}/v2/" >/dev/null 2>&1; do

    if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
        log_error "Registry did not become available after ${TIMEOUT}s"
        exit 1
    fi

    printf "\r\033[K"

    log_info "Registry not ready (${ELAPSED}/${TIMEOUT}s)"

    sleep "$INTERVAL"
    ELAPSED=$((ELAPSED + INTERVAL))
done

log_info "Registry is ready"

# ---------------------------------------------------------------------------
# Test Image
# ---------------------------------------------------------------------------

log_info "Pulling test image"

docker pull alpine:latest >/dev/null

log_info "Tagging test image"

docker tag \
    alpine:latest \
    "${REGISTRY}/${IMAGE}:${TAG}"

log_info "Pushing test image"

docker push \
    "${REGISTRY}/${IMAGE}:${TAG}" >/dev/null

# ---------------------------------------------------------------------------
# Verify Registry
# ---------------------------------------------------------------------------

log_info "Verifying test image in registry"

TAGS=$(
    curl \
        --cacert /etc/certs/ca.crt \
        --cert "/home/${USER}/certs/worker.crt" \
        --key "/home/${USER}/certs/worker.key" \
        -fsS \
        "https://${REGISTRY}/v2/${IMAGE}/tags/list"
)

if ! echo "$TAGS" | grep -q "$TAG"; then
    log_error "Test image was not found in registry"
    exit 1
fi

log_info "Registry is healthy and accepting pushes"
