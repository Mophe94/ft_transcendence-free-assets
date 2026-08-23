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

script_help() {
    log_info "Usage: ${SCRIPT_NAME} <Target number of managers>"
}

set -euo pipefail

if [ $# -ne 1 ]; then
    script_help
    exit 1
elif [ "$1" -lt 1 ]; then
    log_error "TARGET_MANAGERS must be >= 1"
    exit 1
elif [ "$(($1 % 2))" -eq 0 ]; then
    log_error "TARGET_MANAGERS must be an odd number: $1"
    exit 1
else
    TARGET_MANAGERS="$1"
fi


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

PROMOTE_TIMEOUT=120
NODE_PROMOTE_TIMEOUT=30


# ---------------------------------------------------------------------------
# Docker Swarm Helpers
# ---------------------------------------------------------------------------

current_managers() {
    docker node ls --format '{{.ManagerStatus}}' |
        grep -Ec 'Leader|Reachable'
}

available_workers() {
    docker node ls \
        --filter role=worker \
        --format '{{.ID}} {{.Status}} {{.Availability}}' |
        awk '$2 == "Ready" && $3 == "Active" { count++ } END { print count+0 }'
}

node_manager_status() {
    local node_id="$1"

    docker node inspect "$node_id" \
        --format '{{.ManagerStatus.Reachability}}' 2>/dev/null
}

wait_for_manager() {
    local node_id="$1"
    local start_time
    local elapsed
    local role
    local reachability

    start_time="$(date +%s)"

    log_info "Waiting for node $node_id to become a reachable manager"

    while :; do
        role=$(docker node inspect "$node_id" \
            --format '{{.Spec.Role}}' 2>/dev/null)

        if [ "$role" != "manager" ]; then
            elapsed=$(( $(date +%s) - start_time ))

            if [ "$elapsed" -ge "$NODE_PROMOTE_TIMEOUT" ]; then
                log_error "Timeout waiting for node $node_id to become a manager (role: ${role:-unknown})"
                return 1
            fi

            sleep 1
            continue
        fi

        reachability=$(docker node inspect "$node_id" \
            --format '{{.ManagerStatus.Reachability}}' 2>/dev/null)

        case "${reachability,,}" in
            reachable|leader)
                return 0
                ;;
            "")
                ;;
            *)
                log_error "Unexpected manager status for node $node_id: $reachability"
                return 1
                ;;
        esac

        elapsed=$(( $(date +%s) - start_time ))

        if [ "$elapsed" -ge "$NODE_PROMOTE_TIMEOUT" ]; then
            log_error "Timeout waiting for node $node_id to become reachable (status: ${reachability:-unknown})"
            return 1
        fi

        sleep 1
    done
}


# ---------------------------------------------------------------------------
# Manager Promotion
# ---------------------------------------------------------------------------

log_info "Checking current Swarm manager state"

start_time="$(date +%s)"
managers="$(current_managers)"

while [ "$managers" -lt "$TARGET_MANAGERS" ]; do
    workers="$(available_workers)"

    log_info "Managers: $managers, available workers: $workers, target: $TARGET_MANAGERS"

    if [ "$managers" -ge "$TARGET_MANAGERS" ]; then
        log_info "Manager target reached: $managers/$TARGET_MANAGERS"
        exit 0
    fi

    max_reachable=$((managers + workers))

    # Swarm manager quorum requires an odd number of managers.
    if [ "$((max_reachable % 2))" -eq 0 ]; then
        max_reachable=$((max_reachable - 1))
    fi

    if [ "$max_reachable" -gt "$TARGET_MANAGERS" ]; then
        max_reachable="$TARGET_MANAGERS"
    fi

    if [ "$max_reachable" -le "$managers" ]; then
        log_warn "Not enough workers to reach the next manager quorum"
        log_warn "Current managers: $managers"
        log_warn "Available workers: $workers"
        log_warn "Target: $TARGET_MANAGERS"
        exit 1
    fi

    log_info "Will promote up to $max_reachable managers"

    elapsed=$(( $(date +%s) - start_time ))

    if [ "$elapsed" -ge "$PROMOTE_TIMEOUT" ]; then
        log_error "Manager promotion timeout"
        log_error "Current managers: $managers/$TARGET_MANAGERS"
        exit 1
    fi

    worker=$(
        docker node ls \
            --filter role=worker \
            --format '{{.ID}} {{.Status}} {{.Availability}}' |
        awk '$2 == "Ready" && $3 == "Active" { print $1; exit }'
    )

    if [ -z "$worker" ]; then
        log_warn "No available worker to promote"
        break
    fi

    log_info "Promoting worker $worker to manager"

    if ! docker node promote "$worker"; then
        log_error "Failed to promote node $worker"
        exit 1
    fi

    log_info "Node $worker promotion requested"

    if ! wait_for_manager "$worker"; then
        exit 1
    fi

    log_info "Node $worker is now a reachable manager"

    sleep 1
    managers="$(current_managers)"
done

log_info "Manager promotion completed: $managers/$TARGET_MANAGERS"
