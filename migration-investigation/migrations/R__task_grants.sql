---------------------
-- Runs the grants on the investigation schemas with every migration
--
-- The last line of the comment is where the magic happens, it will refresh the date -
-- even if no changes are made.
--
-- Last Run on: ${flyway:timestamp}
----------------------

-- Grant privileges to objects
GRANT USAGE ON SCHEMA investigation TO investigation;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA investigation TO investigation;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA investigation TO investigation;
ALTER DEFAULT PRIVILEGES IN SCHEMA investigation GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO investigation;
ALTER DEFAULT PRIVILEGES IN SCHEMA investigation GRANT USAGE, SELECT ON SEQUENCES TO investigation;
