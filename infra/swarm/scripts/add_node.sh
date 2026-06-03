#! /bin/bash

SCRIPT_NAME="${0##*/}"

users=("agaland" "bertmart" "dbajeux" "kprist" "stempels") 

if [ $# -eq 1 ]; then
    JOIN_CMD="$1"
else
    echo "[$SCRIPT_NAME] Missing argument"
    exit 1
fi

NODE_CONNECTED=0

for user in "${users[@]}"; do
    echo "[$SCRIPT_NAME] Connecting to $user node:"
    read -p "[$SCRIPT_NAME]    IP of $user node host machine: " answer
    HOST_IP=$answer
    #-->add validation of IP then prompt again, maybe max 3 times

    #handling password automaticaly ?
#    read -p "[$SCRIPT_NAME] Password of $user node:" answer
#    NODE_PASS=$answer
    ssh -p "$SSH_PORT" "$user"@"$HOST_IP" "$1; exit 0" > /dev/null 2>&1
    if [ "$?" != 0 ]; then
	echo -e "[$SCRIPT_NAME] Error: could not connect to $user node\n"
    fi
    NODE_CONNECTED=($NODE_CONNECTED + 1)
done

echo "[$SCRIPT_NAME] Number of node connected $NODE_CONNECTED"
