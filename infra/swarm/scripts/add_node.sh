# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    add_node.sh                                        :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: stempels <stempels@student.42belgium.be>   +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2026/07/16 14:57:00 by stempels          #+#    #+#              #
#    Updated: 2026/08/03 10:50:46 by stempels         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #
#! /bin/bash

SCRIPT_NAME="${0##*/}"
addnote_help() {
    echo "[INFO] Usage ${SCRIPT_NAME}: <leader ip> <leader tailscale ip> <node user> <node user> <...>"
}


if [ $# -lt 2 ]; then
    addnote_help
    exit 1
fi

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

if ! is_ip "$1" || ! is_ip "$2"; then
    addnote_help
    exit 1
else
    LEADER_IP="$1"
    LEADER_TAILSCALE_IP="$2"
    shift 2
fi

NODE_USERS=("$@")

WORKER_JOIN_CMD=$(docker swarm join-token -q worker)

TARGET_MANAGERS=3
JOIN_CMD="$WORKER_JOIN_CMD"

SSH_KEY_NAME="${USER}_transcendence_node"
SSH_KEY_PASSPHRASE=
SSH_PORT=2222
PUB_KEY="$HOME/.ssh/${SSH_KEY_NAME}.pub"

VM_TARGET_DIR="/tmp/"

ADDED_NODES=0
CONNECTED_NODES=("")
NODE_JOIN_TIMEOUT=120
PROMOTE_TIMEOUT=120


# Generating ssh key
if [ ! -f "$HOME/.ssh/${SSH_KEY_NAME}.pub" ]; then
    ssh-keygen -f "$HOME/.ssh/${SSH_KEY_NAME}" -N "$SSH_KEY_PASSPHRASE"
fi

for user in "${NODE_USERS[@]}"; do
    if [ "$user" = "$USER" ]; then
	continue
    elif docker node ls --format '{{.Hostname}}' | grep -Fxq swarmnode."$user"; then
	echo "[INFO][$SCRIPT_NAME] $user already belongs to the swarm."
	continue
    fi
    echo "[$SCRIPT_NAME] Connecting to $user node:"
    try=0
    while [ "$try" -lt 3 ]; do
	read -p "[$SCRIPT_NAME]    IP of $user node host machine: " answer
	if [ -z "$answer" ] || ! is_ip "$answer"; then
	    echo "[$SCRIPT_NAME] Invalid IP input, try again."
	    answer=""
	    try=$((try + 1))
	else
	    HOST_IP=$answer
	    break
	fi
    done

    if [ "$try" -eq 3 ]; then
	echo "[$SCRIPT_NAME] Too many try, aborting."
	continue
    fi
    try=0
    while [ "$try" -lt 3 ]; do
	ssh -i $HOME/.ssh/${SSH_KEY_NAME} -p "$SSH_PORT" -o StrictHostKeyChecking=no "${user}"@"${HOST_IP}" \
		    "mkdir -p ~/.ssh && chmod 700 ~/.ssh; grep -qxf \"$(cat "$PUB_KEY")\" ~/.ssh/authorized_keys 2>/dev/null || \
		    echo \"$(cat "$PUB_KEY")\" >> ~/.ssh/authorized_keys; chmod 600 ~/.ssh/authorized_keys; exit 0"
	if [ "$?" != 0 ]; then
	    echo -e "[ERROR][$SCRIPT_NAME] Could not connect to $user node\n"
	    try=$((try + 1))
	else
            ssh -p"$SSH_PORT" "${user}"@"${HOST_IP}" "doas rm -rf ${VM_TARGET_DIR}/worker.* ca.crt"
	    doas scp -i $HOME/.ssh/${SSH_KEY_NAME} -r -P "$SSH_PORT" -o StrictHostKeyChecking=no \
		/etc/certs/ca.crt \
		/home/${USER}/certs/worker.crt \
		/home/${USER}/certs/worker.key \
		"${user}"@"${HOST_IP}":"$VM_TARGET_DIR"
	    doas scp -i $HOME/.ssh/${SSH_KEY_NAME} -r -P "$SSH_PORT" -o StrictHostKeyChecking=no \
		/etc/headscale_authkey \
		"${user}"@"${HOST_IP}":"$VM_TARGET_DIR/headscale_authkey"
	    ssh -i $HOME/.ssh/${SSH_KEY_NAME} -p "$SSH_PORT" "$user"@"$HOST_IP" \
		"doas chmod +x /setup_for_swarm.sh; \
		doas nohup /setup_for_swarm.sh ${LEADER_IP} ${LEADER_TAILSCALE_IP} "${JOIN_CMD}" 2049 \
		>/tmp/setup_for_swarm.log 2>&1 < /dev/null &"
	    CONNECTED_NODES+=("$user")
	    ADDED_NODES=$((ADDED_NODES + 1))
	    break
	fi
    done
    if [ "$try" -eq 3 ]; then
	echo "[$SCRIPT_NAME] Too many try, aborting."
	continue
    fi
done

# Wait for node to join
start_time=$(date +%s)

for user in "${CONNECTED_NODES[@]}"; do
    [ "$user" = "$USER" ] && continue

    while ! docker node ls --format '{{.Hostname}}' | grep -Fxq swarmnode."$user"; do
        now=$(date +%s)
        elapsed=$((now - start_time))

        if [ "$elapsed" -ge "$NODE_JOIN_TIMEOUT" ]; then
            echo "[ERROR][$SCRIPT_NAME] Timeout waiting for node $user to join swarm"
            break
        fi

        sleep 2
    done
done

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
