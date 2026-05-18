#!/bin/bash

#Safeguard
set -euo pipefail
SCRIPT_NAME="${0##*/}"
if [ $# -lt 2 ]; then
	echo "Usage: $SCRIPT_NAME <dir> <ip>"
	exit 1
fi

###CONFIG###
CERT_DIR="$1/certs"
REGISTRY_NAME="Swarm-internal-CA"
REGISTRY_IP="$2"
USE_IP=true
OVERWRITE=false

echo "[SECRETS] Setting up directory"
rm -rf "$CERT_DIR"
mkdir -p "$CERT_DIR"
cd "$CERT_DIR"

### SECRET HANDLING ###

secret_exist() {
	docker secret ls | awk '{print $2}' | grep -qx "$1"
}

create_secret() {
	NAME="$1"
	FILE="$2"

	if secret_exist "$NAME" && [ "$OVERWRITE" = false ]; then
			echo "[ABORT] secret exist: $NAME"
	else
		if secret_exist "$NAME"; then
			docker secret rm "$NAME" >/dev/null || true
			echo "[DELETE] old secret: $NAME"
		fi

		echo "[CREATE] secret: $NAME"
		cat "$FILE" | docker secret create "$NAME" -
	fi
}

### GENERATE CA	###
echo "[CERT] generating CA"

openssl genrsa -out ca.key 4096
openssl req -x509 -new -nodes \
		-key ca.key \
		-sha256 \
		-days 30 \
		-out ca.crt \
		-subj "/CN=${REGISTRY_NAME}"

### GENERATE SERVER KEY ###
echo "[CERT] generating server key"

openssl genrsa -out tls.key 4096

### SAN CONFIG ###
cat > san.cnf <<EOF
[req]
distinguished_name = req_distinguished_name
req_extension = v3_req
prompt=no

[req_distinguished_name]
CN = ${REGISTRY_NAME}

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = ${REGISTRY_NAME}
DNS.2 = transcendence_grafana
IP.1 = ${REGISTRY_IP}
EOF

### CSR ###
echo "[CERT] generating CSR"

openssl req -new \
	-key tls.key \
	-out tls.csr \
	-config san.cnf

### SIGN CERT ###
echo "[CERT] signing certificate"

openssl x509 -req \
	-in tls.csr \
	-CA ca.crt \
	-CAkey ca.key \
	-CAcreateserial \
	-out tls.crt \
	-days 30 \
	-sha256 \
	-extensions v3_req \
	-extfile san.cnf

sudo rm -rf /etc/docker/certs.d/${REGISTRY_NAME}:5000
sudo mkdir -p /etc/docker/certs.d/${REGISTRY_NAME}:5000
sudo cp ca.crt /etc/docker/certs.d/${REGISTRY_NAME}:5000/ca.crt
sudo systemctl restart docker

### SWARM SECRET ###
echo "[SWARM] loading secrets"

create_secret "registry_tls_cert" "tls.crt"
create_secret "registry_tls_key" "tls.key"
create_secret "swarm_ca_cert" "ca.crt"
create_secret "nginx_tls_cert" "tls.crt"
create_secret "nginx_tls_key" "tls.key"

#clean up
echo "[CLEAN] removing temp files"
rm -f tls.* ca.* san.cnf
rm -rf "$CERT_DIR"
echo "[DONE] swarm secret loaded"
