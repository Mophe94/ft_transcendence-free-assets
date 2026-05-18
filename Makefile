#SWARM_STATUS := $(shell docker info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null)
STACK_NAME = transcendence
LOCATION = $(CURDIR)
BUILD_FILE = $(LOCATION)/infra/docker-compose-build.yml
DEPLOY_FILE = $(LOCATION)/infra/docker-compose-deploy.yml
OBSERV_FILE = $(LOCATION)/infra/docker-compose-observability.yml
SCRIPTS = $(LOCATION)/infra/scripts
IP4 := $(shell ip -4 route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if($$i=="src") print $$(i+1)}')

all:
	@$(MAKE) --no-print-directory swarm-status

swarm_setup:
	@chmod +x infra/swarm/scripts/launch_swarm.sh
	@infra/swarm/scripts/launch_swarm.sh "infra/swarm/scripts" "$(IP4)"
	docker stack deploy -c infra/swarm/swarm_core_deploy.yml    swarm_core
	docker stack deploy -c infra/swarm/observability_deploy.yml metrics

build: swarm_setup
	docker buildx bake --no-cache -f infra/containers/docker-bake.hcl

push: build
	docker compose -f $(BUILD_FILE) push

up: build
	docker stack deploy -c infra/swarm/website_deploy.yml website

down:
	chmod 777 infra/swarm/scripts/end_swarm.sh
	infra/swarm/scripts/end_swarm.sh
	@$(MAKE) --no-print-directory swarm-status

swarm-status:
	@if ! docker info >/dev/null 2>&1; then echo "Docker daemon unavailable"; elif [ "$$(docker info --format '{{.Swarm.LocalNodeState}}')" = "active" ]; then echo "Swarm status: active"; else echo "Swarm status: inactive"; fi
