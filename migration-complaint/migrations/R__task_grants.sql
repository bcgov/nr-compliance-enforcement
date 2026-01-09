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


-- Grant privileges to complaint role for RLS policy evaluation
-- The complaint role needs USAGE on shared schema and SELECT on app_user table
-- to perform joins in RLS policies (column level grants don't work with joins)
GRANT USAGE ON SCHEMA shared TO complaint;
GRANT SELECT ON TABLE shared.app_user TO complaint;

-- Grant privileges to complaint_outcome role for RLS policy evaluation
GRANT USAGE ON SCHEMA complaint TO complaint_outcome;
GRANT SELECT ON TABLE complaint.complaint TO complaint_outcome;
GRANT SELECT ON TABLE complaint.complaint_referral TO complaint_outcome;
GRANT SELECT ON TABLE complaint.app_user_complaint_xref TO complaint_outcome;
GRANT USAGE ON SCHEMA shared TO complaint_outcome;
GRANT SELECT ON TABLE shared.app_user TO complaint_outcome;
