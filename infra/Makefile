#SWARM_STATUS := $(shell docker info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null)
STACK_NAME = transcendence
LOCATION := $(shell pwd)
BUILD_FILE = $(LOCATION)/docker-compose-build.yml
DEPLOY_FILES = $(LOCATION)/swarm
SWARM_SCRIPTS = $(LOCATION)/swarm/scripts
CONTAINER_FILES:= "$(LOCATION)/containers"
IP4 := $(shell ip -4 route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if($$i=="src") print $$(i+1)}')
USER_NAME="$(USER)"
TYPE:=""
HOST_IP:= $(shell cat host_ip.txt)
REG_PORT=5050

all:
	@$(MAKE) --no-print-directory swarm-status

node_launch:
	@if [ "$(TYPE)" == "manager" ]; then \
	    $(MAKE) swarm_setup; \
	fi

swarm_setup:
	@chmod +x $(SWARM_SCRIPTS)/launch_swarm.sh
	@$(SWARM_SCRIPTS)/launch_swarm.sh "$(SWARM_SCRIPTS)" "$(HOST_IP)"
	@BUILDX_BAKE_ENTITLEMENTS_FS=0 IP=$(IP4) REGISTRY_PORT=$(REG_PORT) docker stack deploy --detach=true -c $(DEPLOY_FILES)/core_deploy.yml    core
	
build:
	echo $(CONTAINER_FILES)
	BAKE_ROOT=$(CONTAINER_FILES) IP=$(IP4) docker buildx bake --no-cache -f $(CONTAINER_FILES)/docker-bake.hcl 

push:
	BUILDX_BAKE_ENTITLEMENTS_FS=0 BAKE_ROOT=$(CONTAINER_FILES) IP=$(IP4) docker buildx bake databases --no-cache -f $(CONTAINER_FILES)/docker-bake.hcl --push
	BUILDX_BAKE_ENTITLEMENTS_FS=0 BAKE_ROOT=$(CONTAINER_FILES) IP=$(IP4) docker buildx bake website --no-cache -f $(CONTAINER_FILES)/docker-bake.hcl --push
	BUILDX_BAKE_ENTITLEMENTS_FS=0 BAKE_ROOT=$(CONTAINER_FILES) IP=$(IP4) docker buildx bake game --no-cache -f $(CONTAINER_FILES)/docker-bake.hcl --push
#	BUILDX_BAKE_ENTITLEMENTS_FS=0 BAKE_ROOT=$(CONTAINER_FILES) IP=$(IP4) docker buildx bake --no-cache -f $(CONTAINER_FILES)/docker-bake.hcl --push
#	BUILDX_BAKE_ENTITLEMENTS_FS=0 BAKE_ROOT=$(CONTAINER_FILES) IP=$(IP4) docker buildx bake observ --no-cache -f $(CONTAINER_FILES)/docker-bake.hcl --push
test:
	BUILDX_BAKE_ENTITLEMENTS_FS=0 BAKE_ROOT=$(CONTAINER_FILES) IP=$(IP4) docker buildx bake fluent-bit --no-cache -f $(CONTAINER_FILES)/docker-bake.hcl

core:
	IP=$(IP4) REGISTRY_PORT=$(REG_PORT) docker stack deploy --detach=true -c $(DEPLOY_FILES)/$@_deploy.yml $@

website:
	@doas mkdir -p "/var/lib/postgresql/data"
	@doas mkdir -p "/var/lib/game/data"
	IP=$(IP4) REGISTRY_PORT=$(REG_PORT) docker stack deploy --detach=true -c $(DEPLOY_FILES)/$@_deploy.yml $@

game:
	@doas mkdir -p "/var/lib/postgresql/data"
	@doas mkdir -p "/var/lib/game/data"
	IP=$(IP4) REGISTRY_PORT=$(REG_PORT) docker stack deploy --detach=true -c $(DEPLOY_FILES)/$@_deploy.yml $@

observ:
	@mkdir -p "/nfs-storage/grafana"
	@mkdir -p "/nfs-storage/prometheus"
	@mkdir -p "/nfs-storage/loki"
	IP=$(IP4) REGISTRY_PORT=$(REG_PORT) docker stack deploy --detach=true -c $(DEPLOY_FILES)/$@_deploy.yml $@

up: build
	IP=$(IP4) REGISTRY_PORT=$(REG_PORT) docker stack deploy --detach=true -c $(DEPLOY_FILES)/$@_deploy.yml $@

down:
	chmod 777 $(SWARM_SCRIPTS)/end_swarm.sh
	$(SWARM_SCRIPTS)/end_swarm.sh
	@$(MAKE) --no-print-directory swarm-status

swarm-status:
	@if ! docker info >/dev/null 2>&1; then \
	    echo "Docker daemon unavailable"; \
	elif [ "$$(docker info --format '{{.Swarm.LocalNodeState}}')" = "active" ]; then \
	    echo "Swarm status: active"; \
	else \
	    echo "Swarm status: inactive"; \
	fi

PHONY: all node_launch swarm_setup build push test core website game observ up down swarm-status
