#! /bin/bash

#TODO	- setup docker daeon certificate list
#	- handling nfs storage mount for node

SCRIPT_NAME="${0##*/}"

users=("agaland" "bertmart" "dbajeux" "kprist" "stempels") 

MANAGER_JOIN_CMD=$(docker swarm joint-token -q manager)
WORKER_JOIN_CMD=$(docker swarm joint-token -q worker)

NODE_CONNECTED=0
JOIN_CMD="$MANAGER_JOIN_CMD"

for user in "${users[@]}"; do
    if [ "$user" == "$USER" ]; then
	continue
    fi
    if [ "$NBR_MANAGER" -eq 3 ]; then
	JOIN_CMD="$WORKER_JOIN_CMD"
    fi
    echo "[$SCRIPT_NAME] Connecting to $user node:"
    read -p "[$SCRIPT_NAME]    IP of $user node host machine: " answer
    HOST_IP=$answer
    #-->add validation of IP then prompt again, maybe max 3 times

    #handling password automaticaly ?
#    read -p "[$SCRIPT_NAME] Password of $user node:" answer
#    NODE_PASS=$answer
    
    #need to add something as IP, wich ?
    #doas scp -p 2222 "$user"@"$HOST_IP":"/etc/docker/certs.d/"
    ssh -p "$SSH_PORT" "$user"@"$HOST_IP" "$1; $JOIN_CMD; exit 0" > /dev/null 2>&1
    if [ "$?" != 0 ]; then
	echo -e "[$SCRIPT_NAME] Error: could not connect to $user node\n"
    else
	NODE_CONNECTED=($NODE_CONNECTED + 1)
    fi
    NBR_MANAGER=docker node ls --format '{{.ManagerStatus}}' | grep -E 'Leader|Reachable' | wc -l
done

echo "[$SCRIPT_NAME] Number of node connected $NODE_CONNECTED"
