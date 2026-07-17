# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    add_node.sh                                        :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: stempels <stempels@student.42belgium.be>   +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2026/07/16 14:57:00 by stempels          #+#    #+#              #
#    Updated: 2026/07/17 11:00:32 by stempels         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #
#! /bin/bash

SCRIPT_NAME="${0##*/}"
addnote_help() {
    echo "[INFO] Usage ${SCRIPT_NAME}: <leader ip> <node user> <node user> <...>"
}


if [ ! $# -lt 2 ]; then
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

if is_ip "$1"; then
    LEADER_IP="$1"
else
    addnote_help
    exit 1
fi
shift

NODE_USERS="$@"

WORKER_JOIN_CMD=$(docker swarm join-token -q worker)

TARGET_MANAGERS=3
NODE_CONNECTED=0
JOIN_CMD="$WORKER_JOIN_CMD"

SSH_KEY_NAME="${USER}_transcendence_node"
SSH_KEY_PASSPHRASE=
SSH_PORT=2222
PUB_KEY="$HOME/.ssh/${SSH_KEY_NAME}.pub"

VM_TARGET_DIR="/tmp/"

# Generating ssh key
if [ ! -f "$HOME/.ssh/${SSH_KEY_NAME}.pub" ]; then
    ssh-keygen -f $HOME/.ssh/${SSH_KEY_NAME} -N "$SSH_KEY_PASSPHRASE"
fi

for user in "${NODE_USERS[@]}"; do
    if [ "$user" = "$USER" ]; then
	continue
    elif docker node ls --format '{{.Hostname}}' | grep -Fxq "$user"; then
	echo "[INFO][$SCRIPT_NAME] $user already belongs to the swarm."
	continue
    fi
    echo "[$SCRIPT_NAME] Connecting to $user node:"
    read -p "[$SCRIPT_NAME]    IP of $user node host machine: " answer
    HOST_IP=$answer
    try=0
    while [ "$try" -lt 3 ]; do
	ssh -i $HOME/.ssh/${SSH_KEY_NAME} -p "$SSH_PORT" -o StrictHostKeyChecking=no "${user}"@"${HOST_IP}" \
		    "mkdir -p ~/.ssh && chmod 700 ~/.ssh; grep -qxf \"$(cat $PUB_KEY)\" ~/.ssh/authorized_keys 2>/dev/null || \
		    echo \"$(cat $PUB_KEY)\" >> ~/.ssh/authorized_keys; chmod 600 ~/.ssh/authorized_keys; exit 0"
	if [ "$?" != 0 ]; then
	    echo -e "[ERROR][$SCRIPT_NAME] Could not connect to $user node\n"
	    try=$((try + 1))
	else
	    doas scp -i $HOME/.ssh/${SSH_KEY_NAME} -r -P "$SSH_PORT" -o StrictHostKeyChecking=no \
		/etc/certs/ca.crt \
		/home/${USER}/certs/worker.crt \
		/home/${USER}/certs/worker.key \
		"${user}"@"${HOST_IP}":"$VM_TARGET_DIR"
	    ssh -i $HOME/.ssh/${SSH_KEY_NAME} -p "$SSH_PORT" "$user"@"$HOST_IP" \
		"chmod +x /setup_for_swarm.sh && \
		nohup /setup_for_swarm.sh ${LEADER_IP} ${HOST_IP} ${JOIN_CMD} 2049; \
		>/tmp/setup_for_swarm.log 2>&1 < /dev/null &"
	    NODE_CONNECTED=$(($NODE_CONNECTED + 1))
	    break
	fi
    done
done

# Wait for node to join
for user in "${NODE_USERS[@]}"; do
    [ "$user" = "$USER" ] && continue
    while ! docker node ls --format '{{.Hostname}}' | grep -Fxq "$user"; do
	sleep 2
    done
done

# Promote to reach manager target
current_managers() {
    docker node ls --format '{{.ManagerStatus}}' |
        grep -Ec 'Leader|Reachable'
}
while :; do
    managers=$(current_managers)

    if [ "$managers" -ge "$TARGET_MANAGERS" ]; then
        exit 0
    fi

    docker node ls --format '{{.Hostname}} {{.ManagerStatus}}' |
    awk '$2 == "" {print $1}' |
    while read -r worker; do
        [ -z "$worker" ] && continue

        echo "Promoting $worker"
        docker node promote "$worker"

        managers=$((managers + 1))
        [ "$managers" -ge "$TARGET_MANAGERS" ] && exit 0
    done

    sleep 2
done
