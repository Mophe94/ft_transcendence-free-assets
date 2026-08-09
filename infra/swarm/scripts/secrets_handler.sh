#! /bin/bash
SCRIPT_NAME="${0##*/}"

# Safeguard
set -euo pipefail
if [ $# -gt 1 ]; then
    echo "[$SCRIPT_NAME] Error: usage: $SCRIPT_NAME <secret_file_path>"
    exit 1
else
    if [ ! -f $1 ]; then
	echo "[$SCRIPT_NAME] Error: file $1 not found"
	exit 1
    else
	SECRET_FILE="$1"
    fi	
fi

echo "[$SCRIPT_NAME] loading secrets"
while IFS='=' read -r key value; do
    #Skip empty lines and comments
    [[ -z "${key// }" ]] && continue
    [[ "$key" =~ [[:space:]]*# ]] && continue
    [[ "${key,,}" == s_* ]] || continue

    #Trim IFS
    key=$(xargs <<<"$key")
    value=$(xargs <<<"$value")

    #Skip not set entries
    [[ -z "${value// }" ]] && continue

    #Create secrets
    secret_name="${key,,}"
    secret_name="${secret_name#s_}"
    if docker secret inspect "$secret_name" >/dev/null 2>&1; then
	echo "\t secret already exist: ${secret_name}"
    else
        echo -n "\t"
	echo -n "$value" | docker secret create "$secret_name" -
    fi
done < "$SECRETS_FILE"
echo "[$SCRIPT_NAME] secrets loaded"
