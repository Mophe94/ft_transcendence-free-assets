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
# Validation
# ---------------------------------------------------------------------------

set -e

if [ $# -ne 2 ]; then
    log_error "Usage: ${SCRIPT_NAME} <certs directory path> <IP>"
    exit 1
fi

CERT_DIR="$1"
IP="$2"

if [ -z "$CERT_DIR" ]; then
    log_error "Certificate directory path is empty"
    exit 1
fi

if [ -z "$IP" ]; then
    log_error "IP address is empty"
    exit 1
fi

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

CERT_INFO_FILE="${CERT_DIR}/cert_info.env"
CA_KEY="${CERT_DIR}/ca.key"
CA_CERT="${CERT_DIR}/ca.crt"
SYSTEM_CA_CERT="/usr/local/share/ca-certificates/transcendence-root-ca.crt"

# ---------------------------------------------------------------------------
# Certificate Directory
# ---------------------------------------------------------------------------

log_info "Setting up certificate directory"

mkdir -p "$CERT_DIR"

cd "$CERT_DIR"

# ---------------------------------------------------------------------------
# Generate Certificate Authority
# ---------------------------------------------------------------------------

log_info "Generating CA private key"

openssl genrsa \
    -out "$CA_KEY" \
    4096

# ---------------------------------------------------------------------------
# Generate Certificate Authority Certificate
# ---------------------------------------------------------------------------

log_info "Generating CA certificate"

if [ -f "$CERT_INFO_FILE" ]; then
    log_info "Loading certificate information"

    # shellcheck disable=SC1090
    source "$CERT_INFO_FILE"

    SUBJECT="/C=${COUNTRY}/ST=${STATE}/L=${CITY}/O=${ORG}/OU=${OU}/CN=${IP}"

    log_info "Using configured certificate subject"

    openssl req \
        -x509 \
        -new \
        -nodes \
        -key "$CA_KEY" \
        -sha256 \
        -days 30 \
        -out "$CA_CERT" \
        -subj "$SUBJECT"
else
    log_warn "Certificate information file not found: $CERT_INFO_FILE"
    log_info "Generating CA certificate without a predefined subject"

    openssl req \
        -x509 \
        -new \
        -nodes \
        -key "$CA_KEY" \
        -sha256 \
        -days 30 \
        -out "$CA_CERT"
fi

# ---------------------------------------------------------------------------
# Install System CA Certificate
# ---------------------------------------------------------------------------

log_info "Installing CA certificate into system trust store"

if [ -f "$SYSTEM_CA_CERT" ]; then
    log_info "Removing existing system CA certificate"

    doas rm -f "$SYSTEM_CA_CERT"

    update-ca-certificates
fi

doas cp "$CA_CERT" "$SYSTEM_CA_CERT"

update-ca-certificates

# ---------------------------------------------------------------------------
# Completion
# ---------------------------------------------------------------------------

log_info "Certificate setup complete"
log_info "CA certificate: $CA_CERT"
