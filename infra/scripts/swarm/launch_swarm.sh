#!/bin/bash
docker swarm init --advertise-addr 2a02:1813:127f:8100:afc6:ef55:7887:11f6

DIR="$1"
SECRET_HANDLER=$DIR/secret_handler.sh
chmod +x $SECRET_HANDLER
$SECRET_HANDLER $DIR

docker service ls
