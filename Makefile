-include .env
export

# === Infrastructure ===
infra/up:
	docker compose -f infra/compose.yaml up -d

infra/down:
	docker compose -f infra/compose.yaml down

infra/rm:
	docker compose -f infra/compose.yaml down -v

# === SMTP ===
smtp/dev:
	pnpm run dev:smtp

smtp/build:
	pnpm run build:smtp

smtp/up:
	docker compose -f services/smtp/compose.dev.yaml up -d

smtp/down:
	docker compose -f services/smtp/compose.dev.yaml down

smtp/rm:
	docker compose -f services/smtp/compose.dev.yaml down -v

# === Webstore ===
webstore/dev:
	pnpm run dev:webstore

webstore/build:
	pnpm run build:webstore

webstore/up:
	docker compose -f services/webstore/compose.dev.yaml up -d

webstore/down:
	docker compose -f services/webstore/compose.dev.yaml down

webstore/rm:
	docker compose -f services/webstore/compose.dev.yaml down -v

# === All ===
dev:
	pnpm run dev

build:
	pnpm run build

up:
	$(MAKE) infra/up
	$(MAKE) smtp/up
	$(MAKE) webstore/up

down:
	$(MAKE) smtp/down
	$(MAKE) webstore/down
	$(MAKE) infra/down

rm:
	$(MAKE) smtp/rm
	$(MAKE) webstore/rm
	$(MAKE) infra/rm