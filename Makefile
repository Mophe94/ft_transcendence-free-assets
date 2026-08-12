#SWARM_STATUS := $(shell docker info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null)
LOCATION := $(shell pwd)

# Environment files
ENV_NAME:=env_vm
ENV_FILE:=$(LOCATION)/.$(ENV_NAME)
ENV_MK:=$(LOCATION)/.$(ENV_NAME).mk
TEMPLATE:=template_$(ENV_NAME)

VM_SCRIPTS = $(LOCATION)/vm_management
TOOLS_SCRIPTS:=$(LOCATION)/tools
IP4 := $(shell ip -4 route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if($$i=="src") print $$(i+1)}')
USER_NAME="$(USER)"
TYPE=""
SSH_PORT=2222

include $(ENV_MK)
export

all:
	@$(MAKE) leader

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
	@$(MAKE) setup_worker TYPE="leader"
	ssh -tt -p$(SSH_PORT) "$(USER)@localhost" "cd /home/$(USER)/infra && make"
	ssh -tt -p$(SSH_PORT) "$(USER)@localhost" "/bin/bash"

worker:
	@$(MAKE) setup_worker TYPE="worker"
	ssh -tt -p$(SSH_PORT) "$(USER)@localhost" "/bin/bash"

vm_erase:


$(ENV_MK): env

env: $(ENV_FILE)
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
	
.PHONY: all vm setup_worker leader worker vm_erase env

