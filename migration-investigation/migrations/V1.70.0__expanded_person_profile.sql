-- Approximate age code

ALTER TABLE investigation_person
    ADD COLUMN approximate_age_code_ref character varying(16);

COMMENT ON COLUMN investigation_person.approximate_age_code_ref IS 'Unenforced FK to shared.approximate_age_code.  The approximate age category of the person, used when no date of birth is known.';

-- Replace sex with gender

ALTER TABLE investigation_person
    DROP COLUMN sex_code_ref;

ALTER TABLE investigation_person
    ADD COLUMN gender_code_ref character varying(16);


COMMENT ON COLUMN investigation_person.gender_code_ref IS 'Unenforced FK to shared.gender_code.  The gender category of the person.';

-- Add DL Class and Jurisdiction

ALTER TABLE investigation_person
    DROP COLUMN drivers_license_jurisdiction;

ALTER TABLE investigation_person
    ADD COLUMN drivers_license_class character varying(128);

COMMENT ON COLUMN investigation_person.drivers_license_class IS 'The class of the person''s driver''s licence.';

ALTER TABLE investigation_person
    ADD COLUMN drivers_license_country_code_ref character varying(4);

COMMENT ON COLUMN investigation_person.drivers_license_country_code_ref IS 'Unenforced FK to shared.country_code The country that issued the person''s driver''s licence.';

ALTER TABLE investigation_person
    ADD COLUMN drivers_license_country_subdivision_code_ref character varying(16);


COMMENT ON COLUMN investigation_person.drivers_license_country_subdivision_code_ref IS 'Unenforced FK to shared.country_code_ref.  The country subdivision (province, state, etc.) that issued the person''s driver''s licence.';

-- Convert Middle Name 1 and Middle Name 2 to Middle Names

ALTER TABLE investigation_person
    DROP COLUMN middle_name_2;

ALTER TABLE investigation_person
    RENAME COLUMN middle_name TO middle_names;

ALTER TABLE investigation_person
    ALTER COLUMN middle_names TYPE character varying(256);

COMMENT ON COLUMN investigation_person.middle_names IS 'The middle name(s) of the person.';

-- Enable Aliases for people.  This involves a refactor of the table to bring it up to the party level

DROP TRIGGER IF EXISTS investigation_alias_history_trigger ON investigation_alias;
DROP TABLE IF EXISTS investigation_alias;

CREATE TABLE
  investigation_alias (
    investigation_alias_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    investigation_party_guid uuid NOT NULL,
    name character varying(512) NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now (),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT investigation_alias_pk PRIMARY KEY (investigation_alias_guid),
    CONSTRAINT investigation_alias_investigation_party_fk
      FOREIGN KEY (investigation_party_guid)
      REFERENCES investigation_party (investigation_party_guid)
  );

COMMENT ON TABLE investigation_alias IS 'Contains alternative names or aliases associated with a party (person or business).';

COMMENT ON COLUMN investigation_alias.investigation_alias_guid IS 'The system-generated unique identifier for the alias record.';

COMMENT ON COLUMN investigation_alias.investigation_party_guid IS 'The unique identifier of the party (person or business) associated with the alias.';

COMMENT ON COLUMN investigation_alias.name IS 'The alias name used to identify or reference the party.';

COMMENT ON COLUMN investigation_alias.active_ind IS 'A boolean indicator to determine if the alias is active.';

COMMENT ON COLUMN investigation_alias.create_user_id IS 'The id of the user that created the alias.';

COMMENT ON COLUMN investigation_alias.create_utc_timestamp IS 'The timestamp when the alias was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN investigation_alias.update_user_id IS 'The id of the user that updated the alias.';

COMMENT ON COLUMN investigation_alias.update_utc_timestamp IS 'The timestamp when the alias was updated. The timestamp is stored in UTC with no Offset.';

CREATE TRIGGER investigation_alias_history_trigger
BEFORE INSERT OR DELETE OR UPDATE
ON investigation_alias
FOR EACH ROW
EXECUTE FUNCTION audit_history (
  'investigation_alias_h',
  'investigation_alias_guid'
);

-- Add addresses for people.   This involves a refactor of the business_address table to be generic.

DROP TRIGGER IF EXISTS investigation_business_address_history_trigger ON business_address;
DROP INDEX IF EXISTS investigation_business_address_primary_unique;
DROP TABLE IF EXISTS investigation_business_address;
DROP TABLE IF EXISTS investigation_business_address_h;

CREATE TABLE
  investigation_address (
    investigation_address_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    investigation_party_guid uuid NOT NULL,
    address_name character varying(128) NOT NULL,
    address character varying(120),
    city character varying(128),
    country_subdivision_code_ref character varying(16),
    postal_code character varying(16),
    country_code_ref character varying(4),
    is_primary boolean NOT NULL DEFAULT false,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now (),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT investigation_address_pk PRIMARY KEY (investigation_address_guid),
    CONSTRAINT investigation_address_party_fk
      FOREIGN KEY (investigation_party_guid)
      REFERENCES investigation_party (investigation_party_guid)
  );

COMMENT ON TABLE investigation_address IS 'Stores physical or mailing addresses associated with a party (person or business).';

COMMENT ON COLUMN investigation_address.investigation_address_guid IS 'The system-generated unique identifier for the address record.';

COMMENT ON COLUMN investigation_address.investigation_party_guid IS 'The unique identifier of the party (person or business) associated with the address.';

COMMENT ON COLUMN investigation_address.address_name IS 'A label for the address (e.g. Head office, Mailing address).';

COMMENT ON COLUMN investigation_address.address IS 'The street address.';

COMMENT ON COLUMN investigation_address.city IS 'The city of the address.';

COMMENT ON COLUMN investigation_address.country_subdivision_code_ref IS 'Unenforced FK to shared.country_subdivision_code.  The province or state of the address.';

COMMENT ON COLUMN investigation_address.postal_code IS 'The postal or ZIP code of the address.';

COMMENT ON COLUMN investigation_address.country_code_ref IS 'Unenforced FK to shared.country_code.  The country of the address.';

COMMENT ON COLUMN investigation_address.is_primary IS 'A boolean indicator of whether this is the primary address for the party.';

COMMENT ON COLUMN investigation_address.active_ind IS 'A boolean indicator to determine if the address is active.';

COMMENT ON COLUMN investigation_address.create_user_id IS 'The id of the user that created the address.';

COMMENT ON COLUMN investigation_address.create_utc_timestamp IS 'The timestamp when the address was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN investigation_address.update_user_id IS 'The id of the user that updated the address.';

COMMENT ON COLUMN investigation_address.update_utc_timestamp IS 'The timestamp when the address was updated. The timestamp is stored in UTC with no Offset.';

CREATE TABLE
  investigation_address_h (
    h_investigation_address_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

COMMENT ON TABLE investigation_address_h IS 'Stores the audit history for address records.';

COMMENT ON COLUMN investigation_address_h.h_investigation_address_guid IS 'The system-generated unique identifier for the address history record.';

COMMENT ON COLUMN investigation_address_h.target_row_id IS 'The unique identifier of the address record affected by the operation.';

COMMENT ON COLUMN investigation_address_h.operation_type IS 'The type of database operation executed on the address record. For example I = Insert, U = Update, D = Delete.';

COMMENT ON COLUMN investigation_address_h.operation_user_id IS 'The id of the user that executed the operation.';

COMMENT ON COLUMN investigation_address_h.operation_executed_at IS 'The timestamp when the operation was executed. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN investigation_address_h.data_after_executed_operation IS 'A JSON representation of the address record after the operation was executed.';


CREATE TRIGGER investigation_address_history_trigger
BEFORE INSERT OR DELETE OR UPDATE
ON investigation_address
FOR EACH ROW
EXECUTE FUNCTION audit_history (
  'investigation_address_h',
  'investigation_address_guid'
);

CREATE UNIQUE INDEX address_primary_unique
ON investigation_address (investigation_party_guid)
WHERE is_primary = true
AND active_ind = true;

-- Add email addresses for people.   This involves a refactor of the contact method table FKs

DROP TRIGGER IF EXISTS investigation_contact_method_history_trigger ON investigation_contact_method;
DROP TABLE IF EXISTS investigation_contact_method;

CREATE TABLE
  investigation_contact_method (
    investigation_contact_method_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    investigation_party_guid uuid NOT NULL,
    contact_method_type_code_ref character varying(10) NOT NULL,
    contact_value character varying(512) NOT NULL,
    is_primary boolean NOT NULL DEFAULT false,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now (),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT investigation_contact_method_pk PRIMARY KEY (investigation_contact_method_guid),
    CONSTRAINT investigation_contact_method_investigation_party_fk
      FOREIGN KEY (investigation_party_guid)
      REFERENCES investigation_party (investigation_party_guid)
  );

COMMENT ON TABLE investigation_contact_method IS 'Stores phone, email, and other contact methods associated with a party (person or business).';

COMMENT ON COLUMN investigation_contact_method.investigation_contact_method_guid IS 'The system-generated unique identifier for the contact method record.';

COMMENT ON COLUMN investigation_contact_method.investigation_party_guid IS 'The unique identifier of the party (person or business) associated with the contact method.';

COMMENT ON COLUMN investigation_contact_method.contact_method_type_code_ref IS 'Unenforced FK to shared.contact_method_type_code.  The type of contact method. References contact_method_type_code (e.g. PHONE, EMAIL).';

COMMENT ON COLUMN investigation_contact_method.contact_value IS 'The contact value itself (phone number, email address, etc.).';

COMMENT ON COLUMN investigation_contact_method.is_primary IS 'A boolean indicator of whether this is the primary contact method of its type for the party.';

COMMENT ON COLUMN investigation_contact_method.active_ind IS 'A boolean indicator to determine if the contact method is active.';

COMMENT ON COLUMN investigation_contact_method.create_user_id IS 'The id of the user that created the contact method.';

COMMENT ON COLUMN investigation_contact_method.create_utc_timestamp IS 'The timestamp when the contact method was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN investigation_contact_method.update_user_id IS 'The id of the user that updated the contact method.';

COMMENT ON COLUMN investigation_contact_method.update_utc_timestamp IS 'The timestamp when the contact method was updated. The timestamp is stored in UTC with no Offset.';

CREATE TRIGGER investigation_contact_method_history_trigger
BEFORE INSERT OR DELETE OR UPDATE
ON investigation_contact_method
FOR EACH ROW
EXECUTE FUNCTION audit_history (
  'investigation_contact_method_h',
  'investigation_contact_method_guid'
);

CREATE UNIQUE INDEX investigation_contact_method_primary_unique
ON investigation_contact_method (investigation_party_guid, contact_method_type_code_ref)
WHERE is_primary = true
AND active_ind = true;

-- Add height and weight for people.   Store only in metric and convert to imperial on front end 

ALTER TABLE investigation_person
    ADD COLUMN height_cm numeric(5,1),
    ADD COLUMN weight_kg numeric(5,1);

COMMENT ON COLUMN investigation_person.height_cm IS 'The person''s height in centimetres. Stored as the canonical metric value; the UI provides a ft/in display toggle that converts for entry and display only.';
COMMENT ON COLUMN investigation_person.weight_kg IS 'The person''s weight in kilograms. Stored as the canonical metric value; the UI provides a lb display toggle that converts for entry and display only.';

-- Add complexion for people.

ALTER TABLE investigation_person
    ADD COLUMN complexion_code_ref character varying(16);


COMMENT ON COLUMN investigation_person.complexion_code_ref IS 'Unenforced FK to shared.complexion_code.  The complexion of the person. References complexion_code.';

-- Add build for people

ALTER TABLE investigation_person
    ADD COLUMN build_code_ref character varying(16);

COMMENT ON COLUMN investigation_person.build_code_ref IS 'Unenforced FK to shared.build_code.  The build of the person. References build_code.';

-- Add hair colour for people

ALTER TABLE investigation_person
    ADD COLUMN hair_colour_code_ref character varying(16);

COMMENT ON COLUMN investigation_person.hair_colour_code_ref IS 'Unenforced FK to shared.hair_colour_code.  The hair colour of the person. References hair_colour_code.';

ALTER TABLE investigation_person
    ADD COLUMN hair_colour_other character varying(128);

COMMENT ON COLUMN investigation_person.hair_colour_other IS 'A free-text hair colour description, used when hair_colour_code is OTH (Other).';

-- Add hair length for people

ALTER TABLE investigation_person
    ADD COLUMN hair_length_code_ref character varying(16);

COMMENT ON COLUMN investigation_person.hair_length_code_ref IS 'Unenforced FK to shared.hair_length_code. The hair length of the person. References hair_length_code.';

-- Add eye colour for people

ALTER TABLE investigation_person
    ADD COLUMN eye_colour_code_ref character varying(16);

COMMENT ON COLUMN investigation_person.eye_colour_code_ref IS 'Unenforced FK to shared.eye_colour_code The eye colour of the person. References eye_colour_code.';

ALTER TABLE investigation_person
    ADD COLUMN eye_colour_other character varying(128);

COMMENT ON COLUMN investigation_person.eye_colour_other IS 'A free-text eye colour description, used when eye_colour_code is OTH (Other).';

-- Add Facial Hair to Person

ALTER TABLE investigation_person
    ADD COLUMN facial_hair_ind boolean;

COMMENT ON COLUMN investigation_person.facial_hair_ind IS 'Indicates whether the person has facial hair. true = has facial hair, false = does not have facial hair, null = unknown / not assessed.';

ALTER TABLE investigation_person
    ADD COLUMN additional_hair_descriptors character varying(512);

COMMENT ON COLUMN investigation_person.additional_hair_descriptors IS 'Free-text additional hair descriptors for the person.';

CREATE TABLE
  investigation_person_facial_hair_style_code_ref (
    investigation_person_facial_hair_style_code_ref_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    investigation_person_guid uuid NOT NULL,
    facial_hair_style_code_ref character varying(16) NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT NOW(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT investigation_person_facial_hair_style_code_ref_pk PRIMARY KEY (investigation_person_facial_hair_style_code_ref_guid),
    CONSTRAINT investigation_person_facial_hair_style_code_ref_investigation_person_fk
      FOREIGN KEY (investigation_person_guid)
      REFERENCES investigation_person (investigation_person_guid)
  );

COMMENT ON TABLE investigation_person_facial_hair_style_code_ref IS 'A junction table associating a person with their facial hair styles. A person may have multiple facial hair styles.';

COMMENT ON COLUMN investigation_person_facial_hair_style_code_ref.investigation_person_facial_hair_style_code_ref_guid IS 'A system generated unique identifier for the person facial hair style association.';
COMMENT ON COLUMN investigation_person_facial_hair_style_code_ref.investigation_person_guid IS 'The person the facial hair style is associated with. References person.';
COMMENT ON COLUMN investigation_person_facial_hair_style_code_ref.facial_hair_style_code_ref IS 'Unenforced FK to shared.facial_hair_style_code.  The facial hair style associated with the person. References facial_hair_style_code.';
COMMENT ON COLUMN investigation_person_facial_hair_style_code_ref.active_ind IS 'A boolean indicator to determine if the person facial hair style association is active. Used to support soft deletes.';
COMMENT ON COLUMN investigation_person_facial_hair_style_code_ref.create_user_id IS 'The id of the user that created the person facial hair style association.';
COMMENT ON COLUMN investigation_person_facial_hair_style_code_ref.create_utc_timestamp IS 'The timestamp when the person facial hair style association was created. The timestamp is stored in UTC with no Offset.';
COMMENT ON COLUMN investigation_person_facial_hair_style_code_ref.update_user_id IS 'The id of the user that updated the person facial hair style association.';
COMMENT ON COLUMN investigation_person_facial_hair_style_code_ref.update_utc_timestamp IS 'The timestamp when the person facial hair style association was updated. The timestamp is stored in UTC with no Offset.';

CREATE TABLE
  investigation_person_facial_hair_style_code_ref_h (
    h_investigation_person_facial_hair_style_code_ref_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

ALTER TABLE investigation_person_facial_hair_style_code_ref_h
ADD CONSTRAINT pk_h_investigation_person_facial_hair_style_code_ref
PRIMARY KEY (h_investigation_person_facial_hair_style_code_ref_guid);

CREATE TRIGGER investigation_person_facial_hair_style_code_ref_history_trigger
BEFORE INSERT OR DELETE OR UPDATE
ON investigation_person_facial_hair_style_code_ref
FOR EACH ROW
EXECUTE FUNCTION audit_history ('investigation_person_facial_hair_style_code_ref_h', 'investigation_person_facial_hair_style_code_ref_guid');

COMMENT ON TABLE investigation_person_facial_hair_style_code_ref_h IS 'Stores the audit history for person to facial hair style relationship records.';
COMMENT ON COLUMN investigation_person_facial_hair_style_code_ref_h.h_investigation_person_facial_hair_style_code_ref_guid IS 'The system-generated unique identifier for the person to facial hair style relationship history record.';
COMMENT ON COLUMN investigation_person_facial_hair_style_code_ref_h.target_row_id IS 'The unique identifier of the person to facial hair style relationship record affected by the operation.';
COMMENT ON COLUMN investigation_person_facial_hair_style_code_ref_h.operation_type IS 'The type of database operation executed on the person to facial hair style relationship record. For example I = Insert, U = Update, D = Delete.';
COMMENT ON COLUMN investigation_person_facial_hair_style_code_ref_h.operation_user_id IS 'The id of the user that executed the operation.';
COMMENT ON COLUMN investigation_person_facial_hair_style_code_ref_h.operation_executed_at IS 'The timestamp when the operation was executed. The timestamp is stored in UTC with no Offset.';
COMMENT ON COLUMN investigation_person_facial_hair_style_code_ref_h.data_after_executed_operation IS 'A JSON representation of the person to facial hair style relationship record after the operation was executed.';

-- Add Tattoo fields to person
ALTER TABLE investigation_person
    ADD COLUMN tattoo_ind boolean;

COMMENT ON COLUMN investigation_person.tattoo_ind IS 'Indicates whether the person has tattoos. true = has tattoos, false = does not have tattoos, null = unknown / not assessed.';

ALTER TABLE investigation_person
    ADD COLUMN tattoo_description character varying(512);

COMMENT ON COLUMN investigation_person.tattoo_description IS 'A free-text description of the person''s tattoos, used when tattoo_ind is true.';

-- Add additional descriptors and comments to person

ALTER TABLE investigation_person
    ADD COLUMN additional_descriptors text;

COMMENT ON COLUMN investigation_person.additional_descriptors IS 'Free-text additional descriptors for the person.';

ALTER TABLE investigation_person
    ADD COLUMN comments text;

COMMENT ON COLUMN investigation_person.comments IS 'Free-text comments about the person.';

-- Add BOLO field

ALTER TABLE investigation_person
    ADD COLUMN bolo_ind boolean;

COMMENT ON COLUMN investigation_person.bolo_ind IS 'Indicates whether the person has a caution flag or advises officers to be on the lookout (BOLO) for the invdividual.';

-- Explicitly track who created it

ALTER TABLE investigation_party
    ADD COLUMN created_by_app_user_guid_ref uuid;

COMMENT ON COLUMN investigation_party.created_by_app_user_guid_ref IS 'The app user that created the party. References app_user.';