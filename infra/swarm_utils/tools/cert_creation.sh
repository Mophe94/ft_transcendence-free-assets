#!/bin/bash

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

if [ $# -ne 3 ]; then
    log_error "Invalid argument count"
    log_info "Usage: ${SCRIPT_NAME} <ca_dir_absolute_path> <subj> <certificate_name>"
    exit 1
fi

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

CA_DIR="$1"
SUBJ="$2"
CERT_NAME="$3"
CERT_DIR="$HOME/certs/"

mkdir -p "$CERT_DIR"
cd "$CERT_DIR"

# ---------------------------------------------------------------------------
# Private Key
# ---------------------------------------------------------------------------

if [ ! -f "${CERT_NAME}.key" ]; then
    log_info "Generating ${CERT_NAME} private key"

    openssl genrsa \
        -out "${CERT_NAME}.key" \
        4096
else
    log_info "${CERT_NAME} private key already exists"
fi

# ---------------------------------------------------------------------------
# Certificate Signing Request
# ---------------------------------------------------------------------------

if [ ! -f "${CERT_NAME}.csr" ]; then
    log_info "Generating ${CERT_NAME} CSR"

    cat > "${CERT_NAME}.cnf" <<EOF
[req]
default_bits = 4096
default_md = sha256
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
CN = ${SUBJ}

[v3_req]
subjectAltName = @alt_names

[alt_names]
IP.1 = ${SUBJ}
DNS.1 = ${CERT_NAME}
EOF

    openssl req -new \
        -key "${CERT_NAME}.key" \
        -out "${CERT_NAME}.csr" \
        -config "${CERT_NAME}.cnf"
else
    log_info "${CERT_NAME} CSR already exists"
fi

# ---------------------------------------------------------------------------
# Certificate Signing
# ---------------------------------------------------------------------------

if [ ! -f "${CERT_NAME}.crt" ]; then
    log_info "Signing ${CERT_NAME} certificate"

    doas openssl x509 -req \
        -in "${CERT_NAME}.csr" \
        -CA "${CA_DIR}/ca.crt" \
        -CAkey "${CA_DIR}/ca.key" \
        -CAcreateserial \
        -CAserial "./ca.srl" \
        -out "${CERT_NAME}.crt" \
        -days 30 \
        -sha256 \
        -extensions v3_req \
        -extfile "${CERT_NAME}.cnf"
else
    log_info "${CERT_NAME} certificate already exists"
fi

# ---------------------------------------------------------------------------
# Cleanup
# ---------------------------------------------------------------------------

if [ -f "${CERT_NAME}" ]; then
    log_info "Removing temporary certificate files"
    rm -f "${CERT_NAME}.cnf"
fi

log_info "Certificate setup completed successfully"
