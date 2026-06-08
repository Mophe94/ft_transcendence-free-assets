#! /bin/bash

# Safeguard
set -euo pipefail
SCRIPT_NAME="${0##*/}"
if [ $# -gt 1 ]; then
    echo "[$SCRIPT_NAME] Error: usage: $SCRIPT_NAME <secret_file_path>"
    exit 1
else
    if [ ! -f \'$1\' ]; then
	echo "[$SCRIPT_NAME] Error: file \'$1\' not found"
	exit 1
    else
	SECRET_FILE="$1"
    fi	
fi

echo "[$SCRIPT_NAME] loading secrets"
while IFS='=' read -r key value; do
    #Skip empty lines and comments
    [[ -z "${key// }" ]] && continue
    [[ "$key" =~[[:space:]]*# ]] && continue

    #Trim IFS
    key=$(xargs <<<"$key")
    value=$(xargs <<<"$value")

    #Create secrets
    if docker secret inspect "$key" >/dev/null 2>&1; then
	echo "[$SCRIPT_NAME] already existing secret"
    else
	echo -n "$value" | docker secret create "$key" -
    fi
done < "$SECRET_FILE"
echo "[$SCRIPT_NAME] secrets loaded"
