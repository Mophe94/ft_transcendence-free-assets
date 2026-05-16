#!/bin/bash
docker swarm init --advertise-addr 2a02:1813:127f:8100:afc6:ef55:7887:11f6
docker network create \
	--driver overlay \
	--attachable \
	registry_net

docker service create \
	--name registry \
	--network registry_net \
	--publish published=5000,target=5000 \
	--constraint 'node.role==manager' \
	--mount type=bind,src=/home/stempels/19/ft_transcendence/infra/registry-certs/certs,dst=/certs,ro \
	--env REGISTRY_HTTP_TLS_CERTIFICATE=/certs/tls.crt \
	--env REGISTRY_HTTP_TLS_KEY=/certs/tls.key \
	registry:2

docker service ls
