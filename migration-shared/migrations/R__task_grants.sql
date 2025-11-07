---------------------
-- Runs the grants on the shared schemas with every migration
--
-- The last line of the comment is where the magic happens, it will refresh the date -
-- even if no changes are made.
--
-- Last Run on: ${flyway:timestamp}
----------------------

-- Grant privileges to objects
GRANT USAGE ON SCHEMA shared TO shared;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA shared TO shared;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA shared TO shared;
ALTER DEFAULT PRIVILEGES IN SCHEMA shared GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO shared;
ALTER DEFAULT PRIVILEGES IN SCHEMA shared GRANT USAGE, SELECT ON SEQUENCES TO shared;

-- Grant privileges to metabase_readonly if the user exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'metabase_readonly') THEN
    
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'shared') THEN
      GRANT USAGE ON SCHEMA shared TO metabase_readonly;
      GRANT SELECT ON ALL TABLES IN SCHEMA shared TO metabase_readonly;
      GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA shared TO metabase_readonly;
      ALTER DEFAULT PRIVILEGES IN SCHEMA shared GRANT SELECT ON TABLES TO metabase_readonly;
      ALTER DEFAULT PRIVILEGES IN SCHEMA shared GRANT USAGE, SELECT ON SEQUENCES TO metabase_readonly;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'investigation') THEN
      GRANT USAGE ON SCHEMA investigation TO metabase_readonly;
      GRANT SELECT ON ALL TABLES IN SCHEMA investigation TO metabase_readonly;
      GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA investigation TO metabase_readonly;
      ALTER DEFAULT PRIVILEGES IN SCHEMA investigation GRANT SELECT ON TABLES TO metabase_readonly;
      ALTER DEFAULT PRIVILEGES IN SCHEMA investigation GRANT USAGE, SELECT ON SEQUENCES TO metabase_readonly;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'inspection') THEN
      GRANT USAGE ON SCHEMA inspection TO metabase_readonly;
      GRANT SELECT ON ALL TABLES IN SCHEMA inspection TO metabase_readonly;
      GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA inspection TO metabase_readonly;
      ALTER DEFAULT PRIVILEGES IN SCHEMA inspection GRANT SELECT ON TABLES TO metabase_readonly;
      ALTER DEFAULT PRIVILEGES IN SCHEMA inspection GRANT USAGE, SELECT ON SEQUENCES TO metabase_readonly;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'complaint') THEN
      GRANT USAGE ON SCHEMA complaint TO metabase_readonly;
      GRANT SELECT ON ALL TABLES IN SCHEMA complaint TO metabase_readonly;
      GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA complaint TO metabase_readonly;
      ALTER DEFAULT PRIVILEGES IN SCHEMA complaint GRANT SELECT ON TABLES TO metabase_readonly;
      ALTER DEFAULT PRIVILEGES IN SCHEMA complaint GRANT USAGE, SELECT ON SEQUENCES TO metabase_readonly;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'complaint_outcome') THEN
      GRANT USAGE ON SCHEMA complaint_outcome TO metabase_readonly;
      GRANT SELECT ON ALL TABLES IN SCHEMA complaint_outcome TO metabase_readonly;
      GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA complaint_outcome TO metabase_readonly;
      ALTER DEFAULT PRIVILEGES IN SCHEMA complaint_outcome GRANT SELECT ON TABLES TO metabase_readonly;
      ALTER DEFAULT PRIVILEGES IN SCHEMA complaint_outcome GRANT USAGE, SELECT ON SEQUENCES TO metabase_readonly;
    END IF;

  END IF;
END $$;
