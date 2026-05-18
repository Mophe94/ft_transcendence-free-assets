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
