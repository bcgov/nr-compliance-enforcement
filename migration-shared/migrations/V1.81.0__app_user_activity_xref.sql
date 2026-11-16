CREATE TABLE app_user_activity_xref_code (
    app_user_activity_xref_code character varying(16) NOT NULL,
    short_description character varying(64) NOT NULL,
    long_description character varying(256),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT app_user_activity_xref_code_pk
      PRIMARY KEY (app_user_activity_xref_code)
);

COMMENT ON TABLE shared.app_user_activity_xref_code IS 'Contains the list of user to activity associations. For example COLLABORAT = Collaborator';
COMMENT ON COLUMN shared.app_user_activity_xref_code.app_user_activity_xref_code IS 'A human readable code used to identify a user to activity association type.';
COMMENT ON COLUMN shared.app_user_activity_xref_code.short_description IS 'The short description of the user to activity association type.';
COMMENT ON COLUMN shared.app_user_activity_xref_code.long_description IS 'The long description of the user to activity association type.';
COMMENT ON COLUMN shared.app_user_activity_xref_code.display_order IS 'The order in which the values of the user to activity association type should be displayed when presented to a user in a list.';
COMMENT ON COLUMN shared.app_user_activity_xref_code.active_ind IS 'A boolean indicator to determine if a user to activity association type is active.';
COMMENT ON COLUMN shared.app_user_activity_xref_code.create_user_id IS 'The id of the user that created the user to activity association type.';
COMMENT ON COLUMN shared.app_user_activity_xref_code.create_utc_timestamp IS 'The timestamp when the user to activity association type was created. The timestamp is stored in UTC with no Offset.';
COMMENT ON COLUMN shared.app_user_activity_xref_code.update_user_id IS 'The id of the user that updated the user to activity association type.';
COMMENT ON COLUMN shared.app_user_activity_xref_code.update_utc_timestamp IS 'The timestamp when the user to activity association type was updated. The timestamp is stored in UTC with no Offset.';


CREATE TABLE app_user_activity_xref (
    app_user_activity_xref_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    app_user_guid uuid NOT NULL,
    activity_type character varying(10) NOT NULL,
    activity_identifier_ref character varying(50) NOT NULL,
    app_user_activity_xref_code character varying(16) NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT app_user_activity_xref_pk
      PRIMARY KEY (app_user_activity_xref_guid),
    CONSTRAINT app_user_activity_xref_app_user_fk
      FOREIGN KEY (app_user_guid)
      REFERENCES app_user (app_user_guid),
    CONSTRAINT app_user_activity_xref_activity_type_fk
      FOREIGN KEY (activity_type)
      REFERENCES case_activity_type_code (case_activity_type_code),
    CONSTRAINT app_user_activity_xref_code_fk
      FOREIGN KEY (app_user_activity_xref_code)
      REFERENCES app_user_activity_xref_code (app_user_activity_xref_code)
);

COMMENT ON TABLE app_user_activity_xref IS 'Associates a user to a case activity and defines the nature of the relationship between them.';
COMMENT ON COLUMN app_user_activity_xref.app_user_activity_xref_guid IS 'The system-generated unique identifier for the user to activity relationship record.';
COMMENT ON COLUMN app_user_activity_xref.app_user_guid IS 'The unique identifier of the user participating in the relationship.';
COMMENT ON COLUMN app_user_activity_xref.activity_type IS 'Foreign Key: Human readable code representing a case activity.';
COMMENT ON COLUMN app_user_activity_xref.activity_identifier_ref IS 'Business key representing a case activity stored in another system or schema. For example an investigation: investigation.investigation.investigation_guid, or an inspection: inspection.inspection.inspection_guid';
COMMENT ON COLUMN app_user_activity_xref.app_user_activity_xref_code IS 'A human readable code that identifies the type of relationship between the user and the activity.';
COMMENT ON COLUMN app_user_activity_xref.active_ind IS 'A boolean indicator to determine if the user to activity relationship is active.';
COMMENT ON COLUMN app_user_activity_xref.create_user_id IS 'The id of the user that created the user to activity relationship.';
COMMENT ON COLUMN app_user_activity_xref.create_utc_timestamp IS 'The timestamp when the user to activity relationship was created. The timestamp is stored in UTC with no Offset.';
COMMENT ON COLUMN app_user_activity_xref.update_user_id IS 'The id of the user that updated the user to activity relationship.';
COMMENT ON COLUMN app_user_activity_xref.update_utc_timestamp IS 'The timestamp when the user to activity relationship was updated. The timestamp is stored in UTC with no Offset.';

CREATE TABLE app_user_activity_xref_h (
    h_app_user_activity_xref_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
);

ALTER TABLE app_user_activity_xref_h
ADD CONSTRAINT pk_h_app_user_activity_xref
PRIMARY KEY (h_app_user_activity_xref_guid);

CREATE TRIGGER app_user_activity_xref_history_trigger
BEFORE INSERT OR DELETE OR UPDATE
ON app_user_activity_xref
FOR EACH ROW
EXECUTE FUNCTION audit_history (
  'app_user_activity_xref_h',
  'app_user_activity_xref_guid'
);

COMMENT ON TABLE app_user_activity_xref_h IS 'Stores the audit history for user to activity relationship records.';
COMMENT ON COLUMN app_user_activity_xref_h.h_app_user_activity_xref_guid IS 'The system-generated unique identifier for the user to activity relationship history record.';
COMMENT ON COLUMN app_user_activity_xref_h.target_row_id IS 'The unique identifier of the user to activity relationship record affected by the operation.';
COMMENT ON COLUMN app_user_activity_xref_h.operation_type IS 'The type of database operation executed on the user to activity relationship record. For example I = Insert, U = Update, D = Delete.';
COMMENT ON COLUMN app_user_activity_xref_h.operation_user_id IS 'The id of the user that executed the operation.';
COMMENT ON COLUMN app_user_activity_xref_h.operation_executed_at IS 'The timestamp when the operation was executed. The timestamp is stored in UTC with no Offset.';
COMMENT ON COLUMN app_user_activity_xref_h.data_after_executed_operation IS 'A JSON representation of the user to activity relationship record after the operation was executed.';

CREATE UNIQUE INDEX app_user_activity_xref_collaborat_active_unique
ON app_user_activity_xref (activity_type, activity_identifier_ref, app_user_guid)
WHERE active_ind = true AND app_user_activity_xref_code = 'COLLABORAT';

CREATE UNIQUE INDEX app_user_activity_xref_assignee_active_unique
ON app_user_activity_xref (activity_type, activity_identifier_ref)
WHERE active_ind = true AND app_user_activity_xref_code = 'ASSIGNEE';

CREATE UNIQUE INDEX app_user_activity_xref_supervisor_active_unique
ON app_user_activity_xref (activity_type, activity_identifier_ref)
WHERE active_ind = true AND app_user_activity_xref_code = 'SUPERVISOR';

CREATE UNIQUE INDEX app_user_activity_xref_filecoord_active_unique
ON app_user_activity_xref (activity_type, activity_identifier_ref)
WHERE active_ind = true AND app_user_activity_xref_code = 'FILECOORD';

CREATE INDEX idx_app_user_activity_xref_activity_identifier_ref
ON app_user_activity_xref (activity_identifier_ref)
WHERE active_ind = true;

CREATE INDEX idx_app_user_activity_xref_app_user_guid
ON app_user_activity_xref (app_user_guid)
WHERE active_ind = true;
