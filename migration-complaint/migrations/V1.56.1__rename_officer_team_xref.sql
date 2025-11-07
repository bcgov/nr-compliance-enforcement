ALTER TABLE officer_team_xref
RENAME TO app_user_team_xref;

ALTER TABLE officer_team_xref_h
RENAME TO app_user_team_xref_h;

ALTER TABLE app_user_team_xref
RENAME COLUMN officer_team_xref_guid TO app_user_team_xref_guid;

ALTER TABLE app_user_team_xref_h
RENAME COLUMN h_officer_team_xref_guid TO h_app_user_team_xref_guid;

ALTER TABLE app_user_team_xref RENAME CONSTRAINT officer_team_xref_pk TO app_user_team_xref_pk;

ALTER TABLE app_user_team_xref_h RENAME CONSTRAINT "PK_h_officer_team_xref" TO "PK_h_app_user_team_xref";

ALTER TABLE app_user_team_xref RENAME CONSTRAINT officer_team_xref_team_fk TO app_user_team_xref_team_fk;

COMMENT ON TABLE app_user_team_xref IS 'Defines the teams a user may be on';

COMMENT ON COLUMN app_user_team_xref.app_user_team_xref_guid IS 'System generated unique key for a user team cross-reference. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN app_user_team_xref.app_user_guid_ref IS 'System generated unique key for a user. References the user table in the shared schema.';

COMMENT ON COLUMN app_user_team_xref.team_guid IS 'System generated unique key for a team.';

COMMENT ON COLUMN app_user_team_xref.active_ind IS 'Indicates if the user is currently active on the team.';

COMMENT ON COLUMN app_user_team_xref.create_user_id IS 'The id of the user that created this record.';

COMMENT ON COLUMN app_user_team_xref.create_utc_timestamp IS 'The timestamp when this record was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN app_user_team_xref.update_user_id IS 'The id of the user that updated this record.';

COMMENT ON COLUMN app_user_team_xref.update_utc_timestamp IS 'The timestamp when this record was updated. The timestamp is stored in UTC with no Offset.';

COMMENT ON TABLE app_user_team_xref_h IS 'History table for app_user_team_xref table';

COMMENT ON COLUMN app_user_team_xref_h.h_app_user_team_xref_guid IS 'System generated unique key for user team cross-reference history. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN app_user_team_xref_h.target_row_id IS 'The unique key for the user team cross-reference that has been created or modified.';

COMMENT ON COLUMN app_user_team_xref_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT ON COLUMN app_user_team_xref_h.operation_user_id IS 'The id of the user that created or modified the data in the app_user_team_xref table. Defaults to the logged in user if not passed in by the application.';

COMMENT ON COLUMN app_user_team_xref_h.operation_executed_at IS 'The timestamp when the data in the app_user_team_xref table was created or modified. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN app_user_team_xref_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully. This implies that the latest row in the audit table will always match with the current row in the live table.';

CREATE TRIGGER app_user_team_xref_history_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON app_user_team_xref FOR EACH ROW EXECUTE FUNCTION audit_history ('app_user_team_xref_h', 'app_user_team_xref_guid');

ALTER INDEX idx_officer_team_xref_app_user_guid_ref
RENAME TO idx_app_user_team_xref_app_user_guid_ref;