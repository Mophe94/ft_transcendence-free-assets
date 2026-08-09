#!/bin/sh

set -euo pipefail

if [ "$#" -lt 1 ]; then
    echo "Missing entrypoint script"
    exit 1
fi

SECRETS_DIR="/run/secrets"

if [ ! -d ${SECRETS_DIR} ]; then
    echo "No secrets to load"
else
    for file in ${SECRETS_DIR}/*; do
	[ -f "$file" ] || continue
	name=$(basename "$file")
	value=$(cat "$file")
	export "$name=$value"
    done
fi

exec "$@"
