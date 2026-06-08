#! /bin/bash

# Safeguard
set -euo pipefail
SCRIPT_NAME="${0##*/}"
if [ $# -gt 0 ]; then
    echo "[$SCRIPT_NAME] Error: no argument needed"
    exit 1
fi

echo "[SWARM] loading secrets"

create_secret "registry_tls_cert" "tls.crt"
create_secret "registry_tls_key" "tls.key"
create_secret "swarm_ca_cert" "ca.crt"
create_secret "nginx_tls_cert" "tls.crt"
create_secret "nginx_tls_key" "tls.key"

echo "[DONE] swarm secret loaded"
