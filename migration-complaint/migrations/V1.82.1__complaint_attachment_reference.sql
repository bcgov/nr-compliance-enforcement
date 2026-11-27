CREATE TABLE
  complaint_attachment_reference (
    complaint_attachment_reference_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    complaint_identifier character varying(20) NOT NULL,
    chefs_file_guid_ref uuid NOT NULL,
    filename_text character varying(1024) NOT NULL,
    file_size integer NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now (),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT complaint_attachment_reference_pk PRIMARY KEY (complaint_attachment_reference_guid),
    CONSTRAINT complaint_attachment_reference_complaint_fk
      FOREIGN KEY (complaint_identifier)
      REFERENCES complaint (complaint_identifier)
  );

COMMENT ON TABLE complaint_attachment_reference IS 'Contains a file uploaded on a public CHEFS form.  The file stays in CHEFS storage and is shown on the complaint the submission became.  active_ind is set to false when a user deletes or replaces the file in NatSuite';

COMMENT ON COLUMN complaint_attachment_reference.complaint_attachment_reference_guid IS 'The system-generated unique identifier for the attachment reference record.';

COMMENT ON COLUMN complaint_attachment_reference.complaint_identifier IS 'The identifier of the complaint the attachment is shown on.';

COMMENT ON COLUMN complaint_attachment_reference.chefs_file_guid_ref IS 'The unique identifier of the attachment from CHEFS.';

COMMENT ON COLUMN complaint_attachment_reference.filename_text IS 'The filename of the attachment as uploaded to CHEFS.';

COMMENT ON COLUMN complaint_attachment_reference.file_size IS 'The size of the attachment in bytes.';

COMMENT ON COLUMN complaint_attachment_reference.active_ind IS 'A boolean indicator to determine if the attachment reference is active.';

COMMENT ON COLUMN complaint_attachment_reference.create_user_id IS 'The id of the user that created the attachment reference.';

COMMENT ON COLUMN complaint_attachment_reference.create_utc_timestamp IS 'The timestamp when the attachment reference was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN complaint_attachment_reference.update_user_id IS 'The id of the user that updated the attachment reference.';

COMMENT ON COLUMN complaint_attachment_reference.update_utc_timestamp IS 'The timestamp when the attachment reference was updated. The timestamp is stored in UTC with no Offset.';

CREATE TABLE
  complaint_attachment_reference_h (
    h_complaint_attachment_reference_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

COMMENT ON TABLE complaint_attachment_reference_h IS 'Stores the audit history for attachment reference records.';

COMMENT ON COLUMN complaint_attachment_reference_h.h_complaint_attachment_reference_guid IS 'The system-generated unique identifier for the attachment reference history record.';

COMMENT ON COLUMN complaint_attachment_reference_h.target_row_id IS 'The unique identifier of the attachment reference record affected by the operation.';

COMMENT ON COLUMN complaint_attachment_reference_h.operation_type IS 'The type of database operation executed on the attachment reference record. For example I = Insert, U = Update, D = Delete.';

COMMENT ON COLUMN complaint_attachment_reference_h.operation_user_id IS 'The id of the user that executed the operation.';

COMMENT ON COLUMN complaint_attachment_reference_h.operation_executed_at IS 'The timestamp when the operation was executed. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN complaint_attachment_reference_h.data_after_executed_operation IS 'A JSON representation of the attachment reference record after the operation was executed.';

CREATE TRIGGER complaint_attachment_reference_history_trigger
BEFORE INSERT OR DELETE OR UPDATE
ON complaint_attachment_reference
FOR EACH ROW
EXECUTE FUNCTION audit_history (
  'complaint_attachment_reference_h',
  'complaint_attachment_reference_guid'
);

CREATE INDEX IF NOT EXISTS idx_complaint_attachment_reference_complaint_identifier
  ON complaint_attachment_reference (complaint_identifier);
