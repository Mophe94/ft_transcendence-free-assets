#!/bin/bash
set -e

#Safeguard
SCRIPT_NAME="${0##*/}"

if [ ! $# -eq 2 ]; then
    echo "Usage: ${SCRIPT_NAME} <node new username> <host_ip>"
    exit 1
elif [ -z "$1" ]; then
    echo "Usage: ${SCRIPT_NAME} <node new username> <host_ip>"
    exit 1
else
    NEW_USER="$1"
    HOST_IP="$2"
fi

#Setup
TYPE="leader"
IP=$(ip -4 route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if($i=="src") print $(i+1)}')
CERT_DIR="/etc/certs/"
SSH_CONFIG="/etc/ssh/sshd_config"
HEADSCALE_DIR="/opt/headscale"
HEADSCALE_PORT="8080"
TAILSCALE_IP_FILE="/etc/tailscale_ip"

echo "[${SCRIPT_NAME}] VM ip: ${IP}"

#Change for env procured password
NEW_USER_HOME="/home/$NEW_USER"
NEW_USER_PASSWORD="Nd${NEW_USER}123"

echo "[$SCRIPT_NAME] Creating user: $NEW_USER"
adduser -D -h "$NEW_USER_HOME" "$NEW_USER"
echo "${NEW_USER}:${NEW_USER_PASSWORD}" | chpasswd

echo "[$SCRIPT_NAME] Setting up ${NEW_USER} permissions"
addgroup "$NEW_USER" wheel
addgroup "$NEW_USER" docker

echo "[$SCRIPT_NAME] Setting up ${NEW_USER} SSH login"
mkdir -p "$NEW_USER_HOME/.ssh"
chmod 700 "${NEW_USER_HOME}/.ssh"
cat "${HOME}/.ssh/authorized_keys" > "${NEW_USER_HOME}/.ssh/authorized_keys" 
chmod 600 "${NEW_USER_HOME}/.ssh/authorized_keys"
chown -R ${NEW_USER}:${NEW_USER} "${NEW_USER_HOME}/.ssh"

echo "[$SCRIPT_NAME] Disabling root SSH login"
cp "$SSH_CONFIG" "${SSH_CONFIG}.bak"
if grep -q "^#*PermitRootLogin" "$SSH_CONFIG"; then
    sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' "$SSH_CONFIG"
else
    echo "PermitRootLogin no" >> "$SSH_CONFIG"
fi

echo "[$SCRIPT_NAME] Changing VM hostname to: swarmnode.${NEW_USER}"
echo "swarmnode.${NEW_USER}" > /etc/hostname

#Server CA creation
if [ ${TYPE} == "leader" ]; then

    echo "[$SCRIPT_NAME] Setting up directory"
    mkdir -p ${CERT_DIR}
    mv /cert_info.env ${CERT_DIR}/cert_info.env 

    #Server CA generation
    echo "[$SCRIPT_NAME] Generating CA"

    chmod +x /cert_rootCA.sh
    bash /cert_rootCA.sh ${CERT_DIR}

    echo "[$SCRIPT_NAME] Setting up Docker Daemon"
    mkdir -p "/etc/docker"
    if [ ! -f ${CERT_DIR}/ca.crt ]; then
	echo "[$SCRIPT_NAME] Missing CA certificate, marking registry as insecure"
	if [ -f "/etc/docker/daemon.json" ]; then
	    rm -f "/etc/docker/daemon.json"
	fi
	cat > "/etc/docker/daemon.json" << EOF
	{
	    "insecure-registries": [
		"${HOST_IP}:5050"
	    ]
	    "log-driver": "json-file",
	    "log-opts": {
		"max-size": "10m",
		"max-file": "3"
	    }
	}
EOF
    else
	echo "[$SCRIPT_NAME] Found CA certificate, marking registry as secure"
	mkdir -p "/etc/docker/certs.d/${HOST_IP}:5050/"
	cp "${CERT_DIR}/ca.crt" "/etc/docker/certs.d/${HOST_IP}:5050/"
	if [ -f "/etc/docker/daemon.json" ]; then
	    rm -f "/etc/docker/daemon.json"
	fi
	cat > "/etc/docker/daemon.json" << EOF
	{
	    "log-driver": "json-file",
	    "log-opts": {
		"max-size": "10m",
		"max-file": "3"
	    }
	}
EOF
    fi
fi

echo "[$SCRIPT_NAME] Adding utils"
apk update
apk add curl
apk add vim

echo "[$SCRIPT_NAME] Setting up tailscape"
apk add tailscape
rc-update add tailscape default
service tailscape start

echo "[$SCRIPT_NAME] Setting up Headscale"


mkdir -p ${HEADSCALE_DIR}/{config,data}


cat > ${HEADSCALE_DIR}/config/config.yaml <<EOF

server_url: http://${HOST_IP}:9090

listen_addr: 0.0.0.0:${HEADSCALE_PORT}


ip_prefixes:
  - 100.64.0.0/10


database:
  type: sqlite

  sqlite:
    path: /var/lib/headscale/db.sqlite


private_key_path: /var/lib/headscale/private.key


noise:
  private_key_path: /var/lib/headscale/noise_private.key

EOF

cat > ${HEADSCALE_DIR}/docker-compose.yml <<EOF

services:

  headscale:

    image: headscale/headscale:latest

    container_name: headscale

    restart: unless-stopped

    volumes:
      - ${HEADSCALE_DIR}/config:/etc/headscale
      - ${HEADSCALE_DIR}/data:/var/lib/headscale

    ports:
      - "${HEADSCALE_PORT}:${HEADSCALE_PORT}"

    command: headscale serve

EOF

cd ${HEADSCALE_DIR}

docker compose up -d
echo "[$SCRIPT_NAME] Creating Headscale user"


sleep 5


docker exec headscale \
headscale users create swarm || true



echo "[$SCRIPT_NAME] Creating Headscale auth key"


AUTH_KEY=$(docker exec headscale \
headscale preauthkeys create \
--user swarm \
--reusable \
--expiration 24h)


echo "${AUTH_KEY}" > /etc/headscale_authkey

chmod 600 /etc/headscale_authkey
echo "[$SCRIPT_NAME] Registering leader in Tailscale"


tailscale up \
 --login-server=http://${HOST_IP}:9090 \
 --authkey=${AUTH_KEY} \
 --hostname=swarmnode.${NEW_USER}

TAILSCALE_IP=$(tailscale ip -4)

echo "${TAILSCALE_IP}" > ${TAILSCALE_IP_FILE}


echo "[$SCRIPT_NAME] Tailscale IP: ${TAILSCALE_IP}"

echo "[$SCRIPT_NAME] Setting up NFS"
apk add nfs-utils
rc-update add rpcbind
rc-update add nfs

echo "[$SCRIPT_NAME] Setting up nfs-storage"
mkdir -p /nfs-storage/{registry,monitoring,backups} \
    && chown -R ${NEW_USER}:${NEW_USER} "/nfs-storage"
echo "/nfs-storage *(rw,sync,no_subtree_check,no_root_squash)" >> "/etc/exports"
exportfs -ra
#check with exportfs -v

echo "[${SCRIPT_NAME}] VM ip: ${IP}"

echo "[$SCRIPT_NAME] Setup complete"

echo "--------------------------------"
echo "Tailscale IP:"
cat /etc/tailscale_ip
echo
echo "Headscale auth key:"
cat /etc/headscale_authkey
echo "--------------------------------"


echo "[$SCRIPT_NAME] Restarting VM"
reboot
