FROM postgres:16
# FROM timescale/timescaledb:latest-pg16

# Install pg_cron using apk (Alpine package manager)
# RUN apk update && apk add --no-cache  postgresql-pg_cron

# Copy the schema file
# COPY ./initdb /docker-entrypoint-initdb.d/

# Copy the configuration files
COPY ./postgresql.conf /etc/postgresql.conf
COPY ./pg_hba.conf /etc/postgresql/pg_hba.conf



CMD ["postgres", "-c", "config_file=/etc/postgresql.conf"]