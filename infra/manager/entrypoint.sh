#!/bin/sh
set -e

echo "Starting Docker daemon..."

dockerd-entrypoint.sh &

echo "Waiting for Docker..."

until docker info >/dev/null 2>&1
do
  sleep 1
done

echo "Initializing Swarm..."

docker swarm init --advertise-addr 10.10.0.2 || true

echo "Saving worker token..."

docker swarm join-token -q worker > /swarm/worker.token

echo "Manager ready."

tail -f /dev/null
