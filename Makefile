-include .env
export

dev/smtp:
	pnpm run dev:smtp

dev/webstore:
	pnpm run dev:webstore

build/smtp:
	pnpm run build:smtp

build/webstore:
	pnpm run build:webstore

up/infra:
	docker compose -f infra/compose.yaml up -d

up/smtp:
	docker compose -f services/smtp/compose.dev.yaml up -d

up/webstore:
	docker compose -f services/webstore/compose.dev.yaml up -d
