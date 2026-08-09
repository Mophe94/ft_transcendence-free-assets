#! /bin/bash
SCRIPT_NAME="${0##*/}"

# Safeguard
set -euo pipefail
if [ $# -ne 2 ]; then
    echo "Usage: $SCRIPT_NAME <create_swarm_certs script path> <host tailscale ip>"
    exit 1
else
    CERTS_SCRIPT="$1"
    HOST_TAILSCALE_IP="$2"
fi

if [ ! -f ${CERTS_SCRIPT} ]; then
    echo "[$SCRIPT_NAME] ${CERTS_SCRIPT} missing, skipping certificate creation"
else
    chmod +x ${CERTS_SCRIPT}
    if [ ! -f "$HOME/certs/nginx.crt" ]; then
	bash ${CERTS_SCRIPT} "/etc/certs" "${HOST_TAILSCALE_IP}" nginx
    else
	echo "[$SCRIPT_NAME] Nginx certificate already exist"
    fi
    if [ ! -f "$HOME/certs/registry.crt" ]; then
	bash ${CERTS_SCRIPT} "/etc/certs" "${HOST_TAILSCALE_IP}" registry
    else
	echo "[$SCRIPT_NAME] Registry certificate already exist"
    fi
    if [ ! -f "$HOME/certs/worker.crt" ]; then
	bash ${CERTS_SCRIPT} "/etc/certs" "${HOST_TAILSCALE_IP}" worker

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
