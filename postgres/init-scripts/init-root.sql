-- init-root.sql

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_catalog.pg_roles WHERE rolname = 'root'
  ) THEN
    CREATE ROLE root WITH LOGIN SUPERUSER PASSWORD 'root_password';
    RAISE NOTICE '🔐 Usuario root creado.';
  ELSE
    RAISE NOTICE 'ℹ️ Usuario root ya existe, se omite.';
  END IF;
END
$$;


