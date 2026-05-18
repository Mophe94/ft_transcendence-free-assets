NAME = transcendence

#--------------------------- COLORS ---------------------------

export RESET  := \033[0m
export GREEN  := \033[1;32m
export YELLOW := \033[1;33m
export RED    := \033[1;31m
export CYAN   := \033[1;36m

#--------------------------- COMMAND ---------------------------

push:
	@branch=$$(git branch --show-current); \
	printf "$(CYAN)Current branch : $$branch$(RESET)\n"; \
	\
	while true; do \
		printf "Do you want to push to this branch ? (y/n)\n"; \
		read msg; \
		if [ "$$msg" = "n" ] || [ "$$msg" = "no" ]; then \
			printf "$(RED)❌ Push cancelled !$(RESET)\n"; \
			exit 0; \
		elif [ "$$msg" = "yes" ] || [ "$$msg" = "y" ]; then \
			break; \
		else \
			printf "$(YELLOW)Invalid instruction$(RESET)\n"; \
		fi; \
	done; \
	\
	git rev-parse --is-inside-work-tree > /dev/null 2>&1 || { \
		printf "❌ Not a Git repository."; \
		exit 0; \
	}; \
	\
	printf "$(CYAN)🔄 Checking if repository is up to date...$(RESET)\n"; \
	git fetch origin; \
	\
	LOCAL=$$(git rev-parse $$branch); \
	REMOTE=$$(git rev-parse origin/$$branch); \
	\
	if [ "$$LOCAL" != "$$REMOTE" ]; then \
		printf "$(YELLOW)Repository is not up to date. Please pull first.$(RESET)\n"; \
		printf "$(RED)❌ Push cancelled !$(RESET)\n"; \
		exit 0; \
	else \
		printf "$(CYAN)✅ Branch already up to date$(RESET)\n"; \
	fi; \
	\
	git add .; \
	\
	if git diff --quiet && git diff --cached --quiet; then \
		printf "$(YELLOW)Nothing to commit.$(RESET)\n"; \
		exit 0; \
	fi; \
	\
	while true; do \
		printf "$(CYAN)Please enter a commit message :$(RESET)\n"; \
		read msg; \
		if [ "$$msg" != "" ]; then \
			git commit -m "$$msg"; \
			break; \
		else \
			printf "$(YELLOW)Empty message is not allowed.$(RESET)\n"; \
		fi; \
	done; \
	git push; \
	printf "$(GREEN)Push completed successfully 🚀$(RESET)\n"

.PHONY: all push