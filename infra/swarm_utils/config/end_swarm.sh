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

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

SSH_PORT=2222
SSH_KEY="$HOME/.ssh/${USER}_transcendence_node"

# Timeouts in seconds
CURL_CONNECT_TIMEOUT=10
CURL_MAX_TIME=30
SSH_CONNECT_TIMEOUT=10
SSH_COMMAND_TIMEOUT=30
DOCKER_TIMEOUT=30

ENV_FILE="${ENV_FILE:-${SCRIPT_LOCATION}/.env}"

CURRENT_NODE="$(docker info --format '{{.Name}}')"
SWARM_STATE="$(docker info --format '{{.Swarm.LocalNodeState}}')"

log_info "Current node: ${CURRENT_NODE}"
log_info "Swarm status: ${SWARM_STATE}"

if [ "$SWARM_STATE" != "active" ]; then
    log_error "Docker Swarm is not active"
    exit 1
fi

if [ ! -f "$SSH_KEY" ]; then
    log_error "SSH key not found: ${SSH_KEY}"
    exit 1
fi

# ---------------------------------------------------------------------------
# Environment
# ---------------------------------------------------------------------------

get_env_value() {
    local wanted_key="$1"
    local key
    local value

    if [ ! -f "$ENV_FILE" ]; then
        log_error "Missing ${ENV_FILE}"
        return 1
    fi

    while IFS='=' read -r key value; do
        [[ -z "${key//[[:space:]]/}" ]] && continue
        [[ "$key" =~ ^[[:space:]]*\# ]] && continue

        key="${key#"${key%%[![:space:]]*}"}"
        key="${key%"${key##*[![:space:]]}"}"

        if [ "$key" = "$wanted_key" ]; then
            printf '%s' "$value"
            return 0
        fi
    done < "$ENV_FILE"

    return 1
}

# ---------------------------------------------------------------------------
# 42 API
# ---------------------------------------------------------------------------

get_42_token() {
    local client_id
    local client_secret

    client_id="$(get_env_value s_fortytwo_client_id)" || return 1
    client_secret="$(get_env_value s_fortytwo_client_secret)" || return 1

    curl \
        --fail \
        --silent \
        --show-error \
        --connect-timeout "$CURL_CONNECT_TIMEOUT" \
        --max-time "$CURL_MAX_TIME" \
        -X POST \
        -H "Content-Type: application/x-www-form-urlencoded" \
        --data-urlencode "grant_type=client_credentials" \
        --data-urlencode "client_id=$client_id" \
        --data-urlencode "client_secret=$client_secret" \
        "https://api.intra.42.fr/oauth/token" |
        jq -r '.access_token'

    unset client_id client_secret
}

get_user_host() {
    local user="$1"
    local token
    local host

    if [ -z "$user" ]; then
        return 1
    fi

    token="$(get_42_token)" || {
        log_error "Failed to get 42 API token"
        return 1
    }

    if [ -z "$token" ] || [ "$token" = "null" ]; then
        log_error "Empty 42 API token"
        unset token
        return 1
    fi

    host="$(
        curl \
            --fail \
            --silent \
            --show-error \
            --connect-timeout "$CURL_CONNECT_TIMEOUT" \
            --max-time "$CURL_MAX_TIME" \
            -H "Authorization: Bearer $token" \
            "https://api.intra.42.fr/v2/users/${user}/locations" |
        jq -er '
            map(select(.end_at == null))
            | .[0].host // empty
        '
    )" || {
        log_warn "No current location found for ${user}"
        unset token
        return 1
    }

    if [ -z "$host" ]; then
        log_warn "No current location found for ${user}"
        unset token
        return 1
    fi

    printf '%s' "$host"

    unset token host
    return 0
}

# ---------------------------------------------------------------------------
# Host validation
# ---------------------------------------------------------------------------

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

is_location() {
    local location="$1"

    [[ "$location" =~ ^(shi|fu|mi)-(r|c)[0-9]+-p[0-9]+$ ]]
}

# ---------------------------------------------------------------------------
# Resolve SSH host
# ---------------------------------------------------------------------------

get_node_host() {
    local user="$1"
    local host

    log_info "Resolving host for ${user}"

    if ! host="$(get_user_host "$user")"; then
        log_warn "Could not determine current host for ${user}"
        return 1
    fi

    if is_ip "$host"; then
        log_info "42 API returned IP for ${user}: ${host}"
        printf '%s' "$host"
        return 0
    fi

    if is_location "$host"; then
        log_info "42 API returned location for ${user}: ${host}"
        printf '%s' "$host"
        return 0
    fi

    log_error "Invalid host returned for ${user}: ${host}"
    return 1
}

# ---------------------------------------------------------------------------
# Process Swarm nodes
# ---------------------------------------------------------------------------

while IFS=$'\t' read -r NODE_NAME NODE_ID NODE_MANAGER_STATUS; do

    [ -z "$NODE_NAME" ] && continue

    # -----------------------------------------------------------------------
    # Skip current node
    # -----------------------------------------------------------------------

    if [ "$NODE_NAME" = "$CURRENT_NODE" ]; then
        log_info "Skipping current node: ${NODE_NAME}"
        continue
    fi

    # -----------------------------------------------------------------------
    # Extract SSH username
    # -----------------------------------------------------------------------

    if [[ "$NODE_NAME" != swarmnode.* ]]; then
        log_warn "Skipping ${NODE_NAME}: invalid hostname format"
        continue
    fi

    SSH_USER="${NODE_NAME#swarmnode.}"

    log_info "Processing node: ${NODE_NAME}"
    log_info "SSH user: ${SSH_USER}"

    # -----------------------------------------------------------------------
    # Resolve SSH host
    # -----------------------------------------------------------------------

    if ! NODE_HOST="$(get_node_host "$SSH_USER")"; then
        log_error "Could not determine host for ${NODE_NAME}"
        continue
    fi

    log_info "Node host: ${NODE_HOST}"

    # -----------------------------------------------------------------------
    # Demote manager
    # -----------------------------------------------------------------------

    if [ "$NODE_MANAGER_STATUS" = "Leader" ] ||
       [ "$NODE_MANAGER_STATUS" = "Reachable" ]; then

        log_info "Node ${NODE_NAME} is a manager"
        log_info "Demoting ${NODE_NAME}"

        if timeout "$DOCKER_TIMEOUT" \
            docker node demote "$NODE_ID"; then

            log_info "Node ${NODE_NAME} successfully demoted"

        else
            log_error "Failed to demote ${NODE_NAME}"
            continue
        fi
    fi

    # -----------------------------------------------------------------------
    # Ask remote node to leave Swarm
    # -----------------------------------------------------------------------

    log_info "Asking ${NODE_NAME} to leave the Swarm"

    if timeout "$SSH_COMMAND_TIMEOUT" \
        ssh \
        -i "$SSH_KEY" \
        -p "$SSH_PORT" \
        -o BatchMode=yes \
        -o ConnectTimeout="$SSH_CONNECT_TIMEOUT" \
        -o StrictHostKeyChecking=no \
        "${SSH_USER}@${NODE_HOST}" \
        'docker swarm leave --force' \
        < /dev/null
    then

        log_info "Node ${NODE_NAME} left the Swarm"

    else
        log_warn "Failed to make ${NODE_NAME} leave the Swarm"
        log_warn "Removing ${NODE_NAME} from manager anyway"
    fi

    # -----------------------------------------------------------------------
    # Remove node from manager
    # -----------------------------------------------------------------------

    if timeout "$DOCKER_TIMEOUT" \
        docker node inspect "$NODE_ID" >/dev/null 2>&1; then

        log_info "Removing ${NODE_NAME} from Swarm manager"

        if timeout "$DOCKER_TIMEOUT" \
            docker node rm --force "$NODE_ID" >/dev/null; then

            log_info "Node ${NODE_NAME} removed from Swarm manager"

        else
            log_warn "Failed to remove ${NODE_NAME} from Swarm manager"
        fi
    fi

done < <(
    docker node ls --format '{{.Hostname}}\t{{.ID}}\t{{.ManagerStatus}}'
)

# ---------------------------------------------------------------------------
# Final status
# ---------------------------------------------------------------------------

log_info "Swarm cleanup completed"

printf '\n' >&4

printf '%s\n' \
    "============================================================" >&4

printf '%s\n' \
    "                 REMAINING SWARM NODES" >&4

printf '%s\n' \
    "============================================================" >&4

docker node ls >&4

printf '%s\n' \
    "============================================================" >&4
