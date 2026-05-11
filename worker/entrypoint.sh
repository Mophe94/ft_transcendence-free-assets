#!/bin/sh
set -e

echo "Starting Docker daemon..."

dockerd-entrypoint.sh &

echo "Waiting for Docker..."

until docker info >/dev/null 2>&1
do
  sleep 1
done

echo "Waiting for swarm token..."

until [ -f /swarm/worker.token ]
do
  sleep 1
done

TOKEN=$(cat /swarm/worker.token)

echo "Joining Swarm..."

docker swarm join \
  --token "$TOKEN" \
  "$SWARM_MANAGER":2377 || true

echo "Worker ready."

tail -f /dev/null
