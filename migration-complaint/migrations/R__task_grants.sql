---------------------
-- Runs the grants on the complaint schemas with every migration
--
-- The last line of the comment is where the magic happens, it will refresh the date -
-- even if no changes are made.
--
-- Last Run on: ${flyway:timestamp}
----------------------

-- Grant privileges to objects
GRANT USAGE ON SCHEMA complaint TO complaint;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA complaint TO complaint;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA complaint TO complaint;
ALTER DEFAULT PRIVILEGES IN SCHEMA complaint GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO complaint;
ALTER DEFAULT PRIVILEGES IN SCHEMA complaint GRANT USAGE, SELECT ON SEQUENCES TO complaint;
