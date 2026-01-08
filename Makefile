-include .env
export

# === Gen ===
gen/smtp:
	pnpm turbo gen:sdk --filter=@boswaves-inc/smtp

# === Dev ===
dev/smtp:
	pnpm turbo dev --filter=@boswaves-inc/smtp

dev/webstore:
	pnpm turbo dev --filter=@boswaves-inc/webstore-*...

dev:
	pnpm turbo dev

# === Build ===
build/smtp:
	pnpm turbo build --filter=@boswaves-inc/smtp*...

build/webstore:
	pnpm turbo build --filter=@boswaves-inc/webstore-*...

build:
	pnpm turbo build

# === Up ===
up/infra:
	docker compose -f infra/compose.yaml up -d

up/smtp:
	docker compose -f services/smtp/compose.dev.yaml up -d

up/webstore:
	docker compose -f services/webstore/compose.dev.yaml up -d

up:
	$(MAKE) up/infra
	$(MAKE) up/smtp
	$(MAKE) up/webstore

# === Down ===
down/infra:
	docker compose -f infra/compose.yaml down

down/smtp:
	docker compose -f services/smtp/compose.dev.yaml down

down/webstore:
	docker compose -f services/webstore/compose.dev.yaml down

down:
	$(MAKE) down/smtp
	$(MAKE) down/webstore
	$(MAKE) down/infra

# === Remove ===
rm/infra:
	docker compose -f infra/compose.yaml down -v

rm/smtp:
	docker compose -f services/smtp/compose.dev.yaml down -v

rm/webstore:
	docker compose -f services/webstore/compose.dev.yaml down -v

rm:
	$(MAKE) rm/smtp
	$(MAKE) rm/webstore
	$(MAKE) rm/infra

# === Help ===
help:
	@echo Available targets:
	@echo.
	@echo   gen/smtp        - Generate SMTP SDK
	@echo.
	@echo   dev/smtp        - Dev SMTP
	@echo   dev/webstore    - Dev Store
	@echo   dev             - Dev all
	@echo.
	@echo   build/smtp      - Build SMTP packages
	@echo   build/webstore  - Build Store packages
	@echo   build           - Build all
	@echo.
	@echo   up/infra        - Start infra containers
	@echo   up/smtp         - Start SMTP containers
	@echo   up/webstore     - Start Store containers
	@echo   up              - Start all containers
	@echo.
	@echo   down/infra      - Stop infra containers
	@echo   down/smtp       - Stop SMTP containers
	@echo   down/webstore   - Stop Store containers
	@echo   down            - Stop all containers
	@echo.
	@echo   rm/infra        - Remove infra containers and volumes
	@echo   rm/smtp         - Remove SMTP containers and volumes
	@echo   rm/webstore     - Remove Store containers and volumes
	@echo   rm              - Remove all containers and volumes