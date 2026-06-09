#!/bin/bash

#SAFEGUARDING#
set -euo pipefail
SCRIPT_NAME="${0##*/}"
if [ ! $# -eq 2 ]; then
	echo "Usage: $SCRIPT_NAME <dir> <ip>"
	exit 1
fi

#ARGUMENTS ASSIGNATION#
DIR="$1"
IP="$2"

#SETUP DOCKER DEAMON
mkdir -p /etc/docker
if [ ! -f "/etc/docker/daemon.json" ]; then
    cat << EOF > /etc/docker/daemon.json
{
    "insecure-registries": [
        "registry",
        "registry:5000",
        "$IP:80"
    ]
}
EOF

    if [ -f /etc/os-release ]; then
	DISTRO=$(grep -E '^ID=' /etc/os-release | cut -d= -f2 | tr -d '"')
    else
	echo "Can not detect os-version"
	exit 1
    fi

    case "$DISTRO" in
	alpine)
	    rc-service docker restart
	    ;;
	*)
	    echo "Os-version unsupported by this script"
	    exit 1
	    ;;
    esac

    COUNTER=0
    TIMEOUT=30
    echo "Waiting for docker to restart"
    while ! docker info >/dev/null 2>&1; do
	if [ "$COUNTER" -ge "$TIMEOUT" ]; then
	    echo "Docker took to much time"
	    exit 1
	fi
	COUNTER=$((COUNTER + 1))
	sleep 2
	echo -n "."
    done
fi

#INIT THE SWARM AND PUBLISH IS IP#
if [ ! "$(docker info --format '{{.Swarm.LocalNodeState}}')" = "active" ]; then
    docker swarm init --advertise-addr $IP
fi

networks=("swarm_net" "obsrv_net" "games_net")
#CREATE THE NEEDED OVERLAY NETWORKS#
for network in "${networks[@]}"; do
    if ! docker network inspect "$network" >/dev/null 2>&1; then
	docker network create --driver overlay --attachable --internal "$network" >/dev/null 2>&1
	echo "[$SCRIPT_NAME] $network created"
    fi
done

#Adding more node ?
echo -n "[$SCRIPT_NAME] Do you want to add more node (y/N): " 
read answer
case "${answer,,}" in
	[y]|[yes])
	    chmod +x "${DIR}/add_node.sh"
	    ./"${DIR}/add_node.sh";;
	*) echo "[$SCRIPT_NAME] No node added"
esac

#Create secret
SECRET_FILE=$DIR/secrets.env
if [ ! -f "$SECRET_FILE" ]; then
    echo "[$SCRIPT_NAME] Secret file: $SECRET_FILE not found"
else
    chmod +x "$DIR"/secrets_handler.sh
    bash "$DIR"/secrets_handler.sh "$SECRET_FILE"
fi

docker service ls
echo ""
