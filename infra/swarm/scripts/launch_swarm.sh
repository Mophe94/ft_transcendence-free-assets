#!/bin/bash

#SAFEGUARDING#
set -euo pipefail
SCRIPT_NAME="${0##*/}"
if [ $# -lt 2 ]; then
	echo "Usage: $SCRIPT_NAME <dir> <ip>"
	exit 1
fi

#ARGUMENTS ASSIGNATION#
DIR="$1"
IP="$2"

#SETUP DOCKER DEAMON
mkdir -p /etc/docker
cat << 'EOF' > /etc/docker/daemon.json
{
    "oom-score-adjust": -500,
    "debug": false,
    "insecure-registries": [
	"registry",
	"registry:5000",
	"$IP:8080"
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
    ubuntu)
	echo "You will need to be root..."
	sudo systemctl restart docker
	;;
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
    sleep 1
    COUNTER=$((CONTER + 1))
    echo -n "."
done

#INIT THE SWARM AND PUBLISH IS IP#
docker swarm init --advertise-addr $IP

#CREATE THE NEEDED OVERLAY NETWORKS#
docker network create --driver overlay --attachable --internal swarm_net
docker network create --driver overlay --attachable --internal obsrv_net
docker network create --driver overlay --attachable --internal games_net

#SECRET_HANDLER=$DIR/secret_handler.sh
#chmod +x $SECRET_HANDLER
#$SECRET_HANDLER $DIR $IP

docker service ls
