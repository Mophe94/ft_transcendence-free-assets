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

echo "[$SCRIPT_NAME] Checking registry API..."
TIMEOUT=60
INTERVAL=2
ELAPSED=0

echo "[$SCRIPT_NAME] Waiting for registry API..."

while ! curl --cacert /etc/certs/ca.crt --cert /home/${USER}/certs/worker.crt --key /home/${USER}/certs/worker.key -fsS "https://${REGISTRY}/v2/" >/dev/null 2>&1; do
    if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
        echo "[$SCRIPT_NAME] ERROR: Registry did not become available after ${TIMEOUT}s"
        exit 1
    fi

    echo "[$SCRIPT_NAME] Registry not ready (${ELAPSED}/${TIMEOUT}s)"
    sleep "$INTERVAL"
    ELAPSED=$((ELAPSED + INTERVAL))
done

echo "[$SCRIPT_NAME] Registry is available."

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
