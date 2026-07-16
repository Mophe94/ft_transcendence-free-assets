#SWARM_STATUS := $(shell docker info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null)
STACK_NAME = transcendence
LOCATION := $(shell pwd)
BUILD_FILE = $(LOCATION)/docker-compose-build.yml
DEPLOY_FILES = $(LOCATION)/swarm
SWARM_SCRIPTS = $(LOCATION)/swarm/scripts
CONTAINER_FILES:= "$(LOCATION)/containers"
IP4 := $(shell ip -4 route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if($$i=="src") print $$(i+1)}')
HOST_IP:= $(shell cat host_ip.txt)
REG_PORT ?=5050
REGISTRY ?= $(IP4):$(REG_PORT)
TAG ?= latest
BAKE_ARG = BUILDX_BAKE_ENTITLEMENTS_FS=0 BAKE_ROOT=$(CONTAINER_FILES) REGISTRY=$(REGISTRY) TAG=$(TAG)
DEPLOY_ARG= IP=$(IP4) HOST_IP=$(HOST_IP) REGISTRY_PORT=$(REG_PORT) 
USER_NAME="$(USER)"
TYPE:=""
TARGET=""

all: node_launch

node_launch:
	@if [ "$(TYPE)" == "leader" ]; then \
	    $(MAKE) swarm_setup; \
	    $(MAKE) core; \
	    $(MAKE) push website game; \
	fi

swarm_setup:
	@chmod +x $(SWARM_SCRIPTS)/launch_swarm.sh
	@$(SWARM_SCRIPTS)/launch_swarm.sh "$(SWARM_SCRIPTS)" "$(HOST_IP)"
	@BUILDX_BAKE_ENTITLEMENTS_FS=0 IP=$(IP4) REGISTRY_PORT=$(REG_PORT) docker stack deploy --detach=true -c $(DEPLOY_FILES)/core_deploy.yml    core
	
build:
	echo $(CONTAINER_FILES)
	BAKE_ROOT=$(CONTAINER_FILES) IP=$(IP4) docker buildx bake --no-cache -f $(CONTAINER_FILES)/docker-bake.hcl 

push:
	$(BAKE_ARG) LOCAL=true docker buildx bake base databases website game --no-cache -f $(CONTAINER_FILES)/docker-bake.hcl --push
#	BUILDX_BAKE_ENTITLEMENTS_FS=0 BAKE_ROOT=$(CONTAINER_FILES) IP=$(IP4) docker buildx bake --no-cache -f $(CONTAINER_FILES)/docker-bake.hcl --push
#	BUILDX_BAKE_ENTITLEMENTS_FS=0 BAKE_ROOT=$(CONTAINER_FILES) IP=$(IP4) docker buildx bake observ --no-cache -f $(CONTAINER_FILES)/docker-bake.hcl --push
test:
	BUILDX_BAKE_ENTITLEMENTS_FS=0 BAKE_ROOT=$(CONTAINER_FILES) IP=$(IP4) docker buildx bake fluent-bit --no-cache -f $(CONTAINER_FILES)/docker-bake.hcl

core:
	IP=$(IP4) REGISTRY_PORT=$(REG_PORT) docker stack deploy --detach=true -c $(DEPLOY_FILES)/$@_deploy.yml $@
	chmod +x $(SWARM_SCRIPT)/registry-check.sh
	bash $(SWARM_SCRIPT)/registry-check.sh $(REGISTRY)

website:
	@doas mkdir -p "/var/lib/postgresql/data"
	@doas mkdir -p "/var/lib/game/data"
	make image TARGET=website
	$(DEPLOY_ARG) docker stack deploy --detach=true -c $(DEPLOY_FILES)/$@_deploy.yml $@

game:
	@doas mkdir -p "/var/lib/postgresql/data"
	@doas mkdir -p "/var/lib/game/data"
	make image TARGET=game
	IP=$(IP4) REGISTRY_PORT=$(REG_PORT) docker stack deploy --detach=true -c $(DEPLOY_FILES)/$@_deploy.yml $@

observ:
	@mkdir -p "/nfs-storage/grafana"
	@mkdir -p "/nfs-storage/prometheus"
	@mkdir -p "/nfs-storage/loki"
	make image TARGET=observ
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

image:
	@case "$(TARGET)" in \
	    website) IMAGES="frontend backend ";; \
	    databases) IMAGES="users_db game_db";; \
	    game) IMAGES="game";; \
	    *) echo "Unknown target $(TARGET)"; exit 1;; \
	esac; \
	MISSING=0; \
	MISSING_TARGETS=""; \
	for img in $$IMAGES; do \
	    if docker manifest inspect $(REGISTRY)/$$img:$(TAG) >/dev/null 2>&1; then \
		echo "Image $(REGISTRY)/$$img:$(TAG) exists, skip build"; \
	    else \
		echo "Image $(REGISTRY)/$$img:$(TAG) not found, building"; \
		MISSING=1; \
		MISSING_TARGETS="$$MISSING_TARGETS $$img"; \
	    fi; \
	done; \
	if [ $$MISSING -eq 1 ]; then \
	    echo "Building missing images for $(TARGET)"; \
	    $(BAKE_ARG) docker buildx bake $$MISSING_TARGETS --no-cache -f $(CONTAINER_FILES)/docker-bake.hcl --push; \
	else \
	    echo "All images for $(TARGET) already exist"; \
	fi

PHONY: all node_launch swarm_setup build push test core website game observ up down swarm-status image
