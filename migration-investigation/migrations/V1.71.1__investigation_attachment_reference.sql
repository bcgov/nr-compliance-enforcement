CREATE TABLE
  investigation_attachment_reference (
    investigation_attachment_reference_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    investigation_party_guid uuid NOT NULL,
    object_guid_ref uuid NOT NULL,
    s3_version_ref character varying(512) NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now (),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT investigation_attachment_reference_pk PRIMARY KEY (investigation_attachment_reference_guid),
    CONSTRAINT investigation_attachment_reference_investigation_party_fk
      FOREIGN KEY (investigation_party_guid)
      REFERENCES investigation_party (investigation_party_guid)
  );

COMMENT ON TABLE investigation_attachment_reference IS 'Contains S3Version references to COMS objects related to a shared.party (person or business) record.';

COMMENT ON COLUMN investigation_attachment_reference.investigation_attachment_reference_guid IS 'The system-generated unique identifier for the attachment reference record.';

COMMENT ON COLUMN investigation_attachment_reference.investigation_party_guid IS 'The unique identifier of the party (person or business) associated with the attachment reference.';

COMMENT ON COLUMN investigation_attachment_reference.object_guid_ref IS 'The unique identifier of the attachment from COMS.';

COMMENT ON COLUMN investigation_attachment_reference.s3_version_ref IS 'The S3 version of the attachment at the time the party was attached to the investigation.';

COMMENT ON COLUMN investigation_attachment_reference.active_ind IS 'A boolean indicator to determine if the attachment reference is active.';

COMMENT ON COLUMN investigation_attachment_reference.create_user_id IS 'The id of the user that created the attachment reference.';

COMMENT ON COLUMN investigation_attachment_reference.create_utc_timestamp IS 'The timestamp when the attachment reference was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN investigation_attachment_reference.update_user_id IS 'The id of the user that updated the attachment reference.';

COMMENT ON COLUMN investigation_attachment_reference.update_utc_timestamp IS 'The timestamp when the attachment reference was updated. The timestamp is stored in UTC with no Offset.';

CREATE TABLE
  investigation_attachment_reference_h (
    h_investigation_attachment_reference_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

COMMENT ON TABLE investigation_attachment_reference_h IS 'Stores the audit history for attachment reference records.';

COMMENT ON COLUMN investigation_attachment_reference_h.h_investigation_attachment_reference_guid IS 'The system-generated unique identifier for the attachment reference history record.';

COMMENT ON COLUMN investigation_attachment_reference_h.target_row_id IS 'The unique identifier of the attachment reference record affected by the operation.';

COMMENT ON COLUMN investigation_attachment_reference_h.operation_type IS 'The type of database operation executed on the attachment reference record. For example I = Insert, U = Update, D = Delete.';

COMMENT ON COLUMN investigation_attachment_reference_h.operation_user_id IS 'The id of the user that executed the operation.';

COMMENT ON COLUMN investigation_attachment_reference_h.operation_executed_at IS 'The timestamp when the operation was executed. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN investigation_attachment_reference_h.data_after_executed_operation IS 'A JSON representation of the attachment reference record after the operation was executed.';

CREATE TRIGGER investigation_attachment_reference_history_trigger
BEFORE INSERT OR DELETE OR UPDATE
ON investigation_attachment_reference
FOR EACH ROW
EXECUTE FUNCTION audit_history (
  'investigation_attachment_reference_h',
  'investigation_attachment_reference_guid'
);
