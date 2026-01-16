# justfile
set dotenv-load
set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

runtime := "infra/runtime"
modules := "infra/modules"

# === Helpers ===
[private]
[unix]
init-svc service:
    mkdir -p {{runtime}}/node/targets
    mkdir -p {{runtime}}/telem/dashboards/{{service}}
    cp {{runtime}}/{{service}}/targets.yml {{runtime}}/node/targets/{{service}}.yml 2>/dev/null || true
    cp {{runtime}}/{{service}}/dashboards/* {{runtime}}/telem/dashboards/{{service}}/ 2>/dev/null || true

[private]
[windows]
init-svc service:
    New-Item -ItemType Directory -Path {{runtime}}/node/targets -Force | Out-Null
    New-Item -ItemType Directory -Path {{runtime}}/telem/dashboards/{{service}} -Force | Out-Null
    if (Test-Path {{runtime}}/{{service}}/targets.yml) { Copy-Item {{runtime}}/{{service}}/targets.yml {{runtime}}/node/targets/{{service}}.yml }
    if (Test-Path {{runtime}}/{{service}}/dashboards) { Copy-Item {{runtime}}/{{service}}/dashboards/* {{runtime}}/telem/dashboards/{{service}}/ }

[private]
[unix]
rm-svc service:
    rm -f {{runtime}}/node/targets/{{service}}.yml
    rm -rf {{runtime}}/telem/dashboards/{{service}}

[private]
[windows]
rm-svc service:
    if (Test-Path {{runtime}}/node/targets/{{service}}.yml) { Remove-Item {{runtime}}/node/targets/{{service}}.yml }
    if (Test-Path {{runtime}}/telem/dashboards/{{service}}) { Remove-Item {{runtime}}/telem/dashboards/{{service}} -Recurse }

# # === Gen ===
# gen-smtp:
#     pnpm turbo gen:sdk --filter=@boswaves-inc/smtp

# # === Dev ===
# dev-smtp:
#     pnpm turbo dev --filter=@boswaves-inc/smtp

# dev-webstore:
#     pnpm turbo dev --filter=@boswaves-inc/webstore-*...

# dev:
#     pnpm turbo dev

# === Build ===
build-smtp:
    pnpm turbo build --filter=@boswaves-inc/smtp*...

build-store:
    pnpm turbo build --filter=@boswaves-inc/store*...

build:
    pnpm turbo build

# === Up ===
up-telem project="boswaves_telem": (init-svc "telem")
    docker compose -p {{project}} -f {{modules}}/node.yaml -f {{modules}}/telem.yaml up -d --build

up-smtp project="boswaves_smtp": (init-svc "smtp")
    docker compose -p {{project}} -f {{modules}}/node.yaml -f services/smtp/compose.yaml up -d --build

up-store project="boswaves_smtp": (init-svc "store")
    docker compose -p {{project}} -f {{modules}}/node.yaml -f services/store/compose.yaml up -d --build

up-dev project="boswaves_dev":  (init-svc "smtp") (init-svc "store")
    docker compose -p {{project}} -f {{modules}}/node.yaml -f {{modules}}/telem.yaml -f {{modules}}/dev.yaml up -d


# up project="boswaves": (up-nats project) (up-postgres project) (up-smtp project) (up-store project)

# # === Down ===
# down-grafana project="boswaves":
#     docker compose -p {{project}} -f {{modules}}/grafana.yaml down

# down-nats project="boswaves": (down-telem "nats")
#     docker compose -p {{project}} -f {{modules}}/nats.yaml down

# down-postgres project="boswaves": (down-telem "postgres")
#     docker compose -p {{project}} -f {{modules}}/postgres.yaml down

# down-smtp project="boswaves": (down-telem "smtp")
#     docker compose -p {{project}} -f services/smtp/compose.yaml down

# down-webstore project="boswaves":
#     docker compose -p {{project}} -f services/webstore/compose.yaml down

# down project="boswaves": (down-smtp project) (down-webstore project) (down-nats project) (down-postgres project) (down-grafana project)

# # === Remove ===
# rm-grafana project="boswaves":
#     docker compose -p {{project}} -f {{modules}}/grafana.yaml down -v

# rm-nats project="boswaves": (down-telem "nats")
#     docker compose -p {{project}} -f {{modules}}/nats.yaml down -v

# rm-postgres project="boswaves": (down-telem "postgres")
#     docker compose -p {{project}} -f {{modules}}/postgres.yaml down -v

# rm-smtp project="boswaves": (down-telem "smtp")
#     docker compose -p {{project}} -f services/smtp/compose.yaml down -v

# rm-webstore project="boswaves":
#     docker compose -p {{project}} -f services/webstore/compose.yaml down -v

# rm project="boswaves": (rm-smtp project) (rm-webstore project) (rm-nats project) (rm-postgres project) (rm-grafana project)

# === Help ===
help:
    @just --list