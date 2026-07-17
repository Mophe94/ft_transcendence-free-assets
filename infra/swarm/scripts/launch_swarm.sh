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
HOST_IP="$2"
IP=$(ip -4 route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if($i=="src") print $(i+1)}')

#INIT THE SWARM AND PUBLISH IS IP OF CONTACT(HOST_IP)#
if [ ! "$(docker info --format '{{.Swarm.LocalNodeState}}')" = "active" ]; then
    docker swarm init --advertise-addr ${HOST_IP}
fi

if [ ! -f $HOME/infra/cert_creation.sh ]; then
    echo "[$SCRIPT_NAME] $HOME/infra/cert_creation.sh missing, skipping certificate creation"
else
    chmod +x $HOME/infra/cert_creation.sh
    if docker secret inspect nginx_crt >/dev/null 2>&1 && \
       docker secret inspect nginx_key >/dev/null 2>&1; then
	echo "[$SCRIPT_NAME] Nginx secrets already exist"
    else
	bash $HOME/infra/cert_creation.sh "/etc/certs" "${HOST_IP}" nginx
	docker secret create nginx_crt $HOME/certs/nginx.crt
	docker secret create nginx_key $HOME/certs/nginx.key
    fi
    if docker secret inspect registry_crt >/dev/null 2>&1 && \
       docker secret inspect registry_key >/dev/null 2>&1; then
	echo "[$SCRIPT_NAME] Registry secrets already exist"
    else
	bash $HOME/infra/cert_creation.sh "/etc/certs" "${IP}" registry
	docker secret create registry_crt $HOME/certs/registry.crt
	docker secret create registry_key $HOME/certs/registry.key
    fi
	 if docker secret inspect worker_crt >/dev/null 2>&1 && \
       docker secret inspect worker_key >/dev/null 2>&1; then
	echo "[$SCRIPT_NAME] Registry secrets already exist"
    else
	bash $HOME/infra/cert_creation.sh "/etc/certs" "${IP}" worker
    fi
	 if docker secret inspect ca_crt >/dev/null 2>&1; then
	echo "[$SCRIPT_NAME] Registry secrets already exist"
    else
	docker secret create ca_crt "/etc/certs/ca.crt"
    fi
fi

networks=("swarm_net" "obsrv_net" "games_net" "site_net")
#CREATE THE NEEDED OVERLAY NETWORKS#
for network in "${networks[@]}"; do
    if ! docker network inspect "$network" >/dev/null 2>&1; then
	docker network create --driver overlay --attachable --internal "$network" >/dev/null 2>&1
	echo "[$SCRIPT_NAME] $network created"
    fi
done

#Adding preconfigured nodes
echo -n "[$SCRIPT_NAME] Do you want to add preconfigured node (y/N): " 
read -t 15 answer || true
case "${answer,,}" in
	[y]|[yes])
	    chmod +x "${DIR}/add_node.sh"
	   bash "${DIR}/add_node.sh" ${HOST_IP} agaland bertrmar dbajeux kprist stempels;;
	*) echo "[$SCRIPT_NAME] No node added"
esac

#Adding more node
echo -n "[$SCRIPT_NAME] Do you want to add more node (y/N): " 
read -t 15 answer || true
case "${answer,,}" in
	[y]|[yes])
	    answer=""
	    echo -n "[$SCRIPT_NAME] Node(s) user(s): " 
	    read -t 15 answer || true
	    if [ -z "$answer" ]; then
		chmod +x "${DIR}/add_node.sh"
		bash "${DIR}/add_node.sh" ${HOST_IP};;
	    fi
	*) echo "[$SCRIPT_NAME] No node added"
esac

#Create secret
SECRET_FILE=$HOME/infra/secrets.env
if [ ! -f "$SECRET_FILE" ]; then
    echo "[$SCRIPT_NAME] Secret file: $SECRET_FILE not found"
else
    chmod +x "$DIR"/secrets_handler.sh
    bash "$DIR"/secrets_handler.sh "$SECRET_FILE"
fi

docker service ls
echo ""
