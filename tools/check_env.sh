#!/bin/bash

SCRIPT_NAME="${0##*/}"
LOCATION="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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

if [ $# -ne 1 ]; then
    log_error "Invalid argument count"
    log_info "Usage: ${SCRIPT_NAME} <env_file_absolute_path>"
    exit 1
fi

if [ ! -f "$1" ]; then
    log_error "File not found: $1"
    log_info "Usage: ${SCRIPT_NAME} <env_file_absolute_path>"
    exit 1
else
    ENV_FILE="$1"
fi

# ---------------------------------------------------------------------------
# Environment Validation
# ---------------------------------------------------------------------------

log_info "Checking environment file: $ENV_FILE"

missing=false

while IFS='=' read -r key value; do
    # Skip empty lines and comments.
    [[ -z "${key// }" ]] && continue
    [[ "$key" =~ [[:space:]]*# ]] && continue

    # Trim surrounding whitespace.
    key=$(xargs <<<"$key")
    value=$(xargs <<<"$value")

    # Check for variables without a value.
    if [[ -z "$value" ]]; then
        log_warn "Missing value for: ${key}"
        missing=true
    fi
done < "$ENV_FILE"

# ---------------------------------------------------------------------------
# Result
# ---------------------------------------------------------------------------

if $missing; then
    log_error "One or more environment values are missing"
    log_info "Please set all required environment values"
    exit 1
else
    log_info "All environment variables are set"
    exit 0
fi
