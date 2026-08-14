SCRIPT_NAME:=Infra-Makefile
LOCATION := $(shell pwd)

# Environment files
ENV_NAME:=env_infra
ENV_FILE:=$(LOCATION)/.$(ENV_NAME)
ENV_MK:=$(LOCATION)/.$(ENV_NAME).mk
TEMPLATE:=template_$(ENV_NAME)

# Files Locations
BUILD_FILE = $(LOCATION)/docker-compose-build.yml
DEPLOY_FILES = $(LOCATION)/stacks
SWARM_UTILS = $(LOCATION)/swarm_utils
CONFIG_SCRIPTS = $(LOCATION)/swarm_utils/config
TOOLS_SCRIPTS = $(LOCATION)/swarm_utils/tools
CONTAINER_FILES:= "$(LOCATION)/containers"

include $(ENV_MK)
export

# Host informations
IP4 := $(shell ip -4 route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if($$i=="src") print $$(i+1)}')
HOST_IP:= $(shell cat host_ip.txt)
HOST_TAILSCALE_IP = $(shell tailscale ip -4)
USER_NAME="$(USER)"

# Miscellanious
TAG ?= latest
REGISTRY?=$(HOST_TAILSCALE_IP):$(REG_PORT)
BAKE_ARG = BUILDX_BAKE_ENTITLEMENTS_FS=0 BAKE_ROOT=$(CONTAINER_FILES) REGISTRY=$(REGISTRY) TAG=$(TAG)
DEPLOY_ARG= IP=$(IP4) HOST_IP=$(HOST_IP) HOST_TAILSCALE_IP=$(HOST_TAILSCALE_IP) REGISTRY_PORT=$(REG_PORT) PROM_SCRAPE_PORT=$(PROM_SCRAPE_PORT) NFS_IP=$(HOST_TAILSCALE_IP)
TARGET=""

all: node_launch

node_launch: wait_tailscale
	$(MAKE) swarm_setup
	$(MAKE) core
	$(MAKE) push website observ game

swarm_setup:
	@chmod +x $(CONFIG_SCRIPTS)/launch_swarm.sh
	@$(CONFIG_SCRIPTS)/launch_swarm.sh "$(SWARM_UTILS)" "$(HOST_IP)" "$(HOST_TAILSCALE_IP)"
	@$(DEPLOY_ARG) docker stack deploy --detach=true -c $(DEPLOY_FILES)/core_deploy.yml    core
	
push:
	$(BAKE_ARG) LOCAL=true docker buildx bake base databases website game -f $(CONTAINER_FILES)/docker-bake.hcl --push >> /home/stempels/infra/build.log
#	BUILDX_BAKE_ENTITLEMENTS_FS=0 BAKE_ROOT=$(CONTAINER_FILES) IP=$(IP4) docker buildx bake --no-cache -f $(CONTAINER_FILES)/docker-bake.hcl --push
#	BUILDX_BAKE_ENTITLEMENTS_FS=0 BAKE_ROOT=$(CONTAINER_FILES) IP=$(IP4) docker buildx bake observ --no-cache -f $(CONTAINER_FILES)/docker-bake.hcl --push
test:
	BUILDX_BAKE_ENTITLEMENTS_FS=0 BAKE_ROOT=$(CONTAINER_FILES) IP=$(IP4) docker buildx bake fluent-bit --no-cache -f $(CONTAINER_FILES)/docker-bake.hcl

core:
	@$(DEPLOY_ARG) docker stack deploy --detach=true -c $(DEPLOY_FILES)/$@_deploy.yml $@
	@chmod +x $(TOOLS_SCRIPTS)/registry_check.sh
	@if ! bash $(TOOLS_SCRIPTS)/registry_check.sh "$(REGISTRY)";then \
          exit 1; \
        fi

website:
	@doas mkdir -p "/var/lib/postgresql/data"
	@doas mkdir -p "/var/lib/game/data"
	@mkdir -p "/nfs-storage/users_data"
	@make image TARGET=$@
	$(DEPLOY_ARG) docker stack deploy --detach=true -c $(DEPLOY_FILES)/$@_deploy.yml $@

game:
	@doas mkdir -p "/var/lib/postgresql/data"
	@doas mkdir -p "/var/lib/game/data"
	@mkdir -p "/nfs-storage/game_data"
	@make image TARGET=$@
	$(DEPLOY_ARG) docker stack deploy --detach=true -c $(DEPLOY_FILES)/$@_deploy.yml $@

observ:
	@mkdir -p "/nfs-storage/grafana"
	@mkdir -p "/nfs-storage/grafana/dashboards"
	@doas cp $(CONTAINER_FILES)/grafana/dashboards/* "/nfs-storage/grafana/dashboards/"
	@doas chown -R $(GRAFANA_UID):$(GRAFANA_GID) /nfs-storage/grafana;
	@mkdir -p "/nfs-storage/prometheus"
	@doas chown -R $(PROMETHEUS_UID):$(PROMETHEUS_GID) /nfs-storage/prometheus;
	@mkdir -p "/nfs-storage/loki"
	@doas chown -R $(LOKI_UID):$(LOKI_GID) /nfs-storage/loki;
#	@make image TARGET=$@
	$(DEPLOY_ARG) docker stack deploy --detach=true -c $(DEPLOY_FILES)/$@_deploy.yml $@

up: build
	$(DEPLOY_ARG) docker stack deploy --detach=true -c $(DEPLOY_FILES)/$@_deploy.yml $@

down:
	chmod 777 $(CONFIG_SCRIPTS)/end_swarm.sh:wq

	$(CONFIG_SCRIPTS)/end_swarm.sh
	@$(MAKE) --no-print-directory swarm-status

swarm-status:
	@if ! docker info >/dev/null 2>&1; then \
	    echo "Docker daemon unavailable"; \
	elif [ "$$(docker info --format '{{.Swarm.LocalNodeState}}')" = "active" ]; then \
	    echo "Swarm status: active"; \
	else \
	    echo "Swarm status: inactive"; \
	fi

addnode:
	@read -r -t 15 -p "[$(SCRIPT_NAME)] Do you want to add more nodes (y/N): " answer || true; \
	case "$$(printf '%s' "$$answer" | tr '[:upper:]' '[:lower:]')" in \
		y|yes) \
			read -r -t 15 -p "[$(SCRIPT_NAME)] Node user(s): " answer || true; \
			[ -n "$$answer" ] && \
				chmod +x "$(CONFIG_SCRIPTS)/add_node.sh" && \
				bash "$(CONFIG_SCRIPTS)/add_node.sh" "$(HOST_IP)" $$answer ;; \
		*) \
			echo "[$(SCRIPT_NAME)] No node added" ;; \
	esac

image:
	@case "$(TARGET)" in \
	    website) IMAGES="frontend backend ";; \
	    databases) IMAGES="users_db game_db";; \
	    game) IMAGES="game redis";; \
	    *) echo "Unknown target $(TARGET)"; exit 1;; \
	esac; \
	MISSING=0; \
	MISSING_TARGETS=""; \
	for img in $$IMAGES; do \
	    if doas docker manifest inspect $(REGISTRY)/$$img:$(TAG) >/dev/null 2>&1; then \
		echo "Image $(REGISTRY)/$$img:$(TAG) exists, skip build"; \
	    else \
		echo "Image $(REGISTRY)/$$img:$(TAG) not found, building"; \
		MISSING=1; \
		MISSING_TARGETS="$$MISSING_TARGETS $$img"; \
	    fi; \
	done; \
	if [ $$MISSING -eq 1 ]; then \
	    echo "Building missing images for $(TARGET)"; \
	    $(BAKE_ARG) docker buildx bake $$MISSING_TARGETS -f $(CONTAINER_FILES)/docker-bake.hcl --push; \
	else \
	    echo "All images for $(TARGET) already exist"; \
	fi

wait_tailscale:
	@TIMEOUT=60; \
	INTERVAL=1; \
	ELAPSED=0; \
	until IP=$$(tailscale ip -4 2>/dev/null) && [ -n "$$IP" ]; do \
	    sleep $$INTERVAL; \
	    ELAPSED=$$((ELAPSED+INTERVAL)); \
	    if [ "$$ELAPSED" -ge "$$TIMEOUT" ]; then \
		echo "[$(SCRIPT_NAME)] Headscale failed to become ready"; \
		docker logs headscale; \
		exit 1; \
	    fi; \
	done

$(ENV_MK): $(ENV_FILE)
	@if [ ! -f "$(TOOLS_SCRIPTS)"/create_env.sh ] || [ ! -f "$(TOOLS_SCRIPTS)"/check_env.sh ]; then \
	    echo "Missing env handlers"; \
	    exit 1; \
	fi
	@chmod +x "$(TOOLS_SCRIPTS)/check_env.sh"
	@bash "$(TOOLS_SCRIPTS)/check_env.sh" $(ENV_FILE)
	@chmod +x "$(TOOLS_SCRIPTS)/create_env.sh"
	@bash "$(TOOLS_SCRIPTS)/create_env.sh" $(ENV_FILE) > $(ENV_MK)

$(ENV_FILE):
	@if [ -f $(TEMPLATE) ]; then \
		echo "Creating $(ENV_FILE) file, please set all variables"; \
		cp $(TEMPLATE) $(ENV_FILE); \
		vim -c 'set shortmess+=I' $(ENV_FILE); \
	else \
		echo "Template_env file missing, you will need to create $(ENV_FILE) file yourself.\n See READ_ME for how to do it"; \
		exit 1; \
	fi

PHONY: all node_launch swarm_setup swarm_status push test core website game observ up down swarm-status image wait_tailscale
