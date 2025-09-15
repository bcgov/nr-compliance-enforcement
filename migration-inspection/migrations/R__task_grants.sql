---------------------
-- Runs the grants on the inspection schemas with every migration
--
-- The last line of the comment is where the magic happens, it will refresh the date -
-- even if no changes are made.
--
-- Last Run on: ${flyway:timestamp}
----------------------

-- Grant privileges to objects
GRANT USAGE ON SCHEMA inspection TO inspection;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA inspection TO inspection;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA inspection TO inspection;
ALTER DEFAULT PRIVILEGES IN SCHEMA inspection GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO inspection;
ALTER DEFAULT PRIVILEGES IN SCHEMA inspection GRANT USAGE, SELECT ON SEQUENCES TO inspection;
