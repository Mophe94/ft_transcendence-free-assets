#!/usr/bin/env bash
set -euo pipefail
SCRIPT_NAME="${0##*/}"

if [ ! $# -eq 1 ]; then
  echo "[$SCRIPT_NAME] Correct usage: <registry url>"
  exit 1
fi

REGISTRY="$1"
IMAGE="registry-healthcheck"
TAG="test-$(date +%s)"

#Checking registry API
TIMEOUT=120
INTERVAL=1
ELAPSED=0
while ! curl --cacert /etc/certs/ca.crt \
    --cert "/home/${USER}/certs/worker.crt" \
    --key "/home/${USER}/certs/worker.key" \
    -fsS "https://${REGISTRY}/v2/" >/dev/null 2>&1; do
    if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
        printf "\n[%s] ERROR: Registry did not become available after %ds\n" "$SCRIPT_NAME" "$TIMEOUT"
        exit 1
    fi

    printf "\r\033[K[%s] Registry not ready (%d/%ds)" \
        "$SCRIPT_NAME" "$ELAPSED" "$TIMEOUT"

    sleep "$INTERVAL"
    ELAPSED=$((ELAPSED + INTERVAL))
done
printf "\n[%s] Registry is ready\n" "$SCRIPT_NAME"

echo "[$SCRIPT_NAME] Pulling test image..."
docker pull alpine:latest >/dev/null

echo "[$SCRIPT_NAME] Tagging image..."
docker tag alpine:latest "${REGISTRY}/${IMAGE}:${TAG}"

echo "[$SCRIPT_NAME] Pushing image..."
docker push "${REGISTRY}/${IMAGE}:${TAG}" >/dev/null

echo "[$SCRIPT_NAME] Verifying image exists..."
TAGS=$(curl --cacert /etc/certs/ca.crt --cert /home/${USER}/certs/worker.crt --key /home/${USER}/certs/worker.key -fsS "https://${REGISTRY}/v2/${IMAGE}/tags/list")

echo "$TAGS" | grep -q "$TAG"

echo "[$SCRIPT_NAME] Registry is healthy and accepting pushes."
