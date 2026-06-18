#!/bin/bash

SCRIPT_NAME="${0##*/}"

#Safeguard
set -euo pipefail
SCRIPT_NAME="${0##*/}"
if [ $# -lt 1 ]; then
	echo "Usage: $SCRIPT_NAME <ip>"
	exit 1
fi

###CONFIG###
HOST_IP="$1"

echo "[$SCRIPT_NAME] Setting up directory"

### GENERATE CA	###
echo "[$SCRIPT_NAME] generating CA"

openssl genrsa -out ca.key 4096
openssl req -x509 -new -nodes \
		-key ca.key \
		-sha256 \
		-days 30 \
		-out ca.crt \

### GENERATE SERVER KEY ###
echo "[$SCRIPT_NAME] generating server key"

openssl genrsa -out server.key 4096

### SAN CONFIG ###
cat > san.cnf <<EOF
[req]
default_bits = 4096
default_md = sha256
distinguished_name = req_distinguished_name
req_extensions = v3_req

[req_distinguished_name]
CN = ${HOST_IP}

[v3_req]
subjectAltName = @alt_names

[alt_names]
IP.1 = ${HOST_IP}
IP.2 = ${VM_IP}
EOF

### CSR ###
echo "[$SCRIPT_NAME] generating CSR"

openssl req -new \
	-key server.key \
	-out server.csr \
	-config san.cnf

### SIGN CERT ###
echo "[$SCRIPT_NAME] signing certificate"

openssl x509 -req \
	-in server.csr \
	-CA ca.crt \
	-CAkey ca.key \
	-CAcreateserial \
	-out server.crt \
	-days 30 \
	-sha256 \
	-extensions v3_req \
	-extfile san.cnf

#clean up
echo "[$SCRIPT_NAME] removing temp files"
