#!/usr/bin/env bash
set -euo pipefail
SCRIPT_NAME="${0##*/}"

if [ ! $# -eq 2 ]; then
  echo "[$SCRIPT_NAME] Correct usage: <registry url>"
  exit 1
fi

REGISTRY="$1"
IMAGE="registry-healthcheck"
TAG="test-$(date +%s)"

echo "[$SCRIPT_NAME] Checking registry API..."
curl -kfsS "https://${REGISTRY}/v2/" >/dev/null

echo "[$SCRIPT_NAME] Pulling test image..."
docker pull alpine:latest >/dev/null

echo "[$SCRIPT_NAME] Tagging image..."
docker tag alpine:latest "${REGISTRY}/${IMAGE}:${TAG}"

echo "[$SCRIPT_NAME] Pushing image..."
docker push "${REGISTRY}/${IMAGE}:${TAG}" >/dev/null

echo "[$SCRIPT_NAME] Verifying image exists..."
TAGS=$(curl -fsS "http://${REGISTRY}/v2/${IMAGE}/tags/list")

echo "$TAGS" | grep -q "$TAG"

echo "[$SCRIPT_NAME] Registry is healthy and accepting pushes."
