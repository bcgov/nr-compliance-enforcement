-- Office fields for addresses

ALTER TABLE address
ADD COLUMN display_in_investigation_ind boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN address.display_in_investigation_ind IS 'A boolean indicator of whether the office should be displayed in the investigation.';


-- Add fields for business contacts

ALTER TABLE business_person_xref
ADD COLUMN display_in_investigation_ind boolean NOT NULL DEFAULT true;

ALTER TABLE business_person_xref
ADD COLUMN title_role character varying(256);

ALTER TABLE business_person_xref
ADD COLUMN is_primary boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN business_person_xref.display_in_investigation_ind IS 'A boolean indicator of whether the business contact should be displayed in the investigation.';

COMMENT ON COLUMN business_person_xref.title_role IS 'The free-text title or role of the contact person within the business (e.g. Site Manager, Owner).';

COMMENT ON COLUMN business_person_xref.is_primary IS 'A boolean indicator of whether this contact is the primary contact for the business.';


-- Business contact to office xref

CREATE TABLE
  business_person_address_xref (
    business_person_address_xref_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    business_person_xref_guid uuid NOT NULL,
    address_guid uuid NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now (),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT business_person_address_xref_pk PRIMARY KEY (business_person_address_xref_guid),
    CONSTRAINT business_person_address_xref_business_person_xref_fk
      FOREIGN KEY (business_person_xref_guid)
      REFERENCES business_person_xref (business_person_xref_guid),
    CONSTRAINT business_person_address_xref_address_fk
      FOREIGN KEY (address_guid)
      REFERENCES address (address_guid)
  );

COMMENT ON TABLE business_person_address_xref IS 'Associates a business contact with their office (address).';

COMMENT ON COLUMN business_person_address_xref.business_person_address_xref_guid IS 'The system-generated unique identifier for the contact to office association record.';

COMMENT ON COLUMN business_person_address_xref.business_person_xref_guid IS 'The unique identifier of the business contact.';

COMMENT ON COLUMN business_person_address_xref.address_guid IS 'The unique identifier of the office (address).';

COMMENT ON COLUMN business_person_address_xref.active_ind IS 'A boolean indicator to determine if the association is active.';

COMMENT ON COLUMN business_person_address_xref.create_user_id IS 'The id of the user that created the association.';

COMMENT ON COLUMN business_person_address_xref.create_utc_timestamp IS 'The timestamp when the association was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN business_person_address_xref.update_user_id IS 'The id of the user that updated the association.';

COMMENT ON COLUMN business_person_address_xref.update_utc_timestamp IS 'The timestamp when the association was updated. The timestamp is stored in UTC with no Offset.';

CREATE TABLE
  business_person_address_xref_h (
    h_business_person_address_xref_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

COMMENT ON TABLE business_person_address_xref_h IS 'Stores the audit history for contact to office association records.';

COMMENT ON COLUMN business_person_address_xref_h.h_business_person_address_xref_guid IS 'The system-generated unique identifier for the association history record.';

COMMENT ON COLUMN business_person_address_xref_h.target_row_id IS 'The unique identifier of the association record affected by the operation.';

COMMENT ON COLUMN business_person_address_xref_h.operation_type IS 'The type of database operation executed on the association record. For example I = Insert, U = Update, D = Delete.';

COMMENT ON COLUMN business_person_address_xref_h.operation_user_id IS 'The id of the user that executed the operation.';

COMMENT ON COLUMN business_person_address_xref_h.operation_executed_at IS 'The timestamp when the operation was executed. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN business_person_address_xref_h.data_after_executed_operation IS 'A JSON representation of the association record after the operation was executed.';

ALTER TABLE business_person_address_xref_h
ADD CONSTRAINT pk_h_business_person_address_xref
PRIMARY KEY (h_business_person_address_xref_guid);

CREATE TRIGGER business_person_address_xref_history_trigger
BEFORE INSERT OR DELETE OR UPDATE
ON business_person_address_xref
FOR EACH ROW
EXECUTE FUNCTION audit_history (
  'business_person_address_xref_h',
  'business_person_address_xref_guid'
);

CREATE UNIQUE INDEX business_person_address_xref_active_unique
ON business_person_address_xref (business_person_xref_guid, address_guid)
WHERE active_ind = true;


-- Update relationships for contact methods to a party or office

ALTER TABLE contact_method
ALTER COLUMN party_guid DROP NOT NULL;

ALTER TABLE contact_method
ADD COLUMN address_guid uuid;

ALTER TABLE contact_method
ADD CONSTRAINT contact_method_address_fk
  FOREIGN KEY (address_guid)
  REFERENCES address (address_guid);

ALTER TABLE contact_method
ADD CONSTRAINT contact_method_parent_chk
CHECK (num_nonnulls (party_guid, address_guid) = 1);

COMMENT ON COLUMN contact_method.party_guid IS 'The unique identifier of the party associated with the contact method. Only one of party_guid or address_guid is allowed.';

COMMENT ON COLUMN contact_method.address_guid IS 'The unique identifier of the office (address) associated with the contact method. Only one of party_guid or address_guid is allowed.';
