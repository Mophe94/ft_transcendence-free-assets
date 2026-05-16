#!/usr/bin/env bash
set -e

CERT_DIR="$HOME/registry-certs"
cd "$CERT_DIR"

DAYS=3650

echo "[+] Regenerating server key + certificate using existing san.cnf and CA"

if [ ! -f san.cnf ]; then
  echo "ERROR: san.cnf not found in $CERT_DIR"
  exit 1
fi

if [ ! -f ca.crt ] || [ ! -f ca.key ]; then
  echo "ERROR: CA files (ca.crt / ca.key) missing"
  exit 1
fi

echo "[+] Generating new server key"
openssl genrsa -out registry.key 4096

echo "[+] Generating CSR"
openssl req -new \
  -key registry.key \
  -out registry.csr \
  -config san.cnf

echo "[+] Signing certificate with existing CA"
openssl x509 -req \
  -in registry.csr \
  -CA ca.crt \
  -CAkey ca.key \
  -CAcreateserial \
  -out registry.crt \
  -days $DAYS \
  -sha256 \
  -extensions v3_req \
  -extfile san.cnf

echo "[+] Updating Docker registry cert format"
mkdir -p certs
cp registry.crt certs/tls.crt
cp registry.key certs/tls.key

echo "[+] DONE - certificate regenerated"
