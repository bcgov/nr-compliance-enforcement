ALTER TABLE person_complaint_xref
RENAME TO app_user_complaint_xref;

ALTER TABLE person_complaint_xref_h
RENAME TO app_user_complaint_xref_h;

ALTER TABLE person_complaint_xref_code
RENAME TO app_user_complaint_xref_code;

ALTER TABLE app_user_complaint_xref
RENAME COLUMN person_complaint_xref_guid TO app_user_complaint_xref_guid;

ALTER TABLE app_user_complaint_xref
RENAME COLUMN person_complaint_xref_code TO app_user_complaint_xref_code;

ALTER TABLE app_user_complaint_xref_h
RENAME COLUMN h_person_complaint_xref_guid TO h_app_user_complaint_xref_guid;

ALTER TABLE app_user_complaint_xref_code
RENAME COLUMN person_complaint_xref_code TO app_user_complaint_xref_code;

ALTER TABLE app_user_complaint_xref RENAME CONSTRAINT "PK_person_complaint_xref_guid" TO "PK_app_user_complaint_xref_guid";

COMMENT ON TABLE app_user_complaint_xref IS 'Links app users to complaints with a specific relationship type (assignee, collaborator, suspect, etc.)';

COMMENT ON COLUMN app_user_complaint_xref.app_user_complaint_xref_guid IS 'System generated unique key for the app user complaint cross-reference.';

COMMENT ON COLUMN app_user_complaint_xref.app_user_complaint_xref_code IS 'The type of relationship between the app user and complaint (ASSIGNEE, COLLABORATOR, SUSPECT, etc.)';

COMMENT ON TABLE app_user_complaint_xref_h IS 'History table for app_user_complaint_xref';

COMMENT ON COLUMN app_user_complaint_xref_h.h_app_user_complaint_xref_guid IS 'System generated unique key for app user complaint cross-reference history.';

COMMENT ON TABLE app_user_complaint_xref_code IS 'Code table defining the types of relationships between app users and complaints';

COMMENT ON COLUMN app_user_complaint_xref_code.app_user_complaint_xref_code IS 'Code identifying the type of app user-complaint relationship (ASSIGNEE, COLLABORATOR, SUSPECT, etc.)';

DROP TRIGGER IF EXISTS person_complaint_xref_trigger ON app_user_complaint_xref;

CREATE TRIGGER app_user_complaint_xref_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON app_user_complaint_xref FOR EACH ROW EXECUTE FUNCTION audit_history (
  'app_user_complaint_xref_h',
  'app_user_complaint_xref_guid'
);

ALTER INDEX IF EXISTS "IDX_person_complaint_xref_person_guid"
RENAME TO "IDX_app_user_complaint_xref_app_user_guid";

ALTER INDEX IF EXISTS "IDX_person_complaint_xref_complaint_identifier"
RENAME TO "IDX_app_user_complaint_xref_complaint_identifier";