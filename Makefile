-include .env
export

# === Gen ===
gen/smtp:
	pnpm run gen --filter=@boswaves-inc/smtp-*...


# === Dev ===
dev/smtp:
	pnpm turbo dev --filter=@boswaves-inc/smtp-*...

dev/webstore:
	pnpm turbo dev --filter=@boswaves-inc/webstore-*...

dev:
	pnpm turbo dev

# === Build ===
build/smtp:
	pnpm turbo build --filter=@boswaves-inc/smtp-*...

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
	@grep -E '^[a-zA-Z_/]+:.*' Makefile | sort