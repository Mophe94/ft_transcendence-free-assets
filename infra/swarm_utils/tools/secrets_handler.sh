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

if [ $# -gt 1 ]; then
    log_error "Invalid argument count"
    log_info "Usage: ${SCRIPT_NAME} <secret_file_path>"
    exit 1
fi

if [ ! -f "$1" ]; then
    log_error "File not found: $1"
    exit 1
else
    SECRETS_FILE="$1"
fi

# ---------------------------------------------------------------------------
# Docker Secrets
# ---------------------------------------------------------------------------

log_info "Loading secrets from: $SECRETS_FILE"

while IFS='=' read -r key value; do
    # Skip empty lines and comments.
    [[ -z "${key// }" ]] && continue
    [[ "$key" =~ [[:space:]]*# ]] && continue

    # Only process secret variables.
    [[ "${key,,}" == s_* ]] || continue

    # Trim surrounding whitespace.
    key=$(xargs <<<"$key")
    value=$(xargs <<<"$value")

    # Skip variables without a value.
    [[ -z "${value// }" ]] && continue

    # -----------------------------------------------------------------------
    # Create Docker Secret
    # -----------------------------------------------------------------------

    secret_name="${key,,}"
    secret_name="${secret_name#s_}"

    if docker secret inspect "$secret_name" >/dev/null 2>&1; then
        log_info "Secret already exists: ${secret_name}"
    else
        log_info "Creating secret: ${secret_name}"

        echo -n "$value" |
            docker secret create "$secret_name" -
    fi

done < "$SECRETS_FILE"

log_info "Secrets loaded successfully"
