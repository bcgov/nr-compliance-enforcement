CREATE TABLE investigation_party_external_id (
    investigation_party_external_id_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    investigation_party_guid uuid NOT NULL,
    party_external_id_code_ref character varying(16) NOT NULL,
    external_id_value character varying(64) NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    party_external_id_guid_ref uuid,
    CONSTRAINT investigation_party_external_id_pk
      PRIMARY KEY (investigation_party_external_id_guid),
    CONSTRAINT investigation_party_external_id_party_fk
      FOREIGN KEY (investigation_party_guid)
      REFERENCES investigation_party (investigation_party_guid)
);

COMMENT ON TABLE investigation_party_external_id IS 'Contains the external identifiers (e.g., fish and wildlife ID) captured against a party while working within an investigation. Values are promoted to the shared registry when the party is published.';

COMMENT ON COLUMN investigation_party_external_id.investigation_party_external_id_guid IS 'The system-generated unique identifier for the local party external identifier record.';

COMMENT ON COLUMN investigation_party_external_id.investigation_party_guid IS 'The unique identifier of the investigation party associated with the external identifier.';

COMMENT ON COLUMN investigation_party_external_id.party_external_id_code_ref IS 'Cross schema foreign key (unenforced) to shared.party_external_id_code. The type of external identifier recorded against the party.';

COMMENT ON COLUMN investigation_party_external_id.external_id_value IS 'The value of the identifier as issued by the external system.';

COMMENT ON COLUMN investigation_party_external_id.active_ind IS 'A boolean indicator to determine if the local party external identifier is active.';

COMMENT ON COLUMN investigation_party_external_id.create_user_id IS 'The id of the user that created the local party external identifier.';

COMMENT ON COLUMN investigation_party_external_id.create_utc_timestamp IS 'The timestamp when the local party external identifier was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN investigation_party_external_id.update_user_id IS 'The id of the user that updated the local party external identifier.';

COMMENT ON COLUMN investigation_party_external_id.update_utc_timestamp IS 'The timestamp when the local party external identifier was updated. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN investigation_party_external_id.party_external_id_guid_ref IS 'The shared party external identifier this local row is linked to once the party has been published. Null while the row exists only on the investigation.';

-- One identifier per external system per party, enforced while active.
CREATE UNIQUE INDEX uk_investigation_party_external_id_party_code
  ON investigation_party_external_id (investigation_party_guid, party_external_id_code_ref)
  WHERE active_ind = true;

CREATE INDEX idx_investigation_party_external_id_party
  ON investigation_party_external_id (investigation_party_guid);

-- History table capturing the after image of every data operation on the table.
CREATE TABLE investigation_party_external_id_h (
    h_investigation_party_external_id_guid uuid DEFAULT public.uuid_generate_v4 () NOT NULL PRIMARY KEY,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);

COMMENT ON TABLE investigation_party_external_id_h IS 'History table for investigation_party_external_id table.';

COMMENT ON COLUMN investigation_party_external_id_h.h_investigation_party_external_id_guid IS 'Primary key. System generated unique identifier for an investigation party external identifier history record.';

COMMENT ON COLUMN investigation_party_external_id_h.target_row_id IS 'The unique key for the investigation party external identifier that has been created or modified.';

COMMENT ON COLUMN investigation_party_external_id_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete.';

COMMENT ON COLUMN investigation_party_external_id_h.operation_user_id IS 'The id of the user that created or modified the data in the investigation party external identifier table. Defaults to the logged in user if not passed in by the application.';

COMMENT ON COLUMN investigation_party_external_id_h.operation_executed_at IS 'The timestamp when the data in the investigation party external identifier table was created or modified. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN investigation_party_external_id_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully. This implies that the latest row in the audit table will always match with the current row in the live table.';

CREATE TRIGGER investigation_party_external_id_history_trigger
BEFORE INSERT OR UPDATE OR DELETE ON investigation.investigation_party_external_id
FOR EACH ROW EXECUTE FUNCTION investigation.audit_history('investigation_party_external_id_h', 'investigation_party_external_id_guid');
