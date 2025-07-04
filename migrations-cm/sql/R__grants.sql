---------------------
-- Runs the grants on the case management and shared schemas with every migration
--
-- The last line of the comment is where the magic happens, it will refresh the date -
-- even if no changes are made.
--
-- Last Run on: ${flyway:timestamp}
----------------------

-- Grant privileges to case management objects
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA case_management TO case_management;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA case_management TO case_management;

-- Grant privileges to shared schema objects
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA shared TO proxy_js_shared;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA shared TO proxy_js_shared;

-- Grant future privileges to case management objects
ALTER DEFAULT PRIVILEGES IN SCHEMA case_management GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO case_management;
ALTER DEFAULT PRIVILEGES IN SCHEMA case_management GRANT USAGE, SELECT ON SEQUENCES TO case_management;

-- Grant future privileges to shared schema objects
ALTER DEFAULT PRIVILEGES IN SCHEMA shared GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO proxy_js_shared;
ALTER DEFAULT PRIVILEGES IN SCHEMA shared GRANT USAGE, SELECT ON SEQUENCES TO proxy_js_shared;