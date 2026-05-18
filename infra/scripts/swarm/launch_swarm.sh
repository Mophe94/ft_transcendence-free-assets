#!/bin/bash

#Safeguard
set -euo pipefail
SCRIPT_NAME="${0##*/}"
if [ $# -lt 2 ]; then
	echo "Usage: $SCRIPT_NAME <dir> <ip>"
	exit 1
fi

#Arguments
DIR="$1"
IP="$2"

#Actions
docker swarm init --advertise-addr $IP

SECRET_HANDLER=$DIR/secret_handler.sh
chmod +x $SECRET_HANDLER
$SECRET_HANDLER $DIR $IP

docker service ls
