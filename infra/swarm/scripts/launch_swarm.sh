#!/bin/bash

#SAFEGUARDING#
set -euo pipefail
SCRIPT_NAME="${0##*/}"
if [ ! $# -eq 3 ]; then
	echo "Usage: $SCRIPT_NAME <dir> <ip> <tailscale ip>"
	exit 1
fi

#ARGUMENTS ASSIGNATION#
DIR="$1"
HOST_IP="$2"
HOST_TAILSCALE_IP="$3"
IP=$(ip -4 route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if($i=="src") print $(i+1)}')

# Creating certificates
if [ ! -f $HOME/infra/cert_creation.sh ]; then
    echo "[$SCRIPT_NAME] $HOME/infra/cert_creation.sh missing, skipping certificate creation"
else
    chmod +x $HOME/infra/cert_creation.sh
    if [ ! -f "$HOME/certs/nginx.crt" ]; then
	bash $HOME/infra/cert_creation.sh "/etc/certs" "${HOST_TAILSCALE_IP}" nginx
    else
	echo "[$SCRIPT_NAME] Nginx certificate already exist"
    fi
    if [ ! -f "$HOME/certs/registry.crt" ]; then
	bash $HOME/infra/cert_creation.sh "/etc/certs" "${HOST_TAILSCALE_IP}" registry
    else
	echo "[$SCRIPT_NAME] Registry certificate already exist"
    fi
    if [ ! -f "$HOME/certs/worker.crt" ]; then
	bash $HOME/infra/cert_creation.sh "/etc/certs" "${HOST_TAILSCALE_IP}" worker

	# Adding certificates to docker
	doas mkdir -p /etc/docker/certs.d/${HOST_TAILSCALE_IP}:5050
	doas rm -rf "/etc/docker/certs.d/${HOST_TAILSCALE_IP}:5050/worker.*"
	doas cp "$HOME/certs/worker.crt" "/etc/docker/certs.d/${HOST_TAILSCALE_IP}:5050/client.cert" 
	doas cp "$HOME/certs/worker.key" "/etc/docker/certs.d/${HOST_TAILSCALE_IP}:5050/client.key" 
	doas rc-service docker restart
	COUNTER=0
	TIMEOUT=30
	echo "[INFO][$SCRIPT_NAME] Waiting for docker to restart"
	while ! docker info >/dev/null 2>&1; do
	    if [ "$COUNTER" -ge "$TIMEOUT" ]; then
		echo "[ERROR][$SCRIPT_NAME] Docker took to much time"
		exit 1
	    fi
	    COUNTER=$((COUNTER + 1))
	    sleep 2
	    echo -n "."
	done
	echo ""
    else
	echo "[$SCRIPT_NAME] Worker certificate already exist"
    fi
fi

#INIT THE SWARM AND PUBLISH IS IP OF CONTACT(HOST_IP)#
if [ ! "$(docker info --format '{{.Swarm.LocalNodeState}}')" = "active" ]; then
    docker swarm init --advertise-addr ${HOST_TAILSCALE_IP} --data-path-addr ${HOST_TAILSCALE_IP}
fi

docker node update --label-add leader=true $(docker node ls --format '{{.ID}} {{.ManagerStatus}}' | awk '/Leader/ {print $1}')

# Creating secrets
if docker secret inspect nginx_crt >/dev/null 2>&1 && \
    docker secret inspect nginx_key >/dev/null 2>&1; then
    echo "[$SCRIPT_NAME] Nginx secrets already exist"
else
    docker secret create nginx_crt $HOME/certs/nginx.crt
    docker secret create nginx_key $HOME/certs/nginx.key
fi
if docker secret inspect registry_crt >/dev/null 2>&1 && \
    docker secret inspect registry_key >/dev/null 2>&1; then
    echo "[$SCRIPT_NAME] Registry secrets already exist"
else
    docker secret create registry_crt $HOME/certs/registry.crt
    docker secret create registry_key $HOME/certs/registry.key
fi
if docker secret inspect worker_crt >/dev/null 2>&1 && \
    docker secret inspect worker_key >/dev/null 2>&1; then
    echo "[$SCRIPT_NAME] Registry secrets already exist"
else
    docker secret create worker_crt $HOME/certs/worker.crt
    docker secret create worker_key $HOME/certs/worker.key
fi
if docker secret inspect ca_crt >/dev/null 2>&1; then
    echo "[$SCRIPT_NAME] Registry secrets already exist"
else
    docker secret create ca_crt "/etc/certs/ca.crt"
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
read -p "[$SCRIPT_NAME] Do you want to add preconfigured node (y/N): " -t 15 answer || {
        echo
        answer=""
}
case "${answer,,}" in
	y|yes)
	    chmod +x "${DIR}/add_node.sh"
	   bash "${DIR}/add_node.sh" "${HOST_IP}" "${HOST_TAILSCALE_IP}" agaland bertrmar dbajeux kprist stempels;;
	*) echo "[$SCRIPT_NAME] No node added";;
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
