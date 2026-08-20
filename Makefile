#SWARM_STATUS := $(shell docker info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null)
SCRIPT_NAME:=Vm-Makefile
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

install_deps:
	@echo "[INFO][$(SCRIPT_NAME)] Installing site dependencies..."
	@cd site && rm -rf dist && rm -rf node_modules && rm -rf package-lock.json && npm install --package-lock-only
	@echo "[INFO][$(SCRIPT_NAME)] Installing backend dependencies..."
	@cd backend && rm -rf dist && rm -rf node_modules && rm -rf package-lock.json && npm install --package-lock-only

setup_worker:
	@ssh-keygen -f "/home/$(USER)/.ssh/known_hosts" -R "[localhost]:2222"
	@if [ ! -f $(VM_SCRIPTS)/node.sh ]; then \
		echo "[ERROR][$(SCRIPT_NAME)] node.sh file missing"; \
		exit 1; \
	fi
	@chmod +x $(VM_SCRIPTS)/node.sh
	@bash $(VM_SCRIPTS)/node.sh $(TYPE) $(IP4)

leader: install_deps
	@$(MAKE) setup_worker TYPE="leader"
	ssh -tt -p$(SSH_PORT) "$(USER)@localhost" "cd /home/$(USER)/infra && make && /bin/bash"

worker:
	@$(MAKE) setup_worker TYPE="worker"
	ssh -tt -p$(SSH_PORT) "$(USER)@localhost" "/bin/bash"

$(ENV_MK): $(ENV_FILE)
	@if [ ! -f "$(TOOLS_SCRIPTS)"/create_env.sh ] || [ ! -f "$(TOOLS_SCRIPTS)"/check_env.sh ]; then \
	    echo "[ERROR][$(SCRIPT_NAME)] Missing env handlers"; \
	    exit 1; \
	fi
	@chmod +x "$(TOOLS_SCRIPTS)/check_env.sh"
	@bash "$(TOOLS_SCRIPTS)/check_env.sh" $(ENV_FILE)
	@chmod +x "$(TOOLS_SCRIPTS)/create_env.sh"
	@bash "$(TOOLS_SCRIPTS)/create_env.sh" $(ENV_FILE) > $(ENV_MK)

$(ENV_FILE):
	@if [ -f $(TEMPLATE) ]; then \
		echo "[INFO][$(SCRIPT_NAME)] Creating $(ENV_FILE) file, please set all variables"; \
		cp $(TEMPLATE) $(ENV_FILE); \
		vim -c 'set shortmess+=I' $(ENV_FILE); \
	else \
		echo "[ERROR][$(SCRIPT_NAME)] Template_env file missing, you will need to create $(ENV_FILE) file yourself.\n See READ_ME for how to do it"; \
		exit 1; \
	fi
	
.PHONY: all vm install_deps setup_worker leader worker vm_erase
