#! /bin/bash
SCRIPT_NAME="${0##*/}"

# Safeguard
script_help() {
    echo "[INFO] Usage: ${SCRIPT_NAME} <Target number of managers>"
}

if [ $# -ne 1 ]; then
    script_help
    exit 1
elif [ "$1" -lt 1 ]; then
    echo "[ERROR][$SCRIPT_NAME] TARGET_MANAGERS must be >= 1"
    exit 1
elif [ "$(($1 % 2))" -eq 0 ]; then
    echo "[ERROR][$SCRIPT_NAME] TARGET_MANAGERS must be odd: $TARGET_MANAGERS"
    exit 1
else
    TARGET_MANAGERS="$1"
fi

# Variables
PROMOTE_TIMEOUT=120
NODE_PROMOTE_TIMEOUT=30

# Helpers
current_managers() {
    docker node ls --format '{{.ManagerStatus}}' |
        grep -Ec 'Leader|Reachable'
}

available_workers() {
    docker node ls \
        --filter role=worker \
        --filter availability=active \
        --format '{{.ID}}' |
        wc -l
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

    start_time=$(date +%s)
    while :; do
        role=$(docker node inspect "$node_id" \
            --format '{{.Spec.Role}}' 2>/dev/null)
        if [ "$role" != "manager" ]; then
            elapsed=$(( $(date +%s) - start_time ))
            if [ "$elapsed" -ge "$NODE_PROMOTE_TIMEOUT" ]; then
                echo "[ERROR][$SCRIPT_NAME] Timeout waiting for node $node_id to become a manager (role: ${role:-unknown})"
                return 1
            fi
            sleep 1
            continue
        fi
        reachability=$(docker node inspect "$node_id" \
            --format '{{.ManagerStatus.Reachability}}' 2>/dev/null)
        case "$reachability" in
            Reachable|Leader) return 0;;
            "");;
            *) echo "[ERROR][$SCRIPT_NAME] Unexpected status for node $node_id: $reachability"
               return 1;;
        esac
        elapsed=$(( $(date +%s) - start_time ))
        if [ "$elapsed" -ge "$NODE_PROMOTE_TIMEOUT" ]; then
            echo "[ERROR][$SCRIPT_NAME] Timeout waiting for node $node_id to become reachable (status: ${reachability:-unknown})"
            return 1
        fi
        sleep 1
    done
}

# Promoting
start_time=$(date +%s)
managers=$(current_managers)
while [ "$managers" -ge "$TARGET_MANAGERS" ]; do
    workers=$(available_workers)
    echo "[INFO][$SCRIPT_NAME] Managers: $managers, available workers: $workers, target: $TARGET_MANAGERS"
    if [ "$managers" -ge "$TARGET_MANAGERS" ]; then
        echo "[INFO][$SCRIPT_NAME] Manager target reached: $managers/$TARGET_MANAGERS"
        exit 0
    fi
    max_reachable=$((managers + workers))
    if [ "$((max_reachable % 2))" -eq 0 ]; then
        max_reachable=$((max_reachable - 1))
    fi
    if [ "$max_reachable" -gt "$TARGET_MANAGERS" ]; then
        max_reachable="$TARGET_MANAGERS"
    fi
    if [ "$max_reachable" -le "$managers" ]; then
        echo "[WARNING][$SCRIPT_NAME] Not enough workers to reach the next manager quorum"
        echo "[WARNING][$SCRIPT_NAME] Current managers: $managers"
        echo "[WARNING][$SCRIPT_NAME] Available workers: $workers"
        echo "[WARNING][$SCRIPT_NAME] Target: $TARGET_MANAGERS"
        exit 1
    fi
    echo "[INFO][$SCRIPT_NAME] Will promote up to $max_reachable managers"
    elapsed=$(( $(date +%s) - start_time ))
    if [ "$elapsed" -ge "$PROMOTE_TIMEOUT" ]; then
        echo "[ERROR][$SCRIPT_NAME] Promotion timeout"
        echo "[ERROR][$SCRIPT_NAME] Current managers: $managers/$TARGET_MANAGERS"
        exit 1
    fi
    worker=$(
        docker node ls \
            --filter role=worker \
            --filter availability=active \
            --format '{{.ID}}' |
        head -n 1
    )
    if [ -z "$worker" ]; then
        echo "[WARNING][$SCRIPT_NAME] No available worker to promote"
        break
    fi
    if ! docker node promote "$worker"; then
        echo "[ERROR][$SCRIPT_NAME] Failed to promote node $worker"
        exit 1
    else
      echo "[INFO][$SCRIPT_NAME] Node promoted $worker"
    fi
    if ! wait_for_manager "$worker"; then
        exit 1
    fi
    echo "[INFO][$SCRIPT_NAME] Node $worker is now a manager"
    sleep 1
    managers=$(current_managers)
done
echo "[INFO][$SCRIPT_NAME] Managers: $managers/$TARGET_MANAGERS"
