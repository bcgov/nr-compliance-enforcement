-- Add missing business contacts on investigation schema

CREATE TABLE
  investigation_business_person_xref (
    investigation_business_person_xref_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    investigation_business_guid uuid NOT NULL,
    investigation_person_guid uuid NOT NULL,
    business_person_xref_code_ref character varying(16) NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now (),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT investigation_business_person_xref_pk PRIMARY KEY (investigation_business_person_xref_guid),
    CONSTRAINT investigation_business_person_xref_business_fk
      FOREIGN KEY (investigation_business_guid)
      REFERENCES investigation_business (investigation_business_guid),
    CONSTRAINT investigation_business_person_xref_person_fk
      FOREIGN KEY (investigation_person_guid)
      REFERENCES investigation_person (investigation_person_guid)
  );

COMMENT ON TABLE investigation_business_person_xref IS 'Associates a person to an investigation business and defines the nature of the relationship between them.';

COMMENT ON COLUMN investigation_business_person_xref.investigation_business_person_xref_guid IS 'The system-generated unique identifier for the business to person relationship record.';

COMMENT ON COLUMN investigation_business_person_xref.investigation_business_guid IS 'The unique identifier of the investigation business participating in the relationship.';

COMMENT ON COLUMN investigation_business_person_xref.investigation_person_guid IS 'The unique identifier of the investigation person participating in the relationship.';

COMMENT ON COLUMN investigation_business_person_xref.business_person_xref_code_ref IS 'Un-enforced FK to shared.business_person_xref_code. A human readable code that identifies the type of relationship between the business and the person.';

COMMENT ON COLUMN investigation_business_person_xref.active_ind IS 'A boolean indicator to determine if the business to person relationship is active.';

COMMENT ON COLUMN investigation_business_person_xref.create_user_id IS 'The id of the user that created the business to person relationship.';

COMMENT ON COLUMN investigation_business_person_xref.create_utc_timestamp IS 'The timestamp when the business to person relationship was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN investigation_business_person_xref.update_user_id IS 'The id of the user that updated the business to person relationship.';

COMMENT ON COLUMN investigation_business_person_xref.update_utc_timestamp IS 'The timestamp when the business to person relationship was updated. The timestamp is stored in UTC with no Offset.';

CREATE TABLE
  investigation_business_person_xref_h (
    h_investigation_business_person_xref_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

COMMENT ON TABLE investigation_business_person_xref_h IS 'Stores the audit history for business to person relationship records.';

COMMENT ON COLUMN investigation_business_person_xref_h.h_investigation_business_person_xref_guid IS 'The system-generated unique identifier for the business to person relationship history record.';

COMMENT ON COLUMN investigation_business_person_xref_h.target_row_id IS 'The unique identifier of the business to person relationship record affected by the operation.';

COMMENT ON COLUMN investigation_business_person_xref_h.operation_type IS 'The type of database operation executed on the business to person relationship record. For example I = Insert, U = Update, D = Delete.';

COMMENT ON COLUMN investigation_business_person_xref_h.operation_user_id IS 'The id of the user that executed the operation.';

COMMENT ON COLUMN investigation_business_person_xref_h.operation_executed_at IS 'The timestamp when the operation was executed. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN investigation_business_person_xref_h.data_after_executed_operation IS 'A JSON representation of the business to person relationship record after the operation was executed.';

ALTER TABLE investigation_business_person_xref_h
ADD CONSTRAINT pk_h_investigation_business_person_xref
PRIMARY KEY (h_investigation_business_person_xref_guid);

CREATE TRIGGER investigation_business_person_xref_history_trigger
BEFORE INSERT OR DELETE OR UPDATE
ON investigation_business_person_xref
FOR EACH ROW
EXECUTE FUNCTION audit_history (
  'investigation_business_person_xref_h',
  'investigation_business_person_xref_guid'
);
