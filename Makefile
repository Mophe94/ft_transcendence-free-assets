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
	printf "$(CYAN)You are in branch : $$branch$(RESET)\n"; \
	\
	while true; do \
		printf "Do you want push in this branch ? (y/n)\n"; \
		read msg; \
		if [ "$$msg" = "n" ] || [ "$$msg" = "no" ]; then \
			printf "$(RED)❌ Operation aborded !$(RESET)\n"; \
			exit 0; \
		elif [ "$$msg" = "yes" ] || [ "$$msg" = "y" ]; then \
			break; \
		else \
			printf "$(YELLOW)Invalid instruction$(RESET)\n"; \
		fi; \
	done; \
	\
	git rev-parse --is-inside-work-tree > /dev/null 2>&1 || { \
		printf "❌ Not a git repository"; \
		exit 0; \
	}; \
	\
	printf "$(CYAN)🔄 Verification if in last version$(RESET)\n"; \
	git fetch origin; \
	\
	LOCAL=$$(git rev-parse $$branch); \
	REMOTE=$$(git rev-parse origin/$$branch); \
	\
	if [ "$$LOCAL" != "$$REMOTE" ]; then \
		printf "$(YELLOW)Your repo isn't the most recent, please pull the newest$(RESET)\n"; \
		printf "$(RED)❌ Operation aborded !$(RESET)\n"; \
		exit 0; \
	else \
		printf "$(CYAN)✅ Branch already up to update$(RESET)\n"; \
	fi; \
	\
	git add .; \
	\
	if git diff --quiet && git diff --cached --quiet; then \
		printf "$(YELLOW)Nothing to commit$(RESET)\n"; \
		exit 0; \
	fi; \
	\
	while true; do \
		printf "$(CYAN)Please enter your commentary for commit :$(RESET)\n"; \
		read msg; \
		if [ "$$msg" != "" ]; then \
			git commit -m "$$msg"; \
			break; \
		else \
			printf "$(YELLOW)Empty sentence isn't accepted$(RESET)\n"; \
		fi; \
	done; \
	git push; \
	printf "$(GREEN)🚀 Pushing finish !$(RESET)\n"

.PHONY: all push