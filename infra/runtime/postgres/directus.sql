-- role
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'directus') THEN
    CREATE ROLE directus LOGIN PASSWORD '${PG_DIRECTUS_PASSWORD}';
  END IF;
END $$;

-- database
SELECT 'CREATE DATABASE directus OWNER directus'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'directus') \gexec