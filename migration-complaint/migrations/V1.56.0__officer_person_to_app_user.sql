CREATE TABLE
  app_user (
    app_user_guid uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    auth_user_guid uuid,
    user_id character varying(32),
    first_name character varying(32),
    last_name character varying(32),
    coms_enrolled_ind boolean DEFAULT false,
    deactivate_ind boolean DEFAULT false,
    agency_code_ref character varying(6),
    office_guid uuid,
    park_area_guid uuid,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL,
    source_officer_guid uuid,
    source_person_guid uuid
  );

COMMENT ON TABLE app_user IS 'A unified user table combining officers (identified via IDIR) and persons (other individuals tracked in the system). This table consolidates the former officer and person tables.';

COMMENT ON COLUMN app_user.app_user_guid IS 'System generated unique key for a user. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN app_user.first_name IS 'The first name of the user.';

COMMENT ON COLUMN app_user.last_name IS 'The last name of the user.';

COMMENT ON COLUMN app_user.user_id IS 'The IDIR ID issued to the user by the Government of British Columbia as part of their employment. Null for non-officers.';

COMMENT ON COLUMN app_user.office_guid IS 'System generated unique key for an office. The primary office a user is assigned to. Applicable for officers only.';

COMMENT ON COLUMN app_user.auth_user_guid IS 'The SiteMinder guid returned to the application from KeyCloak. Used to uniquely identify a user over the course of their lifecycle.';

COMMENT ON COLUMN app_user.coms_enrolled_ind IS 'A boolean indicator representing if a user is enrolled in COMS. Applicable for officers only.';

COMMENT ON COLUMN app_user.deactivate_ind IS 'A boolean indicator representing if a user has been deactivated.';

COMMENT ON COLUMN app_user.agency_code_ref IS 'Key representing an agency stored in the agency_code table of the shared schema. The agency that employs the user.';

COMMENT ON COLUMN app_user.park_area_guid IS 'System generated unique key for a park area associated with the user.';

COMMENT ON COLUMN app_user.source_officer_guid IS 'Temporary column: The original officer_guid this user was migrated from. Will be removed after migration is complete.';

COMMENT ON COLUMN app_user.source_person_guid IS 'Temporary column: The original person_guid this user was migrated from. Will be removed after migration is complete.';

COMMENT ON COLUMN app_user.create_user_id IS 'The id of the user that created this user record.';

COMMENT ON COLUMN app_user.create_utc_timestamp IS 'The timestamp when this user record was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN app_user.update_user_id IS 'The id of the user that updated this user record.';

COMMENT ON COLUMN app_user.update_utc_timestamp IS 'The timestamp when this user record was updated. The timestamp is stored in UTC with no Offset.';

CREATE TABLE
  app_user_h (
    h_app_user_guid uuid DEFAULT uuid_generate_v4 () NOT NULL PRIMARY KEY,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

COMMENT ON TABLE app_user_h IS 'History table for user table';

COMMENT ON COLUMN app_user_h.h_app_user_guid IS 'System generated unique key for user history. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN app_user_h.target_row_id IS 'The unique key for the user that has been created or modified.';

COMMENT ON COLUMN app_user_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT ON COLUMN app_user_h.operation_user_id IS 'The id of the user that created or modified the data in the user table. Defaults to the logged in user if not passed in by the application.';

COMMENT ON COLUMN app_user_h.operation_executed_at IS 'The timestamp when the data in the user table was created or modified. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN app_user_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully. This implies that the latest row in the audit table will always match with the current row in the live table.';

CREATE TRIGGER app_user_history_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON app_user FOR EACH ROW EXECUTE FUNCTION audit_history ('app_user_h', 'app_user_guid');

CREATE INDEX idx_user_source_officer_guid ON app_user (source_officer_guid)
WHERE
  source_officer_guid IS NOT NULL;

CREATE INDEX idx_user_source_person_guid ON app_user (source_person_guid)
WHERE
  source_person_guid IS NOT NULL;

INSERT INTO
  app_user (
    app_user_guid,
    first_name,
    last_name,
    user_id,
    office_guid,
    auth_user_guid,
    coms_enrolled_ind,
    deactivate_ind,
    agency_code_ref,
    park_area_guid,
    source_officer_guid,
    source_person_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  uuid_generate_v4 () AS app_user_guid,
  p.first_name,
  p.last_name,
  o.user_id,
  o.office_guid,
  o.auth_user_guid,
  o.coms_enrolled_ind,
  o.deactivate_ind,
  o.agency_code_ref,
  o.park_area_guid,
  o.officer_guid AS source_officer_guid,
  o.person_guid AS source_person_guid,
  o.create_user_id AS create_user_id,
  o.create_utc_timestamp AS create_utc_timestamp,
  o.update_user_id AS update_user_id,
  o.update_utc_timestamp AS update_utc_timestamp
FROM
  officer o
  LEFT JOIN person p ON o.person_guid = p.person_guid;

ALTER TABLE complaint_referral
ADD COLUMN app_user_guid_ref uuid;

COMMENT ON COLUMN complaint_referral.app_user_guid_ref IS 'System generated unique key for a user. References the user table in the shared schema.';

ALTER TABLE linked_complaint_xref
ADD COLUMN app_user_guid_ref uuid;

COMMENT ON COLUMN linked_complaint_xref.app_user_guid_ref IS 'System generated unique key for a user. References the user table in the shared schema.';

ALTER TABLE officer_team_xref
ADD COLUMN app_user_guid_ref uuid;

COMMENT ON COLUMN officer_team_xref.app_user_guid_ref IS 'System generated unique key for a user. References the user table in the shared schema.';

ALTER TABLE person_complaint_xref
ADD COLUMN app_user_guid_ref uuid;

COMMENT ON COLUMN person_complaint_xref.app_user_guid_ref IS 'System generated unique key for a user. References the user table in the shared schema.';

CREATE INDEX idx_complaint_referral_app_user_guid_ref ON complaint_referral (app_user_guid_ref);

CREATE INDEX idx_linked_complaint_xref_app_user_guid_ref ON linked_complaint_xref (app_user_guid_ref);

CREATE INDEX idx_officer_team_xref_app_user_guid_ref ON officer_team_xref (app_user_guid_ref);

CREATE INDEX idx_person_complaint_xref_app_user_guid_ref ON person_complaint_xref (app_user_guid_ref);

UPDATE complaint_referral cr
SET
  app_user_guid_ref = u.app_user_guid
FROM
  app_user u
WHERE
  cr.officer_guid = u.source_officer_guid;

UPDATE linked_complaint_xref lcx
SET
  app_user_guid_ref = u.app_user_guid
FROM
  app_user u
WHERE
  lcx.person_guid = u.source_person_guid;

UPDATE officer_team_xref otx
SET
  app_user_guid_ref = u.app_user_guid
FROM
  app_user u
WHERE
  otx.officer_guid = u.source_officer_guid;

UPDATE person_complaint_xref pcx
SET
  app_user_guid_ref = u.app_user_guid
FROM
  app_user u
WHERE
  pcx.person_guid = u.source_person_guid;