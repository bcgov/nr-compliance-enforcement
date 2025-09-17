---------------------
-- Runs the grants on the complaint outcome schemas with every migration
--
-- The last line of the comment is where the magic happens, it will refresh the date -
-- even if no changes are made.
--
-- Last Run on: ${flyway:timestamp}
----------------------

-- Grant privileges to objects
GRANT USAGE ON SCHEMA complaint_outcome TO complaint_outcome;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA complaint_outcome TO complaint_outcome;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA complaint_outcome TO complaint_outcome;
ALTER DEFAULT PRIVILEGES IN SCHEMA complaint_outcome GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO complaint_outcome;
ALTER DEFAULT PRIVILEGES IN SCHEMA complaint_outcome GRANT USAGE, SELECT ON SEQUENCES TO complaint_outcome;
