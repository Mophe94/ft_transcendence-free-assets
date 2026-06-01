#SWARM_STATUS := $(shell docker info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null)
STACK_NAME = transcendence
LOCATION := $(shell pwd)
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
	
BAKE_ROOT:= "$(LOCATION)/infra/containers"

build:
	echo $(BAKE_ROOT)
	BAKE_ROOT=$(BAKE_ROOT) IP=$(IP4) docker buildx bake --no-cache -f $(BAKE_ROOT)/docker-bake.hcl 

push:
	BAKE_ROOT=$(BAKE_ROOT) IP=$(IP4) docker buildx bake --no-cache -f $(BAKE_ROOT)/docker-bake.hcl --push
	BAKE_ROOT=$(BAKE_ROOT) IP=$(IP4) docker buildx bake site --no-cache -f $(BAKE_ROOT)/docker-bake.hcl --push

website_setup:
	docker stack deploy -c infra/swarm/website_deploy.yml website

observ_setup:
	docker stack deploy -c infra/swarm/observability_deploy.yml metrics

up: build
	docker stack deploy -c infra/swarm/website_deploy.yml website

down:
	chmod 777 infra/swarm/scripts/end_swarm.sh
	infra/swarm/scripts/end_swarm.sh
	@$(MAKE) --no-print-directory swarm-status

swarm-status:
	@if ! docker info >/dev/null 2>&1; then \
	    echo "Docker daemon unavailable"; \
	elif [ "$$(docker info --format '{{.Swarm.LocalNodeState}}')" = "active" ]; then \
	    echo "Swarm status: active"; \
	else \
	    echo "Swarm status: inactive"; \
	fi

create_vm_base : 
	chmod +x Vmscript.sh
	./Vmscript.sh /media/stempels/Extreme SSD/alpine-virt-3.23.4-x86_64.iso

iso_test/image/*.iso:
	mkdir -p iso_test/image
	chmod 777 iso_test/image
	@if ! ls iso_test/image/*.iso >/dev/null 2>&1; then \
		docker build iso_test/ -t swarm_test; \
	fi
	@if docker ps -a --filter "name=test"; then \
		docker rm -f test; \
	fi
	@docker run -it --privileged --rm -v"$(LOCATION)/iso_test/image:/build/image" --name test swarm_test sh;
	chmod 755 iso_test/image

vm_erase:
	
