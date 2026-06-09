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
HOST_IP:=""

all:
	@$(MAKE) --no-print-directory swarm-status

node_launch:
	@if [ "$(TYPE)" == "manager" ]; then \
	    $(MAKE) swarm_setup; \
	fi

swarm_setup:
	@chmod +x $(SWARM_SCRIPTS)/launch_swarm.sh
	@$(SWARM_SCRIPTS)/launch_swarm.sh "$(SWARM_SCRIPTS)" "$(HOST_IP)"
	IP=$(IP4) docker stack deploy --detach=true -c $(DEPLOY_FILES)/core_deploy.yml    core
	
build:
	echo $(CONTAINER_FILES)
	BAKE_ROOT=$(CONTAINER_FILES) IP=$(IP4) docker buildx bake --no-cache -f $(CONTAINER_FILES)/docker-bake.hcl 

push:
	BAKE_ROOT=$(CONTAINER_FILES) IP=$(IP4) docker buildx bake databases --no-cache -f $(CONTAINER_FILES)/docker-bake.hcl --push
	BAKE_ROOT=$(CONTAINER_FILES) IP=$(IP4) docker buildx bake site --no-cache -f $(CONTAINER_FILES)/docker-bake.hcl --push
#	BAKE_ROOT=$(CONTAINER_FILES) IP=$(IP4) docker buildx bake --no-cache -f $(CONTAINER_FILES)/docker-bake.hcl --push

core:
	IP=$(IP4) docker stack deploy --detach=true -c $(DEPLOY_FILES)/$@_deploy.yml $@

website:
	IP=$(IP4) docker stack deploy --detach=true -c $(DEPLOY_FILES)/$@_deploy.yml $@

observ:
	IP=$(IP4) docker stack deploy --detach=true -c $(DEPLOY_FILES)/$@_deploy.yml $@

up: build
	IP=$(IP4) docker stack deploy --detach=true -c $(DEPLOY_FILES)/$@_deploy.yml $@

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
