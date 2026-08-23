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

# Log command output to both the terminal and log file
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

addnode_help() {
    log_info "Usage: ${SCRIPT_NAME} <leader IP> <leader Tailscale IP> <node user> [node user ...]"
}

set -euo pipefail

if [ $# -lt 2 ]; then
    addnode_help
    exit 1
fi


# ---------------------------------------------------------------------------
# Environment Configuration
# ---------------------------------------------------------------------------

get_env_value() {
    local wanted_key="$1"
    local key
    local value

    if [ ! -f "$ENV_FILE" ]; then
        log_error "Missing $ENV_FILE"
        exit 1
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

    client_id="$(get_env_value API_42_CLIENT_ID)" || return 1
    client_secret="$(get_env_value s_fortytwo_client_secret)" || return 1

    curl -fsS \
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
        curl -fsS \
            -H "Authorization: Bearer $token" \
            "https://api.intra.42.fr/v2/users/${user}/locations" |
        jq -er '
            map(select(.end_at == null))
            | .[0].host // empty
        '
    )" || {
        log_info "No current location found for $user"
        unset token
        return 1
    }

    if [ -z "$host" ]; then
        log_info "No current location found for $user"
        unset token
        return 1
    fi

    printf '%s' "$host"

    unset token host
    return 0
}


# ---------------------------------------------------------------------------
# Bootstrap Password Management
# ---------------------------------------------------------------------------

consume_node_password() {
    local user="$1"
    local key="p_node_${user}"
    local tmp_file

    tmp_file="$(mktemp "${ENV_FILE}.XXXXXX")" || return 1

    if ! sed "/^[[:space:]]*${key}[[:space:]]*=/d" "$ENV_FILE" > "$tmp_file"; then
        rm -f "$tmp_file"
        return 1
    fi

    if ! cat "$tmp_file" > "$ENV_FILE"; then
        rm -f "$tmp_file"
        return 1
    fi

    rm -f "$tmp_file"
}


# ---------------------------------------------------------------------------
# Validation Helpers
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
# Arguments
# ---------------------------------------------------------------------------

if ! is_ip "$1" || ! is_ip "$2"; then
    addnode_help
    exit 1
fi

LEADER_IP="$1"
LEADER_TAILSCALE_IP="$2"
shift 2

NODE_USERS=("$@")


# ---------------------------------------------------------------------------
# Swarm Configuration
# ---------------------------------------------------------------------------

WORKER_JOIN_CMD="$(docker swarm join-token -q worker)"

TARGET_MANAGERS=3
JOIN_CMD="$WORKER_JOIN_CMD"

SSH_KEY_NAME="${USER}_transcendence_node"
SSH_KEY_PASSPHRASE=
SSH_PORT=2222
SSH_KEY="$HOME/.ssh/${SSH_KEY_NAME}"
PUB_KEY="$SSH_KEY.pub"

VM_TARGET_DIR="/tmp/"

NODE_JOIN_TIMEOUT=120


# ---------------------------------------------------------------------------
# SSH Key Bootstrap
# ---------------------------------------------------------------------------

if [ ! -f "$PUB_KEY" ]; then
    log_info "Generating SSH key: $SSH_KEY"

    ssh-keygen -t ed25519 \
        -f "$SSH_KEY" \
        -N "$SSH_KEY_PASSPHRASE"
else
    log_info "SSH key already exists: $SSH_KEY"
fi


# ---------------------------------------------------------------------------
# Connect Nodes
# ---------------------------------------------------------------------------

CONNECTED_NODES=()

for user in "${NODE_USERS[@]}"; do
    try=0

    if [ "$user" = "$USER" ]; then
        log_info "Skipping current user: $user"
        continue
    elif docker node ls --format '{{.Hostname}}' |
        grep -Fxq "swarmnode.$user"; then

        log_info "$user already belongs to the swarm"
        continue
    fi

    log_info "Connecting to $user node"

    if ! HOST_IP="$(get_user_host "$user")"; then
        continue
    fi

    if ! { is_ip "$HOST_IP" || is_location "$HOST_IP"; }; then
        log_warn "Unable to determine a valid host for $user"

        while [ "$try" -lt 3 ]; do
            read -p "[$SCRIPT_NAME] IP of $user node host machine: " answer

            if [ -z "$answer" ] ||
               ! { is_ip "$answer" || is_location "$answer"; }; then

                log_warn "Invalid IP or location input"
                answer=""
                try=$((try + 1))
            else
                HOST_IP="$answer"
                break
            fi
        done
    fi

    if [ "$try" -eq 3 ]; then
        log_warn "Too many attempts for $user, skipping node"
        continue
    fi

    pub_key="$(cat "$PUB_KEY")"

    # -----------------------------------------------------------------------
    # Retrieve Bootstrap Password
    # -----------------------------------------------------------------------

    password_from_env=false

    if password="$(get_env_value "p_node_${user}")"; then
        password_from_env=true
        log_info "Using configured bootstrap password for $user"
    else
        log_warn "No password configured for $user"

        IFS= read -r -s -p "[$SCRIPT_NAME] Password for $user: " password
        echo >&2
    fi

    # -----------------------------------------------------------------------
    # Install SSH Key
    # -----------------------------------------------------------------------

    try=0

    while [ "$try" -lt 3 ]; do
        if SSHPASS="$password" sshpass -e \
            ssh \
            -i "$SSH_KEY" \
            -p "$SSH_PORT" \
            -o StrictHostKeyChecking=no \
            -o PreferredAuthentications=password \
            -o PubkeyAuthentication=no \
            "${user}@${HOST_IP}" \
            "mkdir -p ~/.ssh && \
             chmod 700 ~/.ssh && \
             grep -qxf \"$pub_key\" ~/.ssh/authorized_keys 2>/dev/null || \
             echo \"$pub_key\" >> ~/.ssh/authorized_keys && \
             chmod 600 ~/.ssh/authorized_keys"
        then
            log_info "SSH key installed for $user"

            # Remove the bootstrap password after successful authentication.
            if [ "$password_from_env" = true ]; then
                if ! consume_node_password "$user"; then
                    log_error "Failed to remove bootstrap password for $user"
                    unset password
                    continue
                fi

                try=3
            fi

            unset password

            # From this point onward, authenticate using the SSH key.
            log_info "Installing swarm bootstrap files on $user"

            ssh -i "$SSH_KEY" \
                -p "$SSH_PORT" \
                -o StrictHostKeyChecking=no \
                "${user}@${HOST_IP}" \
                "doas rm -rf ${VM_TARGET_DIR}/worker.* ca.crt"

            doas scp \
                -i "$SSH_KEY" \
                -r \
                -P "$SSH_PORT" \
                -o StrictHostKeyChecking=no \
                /etc/certs/ca.crt \
                "/home/${USER}/certs/worker.crt" \
                "/home/${USER}/certs/worker.key" \
                "${user}@${HOST_IP}:${VM_TARGET_DIR}"

            doas scp \
                -i "$SSH_KEY" \
                -r \
                -P "$SSH_PORT" \
                -o StrictHostKeyChecking=no \
                /etc/headscale_authkey \
                "${user}@${HOST_IP}:${VM_TARGET_DIR}/headscale_authkey"

            log_info "Starting swarm setup on $user"

            ssh \
                -i "$SSH_KEY" \
                -p "$SSH_PORT" \
                "$user@$HOST_IP" \
                "doas chmod +x /setup_for_swarm.sh; \
                 doas nohup /setup_for_swarm.sh \
                 ${LEADER_IP} \
                 ${LEADER_TAILSCALE_IP} \
                 \"${JOIN_CMD}\" \
                 2049 \
                 >/tmp/setup_for_swarm.log 2>&1 < /dev/null &"

            CONNECTED_NODES+=("$user")

            log_info "Swarm setup started successfully on $user"

            break
        else
            log_error "Could not authenticate to $user node"

            try=$((try + 1))

            if [ "$try" -lt 3 ]; then
                log_warn "Retrying authentication for $user"
            else
                log_warn "Too many authentication attempts for $user, skipping node"
                unset password
            fi
        fi
    done
done


# ---------------------------------------------------------------------------
# Wait For Nodes To Join
# ---------------------------------------------------------------------------

ADDED_NODES=0

for user in "${CONNECTED_NODES[@]}"; do
    [ -z "$user" ] && continue
    [ "$user" = "$USER" ] && continue

    log_info "Waiting for $user to join the swarm"

    start_time="$(date +%s)"

    while :; do
        if docker node ls --format '{{.Hostname}}' |
            grep -Fxq "swarmnode.$user"; then

            log_info "$user joined the swarm"

            ADDED_NODES=$((ADDED_NODES + 1))
            break
        fi

        elapsed=$(( $(date +%s) - start_time ))

        if [ "$elapsed" -ge "$NODE_JOIN_TIMEOUT" ]; then
            log_error "Timeout waiting for node $user to join the swarm"
            break
        fi

        sleep 2
    done
done

log_info "Node addition completed: $ADDED_NODES node(s) added"
