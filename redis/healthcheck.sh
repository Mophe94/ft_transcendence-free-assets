#!/bin/sh

REDISCLI_AUTH=$(cat /run/secrets/redis_password)
export REDISCLI_AUTH

response=$(redis-cli ping)

if [ "$response" != "PONG" ]; then
  echo "Health check failed: $response"
  exit 1
else
  echo "Redis responded: $response"
  exit 0
fi