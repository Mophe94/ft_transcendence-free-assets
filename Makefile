# ---------------------------------------------------------------------------
# Script
# ---------------------------------------------------------------------------

SCRIPT_NAME := Vm-Makefile
LOCATION := $(shell pwd)

# ---------------------------------------------------------------------------
# Environment
# ---------------------------------------------------------------------------

ENV_NAME := env_vm
ENV_FILE := $(LOCATION)/.$(ENV_NAME)
ENV_MK := $(LOCATION)/.$(ENV_NAME).mk
TEMPLATE := template_$(ENV_NAME)

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

VM_SCRIPTS := $(LOCATION)/vm_management
TOOLS_SCRIPTS := $(LOCATION)/tools
LOGS_LOCATION := $(LOCATION)/logs

# ---------------------------------------------------------------------------
# VM Configuration
# ---------------------------------------------------------------------------

IP4 := $(shell ip -4 route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if($$i=="src") print $$(i+1)}')
USER_NAME := $(USER)
TYPE :=
SSH_PORT := 2222

# ---------------------------------------------------------------------------
# Environment variables
# ---------------------------------------------------------------------------

include $(ENV_MK)
export

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

all:
	@$(MAKE) leader

# ---------------------------------------------------------------------------
# VM management
# ---------------------------------------------------------------------------

vm:
	@if [ "$(USER)" != "stempels" ]; then \
		printf '\033[31m[ERROR]\033[0m[%s] %s\n' \
			"$(SCRIPT_NAME)" \
			"You are not supposed to use that"; \
		exit 1; \
	fi

	@if [ ! -f "$(VM_SCRIPTS)/vm.sh" ]; then \
		printf '\033[31m[ERROR]\033[0m[%s] %s\n' \
			"$(SCRIPT_NAME)" \
			"vm.sh file missing"; \
		exit 1; \
	fi

	@chmod +x "$(VM_SCRIPTS)/vm.sh"
	@bash "$(VM_SCRIPTS)/vm.sh"

# ---------------------------------------------------------------------------
# Dependency installation
# ---------------------------------------------------------------------------

install_deps:
	$(call LOG_INFO,Installing site dependencies)
	@cd site && \
		rm -rf dist node_modules package-lock.json && \
		npm install --package-lock-only

	$(call LOG_INFO,Installing backend dependencies)
	@cd backend && \
		rm -rf dist node_modules package-lock.json && \
		npm install --package-lock-only

# ---------------------------------------------------------------------------
# Node setup
# ---------------------------------------------------------------------------

setup_node:
	@mkdir -p "$(LOGS_LOCATION)"

	@ssh-keygen \
		-f "/home/$(USER)/.ssh/known_hosts" \
		-R "[localhost]:2222"

	@if [ ! -f "$(VM_SCRIPTS)/node.sh" ]; then \
		printf '\033[31m[ERROR]\033[0m[%s] %s\n' \
			"$(SCRIPT_NAME)" \
			"node.sh file missing"; \
		exit 1; \
	fi

	@chmod +x "$(VM_SCRIPTS)/node.sh"
	@bash "$(VM_SCRIPTS)/node.sh" "$(TYPE)" "$(IP4)"

# ---------------------------------------------------------------------------
# Leader
# ---------------------------------------------------------------------------

leader: install_deps
	@$(MAKE) setup_node TYPE="leader"
	@ssh -tt \
		-p$(SSH_PORT) \
		"$(USER)@localhost" \
		"cd /home/$(USER)/infra && make && /bin/bash"

# ---------------------------------------------------------------------------
# Worker
# ---------------------------------------------------------------------------

worker:
	@$(MAKE) setup_node TYPE="worker"
	@ssh -tt \
		-p$(SSH_PORT) \
		"$(USER)@localhost" \
		"/bin/bash"

# ---------------------------------------------------------------------------
# Environment makefile
# ---------------------------------------------------------------------------

$(ENV_MK): $(ENV_FILE)
	@if [ ! -f "$(TOOLS_SCRIPTS)/create_env.sh" ] || \
		[ ! -f "$(TOOLS_SCRIPTS)/check_env.sh" ]; then \
		printf '\033[31m[ERROR]\033[0m[%s] %s\n' \
			"$(SCRIPT_NAME)" \
			"Missing env handlers"; \
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
		mkdir -p "$(LOGS_LOCATION)"; \
		timestamp="$$(date '+%Y-%m-%d %H:%M:%S')"; \
		printf '\033[32m[INFO]\033[0m[%s] %s\n' \
			"$(SCRIPT_NAME)" \
			"Creating $(ENV_FILE) file, please set all variables"; \
		printf '[INFO][%s][%s] %s\n' \
			"$$timestamp" \
			"$(SCRIPT_NAME)" \
			"Creating $(ENV_FILE) file, please set all variables" \
			>> "$(LOG_FILE)"; \
		cp "$(TEMPLATE)" "$(ENV_FILE)"; \
		vim -c 'set shortmess+=I' "$(ENV_FILE)"; \
	else \
		mkdir -p "$(LOGS_LOCATION)"; \
		timestamp="$$(date '+%Y-%m-%d %H:%M:%S')"; \
		printf '\033[31m[ERROR]\033[0m[%s] %s\n' \
			"$(SCRIPT_NAME)" \
			"Template_env file missing, you will need to create $(ENV_FILE) file yourself. See READ_ME for how to do it"; \
		printf '[ERROR][%s][%s] %s\n' \
			"$$timestamp" \
			"$(SCRIPT_NAME)" \
			"Template_env file missing, you will need to create $(ENV_FILE) file yourself. See READ_ME for how to do it" \
			>> "$(LOG_FILE)"; \
		exit 1; \
	fi

# ---------------------------------------------------------------------------
# Cleanup
# ---------------------------------------------------------------------------

.PHONY: all \
	vm \
	install_deps \
	setup_node \
	leader \
	worker \
	vm_erase
