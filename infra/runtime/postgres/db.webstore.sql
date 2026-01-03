-- role
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'webstore') THEN
    CREATE ROLE webstore LOGIN PASSWORD '${PG_WEBSTORE_PASSWORD}';
  END IF;
END $$;

-- database
SELECT 'CREATE DATABASE webstore OWNER webstore'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'webstore') \gexec