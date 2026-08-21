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

# ---------------------------------------------------------------------------
# Safeguard
# ---------------------------------------------------------------------------

set -eu

if [ $# -ne 2 ]; then
    log_error "Usage: ${SCRIPT_NAME} <registry> <image:tag>"
    exit 1
fi

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

REGISTRY="$1"
IMAGE_TAG="$2"

IMAGE="${IMAGE_TAG%:*}"
TAG="${IMAGE_TAG##*:}"

REGISTRY_URL="https://${REGISTRY}"
MANIFEST_URL="${REGISTRY_URL}/v2/${IMAGE}/manifests/${TAG}"

CA_CERT="/etc/certs/ca.crt"
CLIENT_CERT="/home/${USER}/certs/worker.crt"
CLIENT_KEY="/home/${USER}/certs/worker.key"

REGISTRY_TIMEOUT=120
REGISTRY_INTERVAL=1

CURL_CONNECT_TIMEOUT=10
CURL_MAX_TIME=30

log_info "Registry: ${REGISTRY}"
log_info "Image: ${IMAGE}"
log_info "Tag: ${TAG}"

# ---------------------------------------------------------------------------
# Validate configuration
# ---------------------------------------------------------------------------

if [ ! -f "$CA_CERT" ]; then
    log_error "CA certificate not found: ${CA_CERT}"
    exit 1
fi

if [ ! -f "$CLIENT_CERT" ]; then
    log_error "Client certificate not found: ${CLIENT_CERT}"
    exit 1
fi

if [ ! -f "$CLIENT_KEY" ]; then
    log_error "Client key not found: ${CLIENT_KEY}"
    exit 1
fi

if [ "$IMAGE" = "$IMAGE_TAG" ]; then
    log_error "Image must include a tag: <image:tag>"
    exit 1
fi

# ---------------------------------------------------------------------------
# Temporary files
# ---------------------------------------------------------------------------

TMP_HEADERS="$(mktemp)"

cleanup() {
    rm -f "$TMP_HEADERS"
}

trap cleanup EXIT

# ---------------------------------------------------------------------------
# Check registry API
# ---------------------------------------------------------------------------

log_info "Checking registry API"

ELAPSED=0

while :; do
    if curl \
        --cacert "$CA_CERT" \
        --cert "$CLIENT_CERT" \
        --key "$CLIENT_KEY" \
        --connect-timeout "$CURL_CONNECT_TIMEOUT" \
        --max-time "$CURL_MAX_TIME" \
        -fsS \
        "${REGISTRY_URL}/v2/" \
        >/dev/null 2>&1
    then
        break
    fi

    if [ "$ELAPSED" -ge "$REGISTRY_TIMEOUT" ]; then
        log_error \
            "Registry did not become available after ${REGISTRY_TIMEOUT}s"
        exit 1
    fi

    printf '\r\033[K%b[INFO]%b[%s] Registry not ready (%d/%ds)' \
        "$COLOR_GREEN" \
        "$COLOR_RESET" \
        "$SCRIPT_NAME" \
        "$ELAPSED" \
        "$REGISTRY_TIMEOUT" >&4

    sleep "$REGISTRY_INTERVAL"
    ELAPSED=$((ELAPSED + REGISTRY_INTERVAL))
done

printf '\r\033[K' >&4
log_info "Registry API is available"

# ---------------------------------------------------------------------------
# Check image manifest
# ---------------------------------------------------------------------------

log_info "Checking image: ${IMAGE_TAG}"

HTTP_STATUS="$(
    curl \
        --cacert "$CA_CERT" \
        --cert "$CLIENT_CERT" \
        --key "$CLIENT_KEY" \
        --connect-timeout "$CURL_CONNECT_TIMEOUT" \
        --max-time "$CURL_MAX_TIME" \
        -sS \
        -D "$TMP_HEADERS" \
        -o /dev/null \
        -w '%{http_code}' \
        -H 'Accept: application/vnd.docker.distribution.manifest.list.v2+json' \
        -H 'Accept: application/vnd.oci.image.index.v1+json' \
        "$MANIFEST_URL"
)"

# ---------------------------------------------------------------------------
# Handle manifest response
# ---------------------------------------------------------------------------

case "$HTTP_STATUS" in
    200)
        log_info "Image ${IMAGE_TAG} exists"
        ;;

    404)
        log_warn "Image ${IMAGE_TAG} does not exist in the registry"
        exit 0
        ;;

    401|403)
        log_error \
            "Registry authentication/authorization failed for ${IMAGE_TAG}"
        log_error "Registry returned HTTP ${HTTP_STATUS}"
        exit 1
        ;;

    *)
        log_error "Failed to query ${IMAGE_TAG}"
        log_error "Registry returned HTTP ${HTTP_STATUS}"
        exit 1
        ;;
esac

# ---------------------------------------------------------------------------
# Get manifest digest
# ---------------------------------------------------------------------------

DIGEST="$(
    awk '
        BEGIN {
            IGNORECASE=1
        }

        /^Docker-Content-Digest:/ {
            sub(/\r$/, "")
            sub(/^Docker-Content-Digest:[[:space:]]*/, "")
            print
            exit
        }
    ' "$TMP_HEADERS"
)"

if [ -z "$DIGEST" ]; then
    log_error "Registry did not return Docker-Content-Digest"
    exit 1
fi

log_info "Manifest digest: ${DIGEST}"

# ---------------------------------------------------------------------------
# Delete manifest
# ---------------------------------------------------------------------------

log_info "Deleting image: ${IMAGE_TAG}"

DELETE_STATUS="$(
    curl \
        --cacert "$CA_CERT" \
        --cert "$CLIENT_CERT" \
        --key "$CLIENT_KEY" \
        --connect-timeout "$CURL_CONNECT_TIMEOUT" \
        --max-time "$CURL_MAX_TIME" \
        -sS \
        -o /dev/null \
        -w '%{http_code}' \
        -X DELETE \
        "${REGISTRY_URL}/v2/${IMAGE}/manifests/${DIGEST}"
)"

# ---------------------------------------------------------------------------
# Handle delete response
# ---------------------------------------------------------------------------

case "$DELETE_STATUS" in
    202)
        log_info "Image ${IMAGE_TAG} deleted successfully"
        ;;

    404)
        log_warn "Manifest ${DIGEST} no longer exists in the registry"
        ;;

    401|403)
        log_error \
            "Registry authentication/authorization failed while deleting ${IMAGE_TAG}"
        log_error "Registry returned HTTP ${DELETE_STATUS}"
        exit 1
        ;;

    *)
        log_error "Failed to delete image ${IMAGE_TAG}"
        log_error "Registry returned HTTP ${DELETE_STATUS}"
        exit 1
        ;;
esac

exit 0
