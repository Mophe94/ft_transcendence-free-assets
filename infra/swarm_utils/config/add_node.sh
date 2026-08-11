# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    add_node.sh                                        :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: stempels <stempels@student.42belgium.be>   +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2026/07/16 14:57:00 by stempels          #+#    #+#              #
#    Updated: 2026/08/11 09:14:58 by stempels         ###   ########.fr        #
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

get_env_value() {
    local wanted_key="$1"
    local key
    local value

    if [ ! -f "$ENV_FILE" ]; then
        echo "[ERROR][$SCRIPT_NAME] Missing $ENV_FILE"
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

get_42_token() {
    local client_id
    local client_secret

    client_id="$(get_env_value s_fortytwo_client_id)" || return 1
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
    [[ "$location" =~ ^(shi|fu|mi)-r[0-9]+-p[0-9]+$ ]]
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

NODE_JOIN_TIMEOUT=120

# Generating ssh key
SSH_KEY="$HOME/.ssh/${SSH_KEY_NAME}"
PUB_KEY="$SSH_KEY.pub"
if [ ! -f "$PUB_KEY" ]; then
ssh-keygen -t ed25519 \
	-f "$SSH_KEY" \
	-N "$SSH_KEY_PASSPHRASE"
fi

# Getting user(s) location/IP
CONNECTED_NODES=()
for user in "${NODE_USERS[@]}"; do
    if [ "$user" = "$USER" ]; then
	continue
    elif docker node ls --format '{{.Hostname}}' | grep -Fxq swarmnode."$user"; then
	echo "[INFO][$SCRIPT_NAME] $user already belongs to the swarm."
	continue
    fi
    echo "[$SCRIPT_NAME] Connecting to $user node:"
    HOST_IP="$(get_user_host "$user")"
    if  ! is_ip "$HOST_IP" && ! is_location "$answer"; then
	try=0
	while [ "$try" -lt 3 ]; do
		read -p "[$SCRIPT_NAME]    IP of $user node host machine: " answer
		if [ -z "$answer" ] || ! is_ip "$answer" || ! is_location "$answer"; then
	   		echo "[$SCRIPT_NAME] Invalid IP input, try again."
	    	answer=""
	    	try=$((try + 1))
		else
	    	HOST_IP=$answer
	    	break
		fi
    	done
    fi
    if [ "$try" -eq 3 ]; then
	echo "[$SCRIPT_NAME] Too many try, aborting."
	continue
    fi
done

# Getting user password
local password=""
if password="$(get_env_value p_node_"$user")"; then
    password_from_env=true
else
    password_from_env=false
    echo "[$SCRIPT_NAME] No password configured for $user."
    IFS= read -r -s -p "[$SCRIPT_NAME] Password for $user: " password
    echo
fi

pub_key="$(cat "$PUB_KEY")"
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
        echo "[$SCRIPT_NAME] SSH key installed for $user."

        # The bootstrap password has now been successfully used.
        if [ "$password_from_env" = true ]; then
            if ! consume_node_password "$user"; then
                echo "[ERROR][$SCRIPT_NAME] Failed to remove bootstrap password for $user."
                unset password
                continue
            fi
        fi
        unset password

        # From here onward, authentication is done with the SSH key.
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
        break

    else
        echo "[ERROR][$SCRIPT_NAME] Could not authenticate to $user node."
        try=$((try + 1))
        if [ "$try" -lt 3 ]; then
            echo "[$SCRIPT_NAME] Retrying..."
        fi
    fi
done
unset password
if [ "$try" -eq 3 ]; then
    echo "[$SCRIPT_NAME] Too many tries, aborting."
    continue
fi

# Wait for node to join
ADDED_NODES=0
for user in "${CONNECTED_NODES[@]}"; do
    [ -z "$user" ] && continue
    [ "$user" = "$USER" ] && continue
    echo "[$SCRIPT_NAME] Waiting for $user to join swarm..."
    start_time=$(date +%s)
    while :; do
        if docker node ls --format '{{.Hostname}}' |
            grep -Fxq "swarmnode.$user"; then

            echo "[INFO][$SCRIPT_NAME] $user joined the swarm"
            ADDED_NODES=$((ADDED_NODES + 1))
            break
        fi
        elapsed=$(( $(date +%s) - start_time ))
        if [ "$elapsed" -ge "$NODE_JOIN_TIMEOUT" ]; then
            echo "[ERROR][$SCRIPT_NAME] Timeout waiting for node $user to join swarm"
            break
        fi
        sleep 2
    done
done
echo "[$SCRIPT_NAME] Added $ADDED_NODES nodes"
