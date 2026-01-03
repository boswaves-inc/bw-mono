-- role
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'smtp') THEN
    CREATE ROLE smtp LOGIN PASSWORD '${PG_SMTP_PASSWORD}';
  END IF;
END $$;

-- database
SELECT 'CREATE DATABASE smtp OWNER smtp'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'smtp') \gexec