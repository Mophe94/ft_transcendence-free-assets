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

set -euo pipefail

if [ $# -ne 3 ]; then
    log_error "Usage: $SCRIPT_NAME <swarm_utils directory> <host IP> <Tailscale IP>"
    exit 1
fi


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

UTILS_DIR="$1"
HOST_IP="$2"
HOST_TAILSCALE_IP="$3"

IP="$(ip -4 route get 1.1.1.1 |
    awk '{for(i=1;i<=NF;i++) if($i=="src") print $(i+1)}')"

CONFIG_DIR="${UTILS_DIR}/config"
TOOLS_DIR="${UTILS_DIR}/tools"
SECRET_FILE="${ENV_FILE:-"$HOME/infra/.env"}"


# ---------------------------------------------------------------------------
# Certificate Setup
# ---------------------------------------------------------------------------

log_info "Creating swarm certificates"

chmod +x "$CONFIG_DIR/create_swarm_certs.sh"

bash \
    "${CONFIG_DIR}/create_swarm_certs.sh" \
    "${TOOLS_DIR}/cert_creation.sh" \
    "${HOST_TAILSCALE_IP}"


# ---------------------------------------------------------------------------
# Docker Swarm Initialization
# ---------------------------------------------------------------------------

if [ "$(docker info --format '{{.Swarm.LocalNodeState}}')" != "active" ]; then
    log_info "Initializing Docker Swarm"

    docker swarm init \
        --advertise-addr "$HOST_TAILSCALE_IP" \
        --data-path-addr "$HOST_TAILSCALE_IP"

    log_info "Docker Swarm initialized"
else
    log_info "Docker Swarm is already initialized"
fi


# ---------------------------------------------------------------------------
# Leader Node Configuration
# ---------------------------------------------------------------------------

leader_node="$(
    docker node ls \
        --format '{{.ID}} {{.ManagerStatus}}' |
    awk '/Leader/ {print $1}'
)"

log_info "Adding leader label to node $leader_node"

docker node update \
    --label-add leader=true \
    "$leader_node"


# ---------------------------------------------------------------------------
# Docker Secrets
# ---------------------------------------------------------------------------

log_info "Checking Docker Swarm secrets"

if docker secret inspect nginx_crt >/dev/null 2>&1 &&
   docker secret inspect nginx_key >/dev/null 2>&1; then

    log_info "Nginx secrets already exist"
else
    log_info "Creating Nginx secrets"

    docker secret create nginx_crt "$HOME/certs/nginx.crt"
    docker secret create nginx_key "$HOME/certs/nginx.key"
fi

if docker secret inspect registry_crt >/dev/null 2>&1 &&
   docker secret inspect registry_key >/dev/null 2>&1; then

    log_info "Registry secrets already exist"
else
    log_info "Creating registry secrets"

    docker secret create registry_crt "$HOME/certs/registry.crt"
    docker secret create registry_key "$HOME/certs/registry.key"
fi

if docker secret inspect worker_crt >/dev/null 2>&1 &&
   docker secret inspect worker_key >/dev/null 2>&1; then

    log_info "Worker secrets already exist"
else
    log_info "Creating worker secrets"

    docker secret create worker_crt "$HOME/certs/worker.crt"
    docker secret create worker_key "$HOME/certs/worker.key"
fi

if docker secret inspect ca_crt >/dev/null 2>&1; then
    log_info "CA secret already exists"
else
    log_info "Creating CA secret"

    docker secret create ca_crt "/etc/certs/ca.crt"
fi


# ---------------------------------------------------------------------------
# Overlay Networks
# ---------------------------------------------------------------------------

networks=(
    "swarm_net"
    "obsrv_net"
    "games_net"
    "site_net"
)

log_info "Checking required overlay networks"

for network in "${networks[@]}"; do
    if ! docker network inspect "$network" >/dev/null 2>&1; then
        docker network create \
            --driver overlay \
            --attachable \
            --internal \
            --opt "com.docker.network.driver.mtu=1250" \
            "$network" >/dev/null 2>&1

        log_info "Created overlay network: $network"
    else
        log_info "Overlay network already exists: $network"
    fi
done


# ---------------------------------------------------------------------------
# Preconfigured Nodes
# ---------------------------------------------------------------------------

read -p "[$SCRIPT_NAME] Do you want to add preconfigured nodes (y/N): " \
    -t 5 \
    answer || {
        echo
        answer="yes"
    }

case "${answer,,}" in
    y|yes)
        log_info "Adding preconfigured nodes"

        chmod +x "${CONFIG_DIR}/add_node.sh"

        bash \
            "${CONFIG_DIR}/add_node.sh" \
            "${HOST_IP}" \
            "${HOST_TAILSCALE_IP}" \
            agaland \
            bertrmar \
            dbajeux \
            kprist \
            stempels
        ;;
    *)
        log_info "No preconfigured nodes requested"
        ;;
esac


# ---------------------------------------------------------------------------
# Manager Configuration
# ---------------------------------------------------------------------------

log_info "Configuring Docker Swarm managers"

chmod +x "$CONFIG_DIR/add_manager.sh"

if ! bash "$CONFIG_DIR/add_manager.sh" "$MANAGER_NUMBER"; then
    log_warn "Manager configuration did not reach the requested target"

    read -p "[$SCRIPT_NAME] Do you wish to continue: " \
        -t 5 \
        answer || {
            echo
            answer="Yes"
        }

    case "${answer,,}" in
        y|yes)
            log_info "Continuing despite manager configuration failure"
            ;;
        *)
            log_error "Setup aborted"
            exit 1
            ;;
    esac
fi


# ---------------------------------------------------------------------------
# Environment Secrets
# ---------------------------------------------------------------------------

if [ ! -f "$SECRET_FILE" ]; then
    log_warn "Secret file not found: $SECRET_FILE"
else
    log_info "Loading Docker secrets from $SECRET_FILE"

    chmod +x "$TOOLS_DIR/secrets_handler.sh"

    bash \
        "$TOOLS_DIR/secrets_handler.sh" \
        "$SECRET_FILE"
fi


# ---------------------------------------------------------------------------
# Final Swarm Status
# ---------------------------------------------------------------------------

log_info "Docker Swarm service status"

docker service ls

printf '\n'

log_info "Swarm setup completed successfully"
