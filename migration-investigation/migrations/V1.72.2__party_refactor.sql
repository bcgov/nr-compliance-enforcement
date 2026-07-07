-- Office fields for addresses

ALTER TABLE investigation_address
ADD COLUMN display_in_investigation_ind boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN investigation_address.display_in_investigation_ind IS 'A boolean indicator of whether the office should be displayed in the investigation.';


-- Add fields for business contacts

ALTER TABLE investigation_business_person_xref
ADD COLUMN display_in_investigation_ind boolean NOT NULL DEFAULT true;

ALTER TABLE investigation_business_person_xref
ADD COLUMN title_role character varying(256);

ALTER TABLE investigation_business_person_xref
ADD COLUMN is_primary boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN investigation_business_person_xref.display_in_investigation_ind IS 'A boolean indicator of whether the business contact should be displayed in the investigation.';

COMMENT ON COLUMN investigation_business_person_xref.title_role IS 'The free-text title or role of the contact person within the business (e.g. Site Manager, Owner).';

COMMENT ON COLUMN investigation_business_person_xref.is_primary IS 'A boolean indicator of whether this contact is the primary contact for the business.';


-- Business contact to office xref

CREATE TABLE
  investigation_business_person_address_xref (
    investigation_business_person_address_xref_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    investigation_business_person_xref_guid uuid NOT NULL,
    investigation_address_guid uuid NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now (),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT investigation_business_person_address_xref_pk PRIMARY KEY (investigation_business_person_address_xref_guid),
    CONSTRAINT investigation_business_person_address_xref_bp_xref_fk
      FOREIGN KEY (investigation_business_person_xref_guid)
      REFERENCES investigation_business_person_xref (investigation_business_person_xref_guid),
    CONSTRAINT investigation_business_person_address_xref_address_fk
      FOREIGN KEY (investigation_address_guid)
      REFERENCES investigation_address (investigation_address_guid)
  );

COMMENT ON TABLE investigation_business_person_address_xref IS 'Associates an investigation business contact with their office (investigation_address).';

COMMENT ON COLUMN investigation_business_person_address_xref.investigation_business_person_address_xref_guid IS 'The system-generated unique identifier for the contact to office association record.';

COMMENT ON COLUMN investigation_business_person_address_xref.investigation_business_person_xref_guid IS 'The unique identifier of the business contact.';

COMMENT ON COLUMN investigation_business_person_address_xref.investigation_address_guid IS 'The unique identifier of the office (investigation_address.';

COMMENT ON COLUMN investigation_business_person_address_xref.active_ind IS 'A boolean indicator to determine if the association is active.';

COMMENT ON COLUMN investigation_business_person_address_xref.create_user_id IS 'The id of the user that created the association.';

COMMENT ON COLUMN investigation_business_person_address_xref.create_utc_timestamp IS 'The timestamp when the association was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN investigation_business_person_address_xref.update_user_id IS 'The id of the user that updated the association.';

COMMENT ON COLUMN investigation_business_person_address_xref.update_utc_timestamp IS 'The timestamp when the association was updated. The timestamp is stored in UTC with no Offset.';

CREATE TABLE
  investigation_business_person_address_xref_h (
    h_investigation_business_person_address_xref_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

COMMENT ON TABLE investigation_business_person_address_xref_h IS 'Stores the audit history for contact to office association records.';

COMMENT ON COLUMN investigation_business_person_address_xref_h.h_investigation_business_person_address_xref_guid IS 'The system-generated unique identifier for the association history record.';

COMMENT ON COLUMN investigation_business_person_address_xref_h.target_row_id IS 'The unique identifier of the association record affected by the operation.';

COMMENT ON COLUMN investigation_business_person_address_xref_h.operation_type IS 'The type of database operation executed on the association record. For example I = Insert, U = Update, D = Delete.';

COMMENT ON COLUMN investigation_business_person_address_xref_h.operation_user_id IS 'The id of the user that executed the operation.';

COMMENT ON COLUMN investigation_business_person_address_xref_h.operation_executed_at IS 'The timestamp when the operation was executed. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN investigation_business_person_address_xref_h.data_after_executed_operation IS 'A JSON representation of the association record after the operation was executed.';

ALTER TABLE investigation_business_person_address_xref_h
ADD CONSTRAINT pk_h_investigation_business_person_address_xref
PRIMARY KEY (h_investigation_business_person_address_xref_guid);

CREATE TRIGGER investigation_business_person_address_xref_history_trigger
BEFORE INSERT OR DELETE OR UPDATE
ON investigation_business_person_address_xref
FOR EACH ROW
EXECUTE FUNCTION audit_history (
  'investigation_business_person_address_xref_h',
  'investigation_business_person_address_xref_guid'
);

CREATE UNIQUE INDEX investigation_business_person_address_xref_active_unique
ON investigation_business_person_address_xref (investigation_business_person_xref_guid, investigation_address_guid)
WHERE active_ind = true;


-- Allow parties without names and add placeholder name/number

ALTER TABLE investigation_person
ALTER COLUMN first_name DROP NOT NULL;

ALTER TABLE investigation_person
ALTER COLUMN last_name DROP NOT NULL;

ALTER TABLE investigation_party
ADD COLUMN placeholder_name character varying(128);

ALTER TABLE investigation_party
ADD COLUMN placeholder_number integer;

COMMENT ON COLUMN investigation_party.placeholder_name IS 'A persisted display name for a party that has no real name yet, generated from the role and ordinal (e.g. Witness 3).';

COMMENT ON COLUMN investigation_party.placeholder_number IS 'The monotonic ordinal assigned to a nameless party within its investigation and role. Null for named parties. Never reused (party removal is a soft delete).';


-- Update relationships for contact methods to a party or office

ALTER TABLE investigation_contact_method
ALTER COLUMN investigation_party_guid DROP NOT NULL;

ALTER TABLE investigation_contact_method
ADD COLUMN investigation_address_guid uuid;

ALTER TABLE investigation_contact_method
ADD CONSTRAINT investigation_contact_method_address_fk
  FOREIGN KEY (investigation_address_guid)
  REFERENCES investigation_address (investigation_address_guid);

ALTER TABLE investigation_contact_method
ADD CONSTRAINT investigation_contact_method_parent_chk
CHECK (num_nonnulls (investigation_party_guid, investigation_address_guid) = 1);

COMMENT ON COLUMN investigation_contact_method.investigation_party_guid IS 'The unique identifier of the party associated with the contact method. Only one of investigation_party_guid or investigation_address_guid is allowed.';

COMMENT ON COLUMN investigation_contact_method.investigation_address_guid IS 'The unique identifier of the office (investigation_address) associated with the contact method. Only one of investigation_party_guid or investigation_address_guid is allowed.';
