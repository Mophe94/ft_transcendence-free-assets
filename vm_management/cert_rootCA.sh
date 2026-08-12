#! /bin/bash
SCRIPT_NAME="${0##*/}"
LOCATION="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Safeguard
if [ $# -ne 2 ]; then
    echo "Usage: ${SCRIPT_NAME} <certs directory path> <IP>"
    exit 1
else
    CERT_DIR="$1"
    IP="$2"
fi

echo "[$SCRIPT_NAME] Setting up directory"
mkdir -p ${CERT_DIR}

#Server CA generation
echo "[$SCRIPT_NAME] Generating CA"
cd ${CERT_DIR}

openssl genrsa -out ca.key 4096
if [ -f "${CERT_DIR}/cert_info.env" ]; then
    source "${CERT_DIR}/cert_info.env"
    SUBJECT="/C=${COUNTRY}/ST=${STATE}/L=${CITY}/O=${ORG}/OU=${OU}/CN=${IP}"
    openssl req -x509 -new -nodes \
            -key ca.key \
	    -sha256 \
	    -days 30 \
	    -out ca.crt \
            -subj "$SUBJECT"
else
    openssl req -x509 -new -nodes \
            -key ca.key \
	    -sha256 \
	    -days 30 \
	    -out ca.crt 
fi

if [ -f "/usr/local/share/ca-certificates/transcendence-root-ca.cert" ]; then
	doas rm -rf "/usr/local/share/ca-certificates/transcendence-root-ca.crt"
	doas update-ca-certificates
fi
doas cp ca.crt /usr/local/share/ca-certificates/transcendence-root-ca.crt
doas update-ca-certificates
