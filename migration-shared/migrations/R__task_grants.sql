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
