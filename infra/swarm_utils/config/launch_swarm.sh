#!/bin/bash
SCRIPT_NAME="${0##*/}"

#SAFEGUARDING#
set -euo pipefail
if [ ! $# -eq 3 ]; then
	echo "Usage: $SCRIPT_NAME <swarm_utils dir> <host ip> <tailscale ip>"
	exit 1
fi

#ARGUMENTS ASSIGNATION#
UTILS_DIR="$1"
HOST_IP="$2"
HOST_TAILSCALE_IP="$3"
IP=$(ip -4 route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if($i=="src") print $(i+1)}')

CONFIG_DIR="${UTILS_DIR}/config"
TOOLS_DIR="${UTILS_DIR}/tools"
SECRET_FILE="${ENV_FILE:-"$HOME/infra/.env"}"

# Creating certificates
chmod +x "$CONFIG_DIR/create_swarm_certs.sh" 
bash "${CONFIG_DIR}/create_swarm_certs.sh" "${TOOLS_DIR}/cert_creation.sh" "${HOST_TAILSCALE_IP}"

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
read -p "[$SCRIPT_NAME] Do you want to add preconfigured node (y/N): " -t 5 answer || {
        echo
        answer="no"
}
case "${answer,,}" in
	y|yes)
	    chmod +x "${CONFIG_DIR}/add_node.sh"
	   bash "${CONFIG_DIR}/add_node.sh" "${HOST_IP}" "${HOST_TAILSCALE_IP}" agaland bertrmar dbajeux kprist stempels;;
	*) echo "[$SCRIPT_NAME] No node added";;
esac

chmod +x "$CONFIG_DIR"/add_manager.sh
if ! bash "$CONFIG_DIR"/add_manager.sh "$MANAGER_NUMBER"; then
    read -p "[$SCRIPT_NAME] Do you wish to continue: " -t 5 answer || {
	    echo
	    answer="Yes"
    }
    case "${answer,,}" in
	    y|yes)
	       ;;
	    *) exit 1;;
    esac
fi

#Create secret
if [ ! -f "$SECRET_FILE" ]; then
    echo "[$SCRIPT_NAME] Secret file: $SECRET_FILE not found"
else
    chmod +x "$TOOLS_DIR"/secrets_handler.sh
    bash "$TOOLS_DIR"/secrets_handler.sh "$SECRET_FILE"
fi

docker service ls
echo ""
