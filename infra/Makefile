# ---------------------------------------------------------------------------
# Script
# ---------------------------------------------------------------------------

SCRIPT_NAME := Infra-Makefile
LOCATION := $(shell pwd)

# ---------------------------------------------------------------------------
# Environment
# ---------------------------------------------------------------------------

ENV_NAME := env_infra
ENV_FILE := $(LOCATION)/.$(ENV_NAME)
ENV_MK := $(LOCATION)/.$(ENV_NAME).mk
TEMPLATE := template_$(ENV_NAME)

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

LOGS_LOCATION := $(LOCATION)/logs
BUILD_FILE := $(LOCATION)/docker-compose-build.yml
DEPLOY_FILES := $(LOCATION)/stacks
SWARM_UTILS := $(LOCATION)/swarm_utils
CONFIG_SCRIPTS := $(LOCATION)/swarm_utils/config
TOOLS_SCRIPTS := $(LOCATION)/swarm_utils/tools
CONTAINER_FILES := $(LOCATION)/containers
TEAM_CONTAINER := $(shell dirname "$(LOCATION)")
LOGS_LOCATION := $(LOCATION)/logs

# ---------------------------------------------------------------------------
# Environment variables
# ---------------------------------------------------------------------------

include $(ENV_MK)
export

# ---------------------------------------------------------------------------
# Host configuration
# ---------------------------------------------------------------------------

IP4 := $(shell ip -4 route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if($$i=="src") print $$(i+1)}')
HOST_IP := $(shell cat host_ip.txt)
HOST_TAILSCALE_IP := $(shell tailscale ip -4)
USER_NAME := $(USER)

# ---------------------------------------------------------------------------
# Images
# ---------------------------------------------------------------------------

BASE_IMAGES := node-base postgress-base
WEBSITE_IMAGES := backend
DATABASE_IMAGES := users_db game_db
GAME_IMAGES := game redis

ALL_IMAGES := \
	$(BASE_IMAGES) \
	$(WEBSITE_IMAGES) \
	$(DATABASE_IMAGES) \
	$(GAME_IMAGES)

# ---------------------------------------------------------------------------
# Build and deployment configuration
# ---------------------------------------------------------------------------

TAG ?= latest
REGISTRY ?= $(HOST_TAILSCALE_IP):$(REG_PORT)

BAKE_ARG := \
	BAKE_ROOT=$(CONTAINER_FILES) \
	TEAM_CONTAINER=$(TEAM_CONTAINER) \
	HOST_IP=$(HOST_IP) \
	REGISTRY=$(REGISTRY) \
	TAG=$(TAG)

DEPLOY_ARG := \
	IP=$(IP4) \
	HOST_IP=$(HOST_IP) \
	HOST_TAILSCALE_IP=$(HOST_TAILSCALE_IP) \
	REGISTRY_PORT=$(REG_PORT) \
	REGISTRY=$(REGISTRY) \
	PROM_SCRAPE_PORT=$(PROM_SCRAPE_PORT) \
	NFS_IP=$(HOST_TAILSCALE_IP) \
        API_42_CLIENT_ID=${API_42_CLIENT_ID}

TARGET :=

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

LOG_FILE := $(LOGS_LOCATION)/$(SCRIPT_NAME)_$(shell date '+%Y-%m-%d_%H-%M-%S').log

define LOG_INFO
	@mkdir -p "$(LOGS_LOCATION)"; \
	timestamp="$$(date '+%Y-%m-%d %H:%M:%S')"; \
	printf '\033[32m[INFO]\033[0m[%s] %s\n' \
		"$(SCRIPT_NAME)" \
		"$(1)"; \
	printf '[INFO][%s][%s] %s\n' \
		"$$timestamp" \
		"$(SCRIPT_NAME)" \
		"$(1)" >> "$(LOG_FILE)"
endef

define LOG_WARN
	@mkdir -p "$(LOGS_LOCATION)"; \
	timestamp="$$(date '+%Y-%m-%d %H:%M:%S')"; \
	printf '\033[38;5;208m[WARN]\033[0m[%s] %s\n' \
		"$(SCRIPT_NAME)" \
		"$(1)"; \
	printf '[WARN][%s][%s] %s\n' \
		"$$timestamp" \
		"$(SCRIPT_NAME)" \
		"$(1)" >> "$(LOG_FILE)"
endef

define LOG_ERROR
	@mkdir -p "$(LOGS_LOCATION)"; \
	timestamp="$$(date '+%Y-%m-%d %H:%M:%S')"; \
	printf '\033[31m[ERROR]\033[0m[%s] %s\n' \
		"$(SCRIPT_NAME)" \
		"$(1)"; \
	printf '[ERROR][%s][%s] %s\n' \
		"$$timestamp" \
		"$(SCRIPT_NAME)" \
		"$(1)" >> "$(LOG_FILE)"
endef

# ---------------------------------------------------------------------------
# Default target
# ---------------------------------------------------------------------------

all: swarm_launch

# ---------------------------------------------------------------------------
# Swarm launch
# ---------------------------------------------------------------------------

swarm_launch: wait_tailscale
	@$(MAKE) swarm_setup
	@$(MAKE) base
	@$(MAKE) -j4 push
	@$(MAKE) -j4 website game

# ---------------------------------------------------------------------------
# Swarm setup
# ---------------------------------------------------------------------------

swarm_setup:
	@chmod +x "$(CONFIG_SCRIPTS)/launch_swarm.sh"
	@"$(CONFIG_SCRIPTS)/launch_swarm.sh" \
		"$(SWARM_UTILS)" \
		"$(HOST_IP)" \
		"$(HOST_TAILSCALE_IP)"
	@$(MAKE) core

core:
	@doas mkdir -p "/registry"
	@mkdir -p "/nfs-storage/frontend"
	@doas chown "$(USER):$(USER)" "/nfs-storage/frontend"

	@$(BAKE_ARG) \
		LOCAL=false \
		docker buildx bake frontend \
		-f "$(CONTAINER_FILES)/docker-bake.hcl" \
		--allow=fs.read="$(TEAM_CONTAINER)" \
		--allow=fs.write=/nfs-storage/frontend/

	@$(DEPLOY_ARG) \
		docker stack deploy \
		--detach=true \
		-c "$(DEPLOY_FILES)/$@_deploy.yml" \
		$@

	@chmod +x "$(TOOLS_SCRIPTS)/registry_check.sh"

	@if ! bash "$(TOOLS_SCRIPTS)/registry_check.sh" "$(REGISTRY)"; then \
		exit 1; \
	fi

# ---------------------------------------------------------------------------
# Image push
# ---------------------------------------------------------------------------

push:
	@$(BAKE_ARG) \
		LOCAL=false \
		docker buildx bake databases website game \
		-f "$(CONTAINER_FILES)/docker-bake.hcl" \
		--allow=fs.read="$(TEAM_CONTAINER)" \
		--push

# ---------------------------------------------------------------------------
# Base images
# ---------------------------------------------------------------------------

base:
	@$(MAKE) image TARGET=$@

# ---------------------------------------------------------------------------
# Stacks
# ---------------------------------------------------------------------------

website:
	@doas mkdir -p "/var/lib/postgresql/data"

	@$(DEPLOY_ARG) \
		API_42_CLIENT_ID=$(API_42_CLIENT_ID) \
		docker stack deploy \
		--detach=true \
		-c "$(DEPLOY_FILES)/$@_deploy.yml" \
		$@

game:
	@doas mkdir -p "/var/lib/postgresql/data"
	@$(MAKE) image TARGET=$@

	@$(DEPLOY_ARG) \
		docker stack deploy \
		--detach=true \
		-c "$(DEPLOY_FILES)/$@_deploy.yml" \
		$@

observ:
	@mkdir -p "/nfs-storage/grafana/dashboards"
	@doas cp \
		"$(CONTAINER_FILES)/grafana/dashboards/"* \
		"/nfs-storage/grafana/dashboards/"
	@doas chown -R \
		"$(GRAFANA_UID):$(GRAFANA_GID)" \
		"/nfs-storage/grafana"

	@mkdir -p "/nfs-storage/prometheus"
	@doas chown -R \
		"$(PROMETHEUS_UID):$(PROMETHEUS_GID)" \
		"/nfs-storage/prometheus"

	@mkdir -p "/nfs-storage/loki"
	@doas chown -R \
		"$(LOKI_UID):$(LOKI_GID)" \
		"/nfs-storage/loki"

	@$(DEPLOY_ARG) \
		docker stack deploy \
		--detach=true \
		-c "$(DEPLOY_FILES)/$@_deploy.yml" \
		$@

# ---------------------------------------------------------------------------
# Stack management
# ---------------------------------------------------------------------------

up: build
	@$(DEPLOY_ARG) \
		docker stack deploy \
		--detach=true \
		-c "$(DEPLOY_FILES)/$@_deploy.yml" \
		$@

down:
	@stacks="$$(docker stack ls --format '{{.Name}}')"; \
	if [ -n "$$stacks" ]; then \
		echo "$$stacks" | xargs docker stack rm; \
	else \
		echo "[INFO] No stacks to remove"; \
	fi

# ---------------------------------------------------------------------------
# Swarm Management
# ---------------------------------------------------------------------------

swarm_down: down
	@chmod +x "$(CONFIG_SCRIPTS)/end_swarm.sh"
	@"$(CONFIG_SCRIPTS)/end_swarm.sh"
	@docker swarm leave --force

swarm-status:
	@if ! docker info >/dev/null 2>&1; then \
		echo "Docker daemon unavailable"; \
	elif [ "$$(docker info --format '{{.Swarm.LocalNodeState}}')" = "active" ]; then \
		echo "Swarm status: active"; \
	else \
		echo "Swarm status: inactive"; \
	fi

where:
	@for stack in $$(docker stack ls --format '{{.Name}}'); do \
                echo "=== $$stack ==="; \
                docker stack ps "$$stack"; \
	done


# ---------------------------------------------------------------------------
# Node management
# ---------------------------------------------------------------------------

addnode:
	@if read -r -t 15 -p \
		"[$(SCRIPT_NAME)] Node user(s) you want to add: " answer || false; then \
		[ -n "$$answer" ] && \
		chmod +x "$(CONFIG_SCRIPTS)/add_node.sh" && \
		bash "$(CONFIG_SCRIPTS)/add_node.sh" \
			"$(HOST_IP)" \
			"$(HOST_TAILSCALE_IP)" \
			$$answer; \
	else \
		echo "[$(SCRIPT_NAME)] No node added"; \
	fi

# ---------------------------------------------------------------------------
# Image management
# ---------------------------------------------------------------------------

image:
	@case "$(TARGET)" in \
		base) \
			IMAGES="$(BASE_IMAGES)";; \
		website) \
			IMAGES="$(WEBSITE_IMAGES)";; \
		databases) \
			IMAGES="$(DATABASE_IMAGES)";; \
		game) \
			IMAGES="$(GAME_IMAGES)";; \
		*) \
			echo "Unknown target $(TARGET)"; \
			exit 1;; \
	esac; \
	MISSING=0; \
	MISSING_TARGETS=""; \
	for img in $$IMAGES; do \
		if doas docker manifest inspect \
			"$(REGISTRY)/$$img:$(TAG)" >/dev/null 2>&1; then \
			echo "Image $(REGISTRY)/$$img:$(TAG) exists, skip build"; \
		else \
			echo "Image $(REGISTRY)/$$img:$(TAG) not found, building"; \
			MISSING=1; \
			MISSING_TARGETS="$$MISSING_TARGETS $$img"; \
		fi; \
	done; \
	if [ $$MISSING -eq 1 ]; then \
		echo "Building missing images for $(TARGET)"; \
		$(BAKE_ARG) \
			docker buildx bake $$MISSING_TARGETS \
			-f "$(CONTAINER_FILES)/docker-bake.hcl" \
			--push; \
	else \
		echo "All images for $(TARGET) already exist"; \
	fi

img_del:
	@if [ ! -f "$(TOOLS_SCRIPTS)/registry_delete_img.sh" ]; then \
		$(call LOG_ERROR,Missing script: registry_delete_img.sh); \
		exit 1; \
	fi

	@if [ -z "$(IMAGE)" ]; then \
		$(call LOG_ERROR,Usage: make img_del IMAGE=<image>); \
		exit 1; \
	fi

	@if [ -z "$(TAG)" ]; then \
		$(call LOG_ERROR,TAG is required); \
		exit 1; \
	fi

	@chmod +x "$(TOOLS_SCRIPTS)/registry_delete_img.sh"
	@"$(TOOLS_SCRIPTS)/registry_delete_img.sh" \
		"$(REGISTRY)" \
		"$(IMAGE):$(TAG)"

img_del_stack:
	@if [ ! -f "$(TOOLS_SCRIPTS)/registry_delete_img.sh" ]; then \
		$(call LOG_ERROR,Missing script: registry_delete_img.sh); \
		exit 1; \
	fi

	@if [ -z "$(TARGET)" ]; then \
		$(call LOG_ERROR,Usage: make img_del_stack TARGET=<target>); \
		exit 1; \
	fi

	@if [ -z "$(TAG)" ]; then \
		$(call LOG_ERROR,TAG is required); \
		exit 1; \
	fi

	@case "$(TARGET)" in \
		base) \
			IMAGES="$(BASE_IMAGES)";; \
		website) \
			IMAGES="$(WEBSITE_IMAGES)";; \
		databases) \
			IMAGES="$(DATABASE_IMAGES)";; \
		game) \
			IMAGES="$(GAME_IMAGES)";; \
		*) \
			echo "Unknown target $(TARGET)"; \
			exit 1;; \
	esac; \
	chmod +x "$(TOOLS_SCRIPTS)/registry_delete_img.sh"; \
	for img in $$IMAGES; do \
		echo "Deleting image $(REGISTRY)/$$img:$(TAG)"; \
		"$(TOOLS_SCRIPTS)/registry_delete_img.sh" \
			"$(REGISTRY)" \
			"$$img:$(TAG)" || exit 1; \
	done

img_del_all:
	@if [ ! -f "$(TOOLS_SCRIPTS)/registry_delete_img.sh" ]; then \
		$(call LOG_ERROR,Missing script: registry_delete_img.sh); \
		exit 1; \
	fi

	@if [ -z "$(ALL_IMAGES)" ]; then \
		$(call LOG_ERROR,No images configured); \
		exit 1; \
	fi

	@if [ -z "$(TAG)" ]; then \
		$(call LOG_ERROR,TAG is required); \
		exit 1; \
	fi

	@chmod +x "$(TOOLS_SCRIPTS)/registry_delete_img.sh"

	@for img in $(ALL_IMAGES); do \
		echo "Deleting image $(REGISTRY)/$$img:$(TAG)"; \
		"$(TOOLS_SCRIPTS)/registry_delete_img.sh" \
			"$(REGISTRY)" \
			"$$img:$(TAG)" || exit 1; \
	done

# ---------------------------------------------------------------------------
# Tailscale
# ---------------------------------------------------------------------------

wait_tailscale:
	@TIMEOUT=60; \
	INTERVAL=1; \
	ELAPSED=0; \
	until IP=$$(tailscale ip -4 2>/dev/null) && [ -n "$$IP" ]; do \
		sleep $$INTERVAL; \
		ELAPSED=$$((ELAPSED+INTERVAL)); \
		if [ "$$ELAPSED" -ge "$$TIMEOUT" ]; then \
			$(call LOG_ERROR,Headscale failed to become ready); \
			docker logs headscale; \
			exit 1; \
		fi; \
	done

# ---------------------------------------------------------------------------
# Environment makefile
# ---------------------------------------------------------------------------

$(ENV_MK): $(ENV_FILE)
	@if [ ! -f "$(TOOLS_SCRIPTS)/create_env.sh" ] || \
		[ ! -f "$(TOOLS_SCRIPTS)/check_env.sh" ]; then \
		$(call LOG_ERROR,Missing env handlers); \
		exit 1; \
	fi

	@chmod +x "$(TOOLS_SCRIPTS)/check_env.sh"
	@bash "$(TOOLS_SCRIPTS)/check_env.sh" "$(ENV_FILE)"

	@chmod +x "$(TOOLS_SCRIPTS)/create_env.sh"
	@bash "$(TOOLS_SCRIPTS)/create_env.sh" "$(ENV_FILE)" > "$(ENV_MK)"

# ---------------------------------------------------------------------------
# Environment file
# ---------------------------------------------------------------------------

$(ENV_FILE):
	@if [ -f "$(TEMPLATE)" ]; then \
		$(call LOG_INFO,Creating $(ENV_FILE) file, please set all variables); \
		cp "$(TEMPLATE)" "$(ENV_FILE)"; \
		vim -c 'set shortmess+=I' "$(ENV_FILE)"; \
	else \
		$(call LOG_ERROR,Template_env file missing, create $(ENV_FILE) manually. See READ_ME for instructions); \
		exit 1; \
	fi

# ---------------------------------------------------------------------------
# Cleanup
# ---------------------------------------------------------------------------

fclean:
	@docker stack rm core website game observ
	@docker system prune -af --volumes

# ---------------------------------------------------------------------------
# Phony targets
# ---------------------------------------------------------------------------

.PHONY: \
	all \
	swarm_launch \
	swarm_setup \
	core \
	push \
	base \
	website \
	game \
	observ \
	up \
	down \
	swarm_down \
	swarm-status \
	addnode \
	image \
	img_del \
	img_del_stack \
	img_del_all \
	wait_tailscale \
	fclean
