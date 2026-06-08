#SWARM_STATUS := $(shell docker info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null)
STACK_NAME = transcendence
LOCATION := $(shell pwd)
VM_SCRIPTS = $(LOCATION)/vm_management
IP4 := $(shell ip -4 route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if($$i=="src") print $$(i+1)}')
USER_NAME="$(USER)"
TYPE=""
HOST_IP :=$(IP4)

all:
	@$(MAKE) --no-print-directory swarm-status

swarm-status:
	@if ! docker info >/dev/null 2>&1; then \
	    echo "Docker daemon unavailable"; \
	elif [ "$$(docker info --format '{{.Swarm.LocalNodeState}}')" = "active" ]; then \
	    echo "Swarm status: active"; \
	else \
	    echo "Swarm status: inactive"; \
	fi

vm : 
	@if [ "$(USER)" != "stempels" ]; then \
	    echo "You are not supposed to use that !"; \
	    exit 1; \
	fi
	@if [ ! -f "$(VM_SCRIPTS)/vm.sh" ]; then \
		echo "vm.sh file missing"; \
		exit 1; \
	fi
	@chmod +x ./$(VM_SCRIPTS)/vm.sh
	@./$(VM_SCRIPTS)/vm.sh

setup_worker:
	@if [ ! -f $(VM_SCRIPTS)/worker.sh ]; then \
		echo "worker.sh file missing"; \
		exit 1; \
	fi
	@chmod +x ./$(VM_SCRIPTS)/worker.sh;
	@./$(VM_SCRIPTS)/worker.sh $(TYPE) $(HOST_IP);

worker:
	@$(MAKE) setup_worker TYPE="worker"

manager:
	@$(MAKE) setup_worker TYPE="manager"

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
	
