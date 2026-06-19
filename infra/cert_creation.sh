#!/bin/bah
SCRIPT_NAME="${0##*/}"

#Safeguard
set -euo pipefail
SCRIPT_NAME="${0##*/}"
if [ ! $# -eq 3 ]; then
	echo "Usage: ${SCRIPT_NAME} <ca_dir_absolute_path> <subj> <certificate_name>"
	exit 1
fi

#Setup

CA_DIR=$1
SUBJ=$2
CERT_NAME=$3
CERT_DIR="$HOME/certs/"
mkdir -p ${CERT_DIR}
cd ${CERT_DIR}

#San config
cat > san.cnf <<EOF
[req]
default_bits = 4096
default_md = sha256
distinguished_name = req_distinguished_name
req_extensions = v3_req

[req_distinguished_name]
CN = ${SUBJ}

[v3_req]
subjectAltName = @alt_names

[alt_names]
IP.1 = ${SUBJ}
EOF

#Subj key generation
echo "[$SCRIPT_NAME] generating server key"

doas openssl genrsa -out ${CERT_NAME}.key 4096

#CSR generation
echo "[$SCRIPT_NAME] generating CSR"

doas openssl req -new \
	-key ${CERT_NAME}.key \
	-out ${CERT_NAME}.csr \
	-config san.cnf

#Sig certification
echo "[$SCRIPT_NAME] signing certificate"

doas openssl x509 -req \
	-in ${CERT_NAME}.csr \
	-CA ${CA_DIR}/ca.crt \
	-CAkey ${CA_DIR}/ca.key \
	-CAcreateserial \
	-out ${CERT_NAME}.crt \
	-days 30 \
	-sha256 \
	-extensions v3_req \
	-extfile san.cnf

#clean up
echo "[$SCRIPT_NAME] removing temp files"
rm -f san.cnf
