#SWARM_STATUS := $(shell docker info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null)
LOCATION := $(shell pwd)
VM_SCRIPTS = $(LOCATION)/vm_management
IP4 := $(shell ip -4 route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if($$i=="src") print $$(i+1)}')
USER_NAME="$(USER)"
TYPE=""
SSH_PORT=2222

all:
	@$(MAKE) setup_worker TYPE="leader"

vm : 
	@if [ "$(USER)" != "stempels" ]; then \
	    echo "You are not supposed to use that !"; \
	    exit 1; \
	fi
	@if [ ! -f "$(VM_SCRIPTS)/vm.sh" ]; then \
		echo "vm.sh file missing"; \
		exit 1; \
	fi
	@chmod +x $(VM_SCRIPTS)/vm.sh
	@bash $(VM_SCRIPTS)/vm.sh

setup_worker:
	@ssh-keygen -f "/home/$(USER)/.ssh/known_hosts" -R "[localhost]:2222"
	@if [ ! -f $(VM_SCRIPTS)/node.sh ]; then \
		echo "node.sh file missing"; \
		exit 1; \
	fi
	@chmod +x $(VM_SCRIPTS)/node.sh;
	@bash $(VM_SCRIPTS)/node.sh $(TYPE) $(IP4);

leader:
	TYPE="leader"
	@$(MAKE) setup_worker
	ssh -tt -p$(SSH_PORT) "$(USER)@localhost" "cd /home/$(USER)/infra && make TYPE=$(TYPE); /bin/bash"

worker:
	TYPE="worker"
	@$(MAKE) setup_worker
	ssh -tt -p$(SSH_PORT) "$(USER)@localhost" "/bin/bash"

vm_erase:
	
.PHONY: all vm setup_worker leader worker vm_erase
