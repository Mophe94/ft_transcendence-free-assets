SCRIPT_NAME="${0##*/}"
script_help() {
    echo "[INFO] Usage ${SCRIPT_NAME}: <leader ip> <leader tailscale ip> <node user> <node user> <...>"
}

if [ $# -lt 2 ]; then
    script_help
    exit 1
fi

PROMOTE_TIMEOUT=120

# Promote to reach manager target
current_managers() {
    docker node ls --format '{{.ManagerStatus}}' |
        grep -Ec 'Leader|Reachable'
}

start_time=$(date +%s)

#Add security: prevent reaching a even number of manager

while :; do
    managers=$(current_managers)

    if [ "$managers" -ge "$TARGET_MANAGERS" ] || [ $ADDED_NODES -eq 0 ]; then
        exit 0
    fi

    now=$(date +%s)
    elapsed=$((now - start_time))

    if [ "$elapsed" -ge "$PROMOTE_TIMEOUT" ]; then
        echo "[ERROR][$SCRIPT_NAME] Timeout waiting to reach $TARGET_MANAGERS managers (current: $managers)"
        exit 1
    fi

    while read -r worker; do
        [ -z "$worker" ] && continue

        echo "Promoting $worker"
        docker node promote "$worker"

        managers=$((managers + 1))
	ADDED_NODES=$((ADDED_NODES - 1))

        if [ "$managers" -ge "$TARGET_MANAGERS" ]; then
            exit 0
        fi
    done < <(docker node ls --filter role=worker --format '{{.Hostname}}')
    sleep 2
done
