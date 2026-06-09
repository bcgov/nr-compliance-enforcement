-- Approximate age

CREATE TABLE approximate_age_code (
    approximate_age_code character varying(16) NOT NULL,
    short_description character varying(64) NOT NULL,
    long_description character varying(256),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT approximate_age_pk
      PRIMARY KEY (approximate_age_code)
);

COMMENT ON TABLE shared.approximate_age_code IS 'Contains the approximate age category options for a person when no date of birth is known. For example 18UNDER = 18 and under, 19TO39 = 19 to 39 years.';

COMMENT ON COLUMN shared.approximate_age_code.approximate_age_code IS 'A human readable code used to identify an approximate age category.';

COMMENT ON COLUMN shared.approximate_age_code.short_description IS 'The short description of the approximate age category.';

COMMENT ON COLUMN shared.approximate_age_code.long_description IS 'The long description of the approximate age category.';

COMMENT ON COLUMN shared.approximate_age_code.display_order IS 'The order in which the approximate age categories should be displayed when presented to a user in a list.';

COMMENT ON COLUMN shared.approximate_age_code.active_ind IS 'A boolean indicator to determine if an approximate age category is active.';

COMMENT ON COLUMN shared.approximate_age_code.create_user_id IS 'The id of the user that created the approximate age category.';

COMMENT ON COLUMN shared.approximate_age_code.create_utc_timestamp IS 'The timestamp when the approximate age category was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN shared.approximate_age_code.update_user_id IS 'The id of the user that updated the approximate age category.';

COMMENT ON COLUMN shared.approximate_age_code.update_utc_timestamp IS 'The timestamp when the approximate age category was updated. The timestamp is stored in UTC with no Offset.';

ALTER TABLE person
    ADD COLUMN approximate_age_code character varying(16);

ALTER TABLE person
    ADD CONSTRAINT fk_person__approximate_age_code
    FOREIGN KEY (approximate_age_code)
    REFERENCES approximate_age_code (approximate_age_code);

COMMENT ON COLUMN shared.person.approximate_age_code IS 'The approximate age category of the person, used when no date of birth is known. References approximate_age_code.';

-- Replace sex with gender

ALTER TABLE person
    DROP CONSTRAINT fk_person__sex_code;

ALTER TABLE person
    DROP COLUMN sex_code;

DROP TABLE sex_code;

CREATE TABLE gender_code (
    gender_code character varying(16) NOT NULL,
    short_description character varying(64) NOT NULL,
    long_description character varying(256),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT gender_pk
      PRIMARY KEY (gender_code)
);

COMMENT ON TABLE shared.gender_code IS 'Contains the gender category options for a person. For example MN = Man/boy, NB = Non-binary, WM = Woman/girl.';

COMMENT ON COLUMN shared.gender_code.gender_code IS 'A human readable code used to identify a gender category.';

COMMENT ON COLUMN shared.gender_code.short_description IS 'The short description of the gender category.';

COMMENT ON COLUMN shared.gender_code.long_description IS 'The long description of the gender category.';

COMMENT ON COLUMN shared.gender_code.display_order IS 'The order in which the gender categories should be displayed when presented to a user in a list.';

COMMENT ON COLUMN shared.gender_code.active_ind IS 'A boolean indicator to determine if a gender category is active.';

COMMENT ON COLUMN shared.gender_code.create_user_id IS 'The id of the user that created the gender category.';

COMMENT ON COLUMN shared.gender_code.create_utc_timestamp IS 'The timestamp when the gender category was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN shared.gender_code.update_user_id IS 'The id of the user that updated the gender category.';

COMMENT ON COLUMN shared.gender_code.update_utc_timestamp IS 'The timestamp when the gender category was updated. The timestamp is stored in UTC with no Offset.';

ALTER TABLE person
    ADD COLUMN gender_code character varying(16);

ALTER TABLE person
    ADD CONSTRAINT fk_person__gender_code
    FOREIGN KEY (gender_code)
    REFERENCES gender_code (gender_code);

COMMENT ON COLUMN shared.person.gender_code IS 'The gender category of the person. References gender_code.';

-- Add DL Class and Jurisdiction

ALTER TABLE person
    DROP COLUMN drivers_license_jurisdiction;

ALTER TABLE person
    ADD COLUMN drivers_license_class character varying(128);

COMMENT ON COLUMN shared.person.drivers_license_class IS 'The class of the person''s driver''s licence.';

ALTER TABLE person
    ADD COLUMN drivers_license_country_code character varying(4);

ALTER TABLE person
    ADD CONSTRAINT fk_person__drivers_license_country_code
    FOREIGN KEY (drivers_license_country_code)
    REFERENCES country_code (country_code);

COMMENT ON COLUMN shared.person.drivers_license_country_code IS 'The country that issued the person''s driver''s licence. References country_code.';

ALTER TABLE person
    ADD COLUMN drivers_license_country_subdivision_code character varying(16);

ALTER TABLE person
    ADD CONSTRAINT fk_person__drivers_license_country_subdivision_code
    FOREIGN KEY (drivers_license_country_subdivision_code)
    REFERENCES country_subdivision_code (country_subdivision_code);

COMMENT ON COLUMN shared.person.drivers_license_country_subdivision_code IS 'The country subdivision (province, state, etc.) that issued the person''s driver''s licence. References country_subdivision_code.';

-- Convert Middle Name 1 and Middle Name 2 to Middle Names

ALTER TABLE person
    DROP COLUMN middle_name_2;

ALTER TABLE person
    RENAME COLUMN middle_name TO middle_names;

ALTER TABLE person
    ALTER COLUMN middle_names TYPE character varying(256);

COMMENT ON COLUMN shared.person.middle_names IS 'The middle name(s) of the person.';

-- Enable Aliases for people.  This involves a refactor of the table to bring it up to the party level

DROP TRIGGER IF EXISTS alias_history_trigger ON alias;
DROP TABLE IF EXISTS alias;

CREATE TABLE
  alias (
    alias_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    party_guid uuid NOT NULL,
    name character varying(512) NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now (),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT alias_pk PRIMARY KEY (alias_guid),
    CONSTRAINT alias_party_fk
      FOREIGN KEY (party_guid)
      REFERENCES party (party_guid)
  );

COMMENT ON TABLE alias IS 'Contains alternative names or aliases associated with a party (person or business).';

COMMENT ON COLUMN alias.alias_guid IS 'The system-generated unique identifier for the alias record.';

COMMENT ON COLUMN alias.party_guid IS 'The unique identifier of the party (person or business) associated with the alias.';

COMMENT ON COLUMN alias.name IS 'The alias name used to identify or reference the party.';

COMMENT ON COLUMN alias.active_ind IS 'A boolean indicator to determine if the alias is active.';

COMMENT ON COLUMN alias.create_user_id IS 'The id of the user that created the alias.';

COMMENT ON COLUMN alias.create_utc_timestamp IS 'The timestamp when the alias was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN alias.update_user_id IS 'The id of the user that updated the alias.';

COMMENT ON COLUMN alias.update_utc_timestamp IS 'The timestamp when the alias was updated. The timestamp is stored in UTC with no Offset.';


CREATE TRIGGER alias_history_trigger
BEFORE INSERT OR DELETE OR UPDATE
ON alias
FOR EACH ROW
EXECUTE FUNCTION audit_history (
  'alias_h',
  'alias_guid'
);

-- Add addresses for people.   This involves a refactor of the business_address table to be generic.

DROP TRIGGER IF EXISTS business_address_history_trigger ON business_address;
DROP INDEX IF EXISTS business_address_primary_unique;
DROP TABLE IF EXISTS business_address;
DROP TABLE IF EXISTS business_address_h;

CREATE TABLE
  address (
    address_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    party_guid uuid NOT NULL,
    address_name character varying(128) NOT NULL,
    address character varying(120),
    city character varying(128),
    country_subdivision_code character varying(16),
    postal_code character varying(16),
    country_code character varying(4),
    is_primary boolean NOT NULL DEFAULT false,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now (),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT address_pk PRIMARY KEY (address_guid),
    CONSTRAINT address_party_fk
      FOREIGN KEY (party_guid)
      REFERENCES party (party_guid),
    CONSTRAINT address_country_code_fk
      FOREIGN KEY (country_code)
      REFERENCES shared.country_code (country_code),
    CONSTRAINT address_country_subdivision_code_fk
      FOREIGN KEY (country_subdivision_code)
      REFERENCES shared.country_subdivision_code (country_subdivision_code)
  );

COMMENT ON TABLE address IS 'Stores physical or mailing addresses associated with a party (person or business).';

COMMENT ON COLUMN address.address_guid IS 'The system-generated unique identifier for the address record.';

COMMENT ON COLUMN address.party_guid IS 'The unique identifier of the party (person or business) associated with the address.';

COMMENT ON COLUMN address.address_name IS 'A label for the address (e.g. Head office, Mailing address).';

COMMENT ON COLUMN address.address IS 'The street address.';

COMMENT ON COLUMN address.city IS 'The city of the address.';

COMMENT ON COLUMN address.country_subdivision_code IS 'The province or state of the address.';

COMMENT ON COLUMN address.postal_code IS 'The postal or ZIP code of the address.';

COMMENT ON COLUMN address.country_code IS 'The country of the address.';

COMMENT ON COLUMN address.is_primary IS 'A boolean indicator of whether this is the primary address for the party.';

COMMENT ON COLUMN address.active_ind IS 'A boolean indicator to determine if the address is active.';

COMMENT ON COLUMN address.create_user_id IS 'The id of the user that created the address.';

COMMENT ON COLUMN address.create_utc_timestamp IS 'The timestamp when the address was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN address.update_user_id IS 'The id of the user that updated the address.';

COMMENT ON COLUMN address.update_utc_timestamp IS 'The timestamp when the address was updated. The timestamp is stored in UTC with no Offset.';

CREATE TABLE
  address_h (
    h_address_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

COMMENT ON TABLE address_h IS 'Stores the audit history for address records.';

COMMENT ON COLUMN address_h.h_address_guid IS 'The system-generated unique identifier for the address history record.';

COMMENT ON COLUMN address_h.target_row_id IS 'The unique identifier of the address record affected by the operation.';

COMMENT ON COLUMN address_h.operation_type IS 'The type of database operation executed on the address record. For example I = Insert, U = Update, D = Delete.';

COMMENT ON COLUMN address_h.operation_user_id IS 'The id of the user that executed the operation.';

COMMENT ON COLUMN address_h.operation_executed_at IS 'The timestamp when the operation was executed. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN address_h.data_after_executed_operation IS 'A JSON representation of the address record after the operation was executed.';


CREATE TRIGGER address_history_trigger
BEFORE INSERT OR DELETE OR UPDATE
ON address
FOR EACH ROW
EXECUTE FUNCTION audit_history (
  'address_h',
  'address_guid'
);

CREATE UNIQUE INDEX address_primary_unique
ON address (party_guid)
WHERE is_primary = true
AND active_ind = true;

-- Add email addresses for people.   This involves a refactor of the contact method table FKs

DROP TRIGGER IF EXISTS contact_method_history_trigger ON contact_method;
DROP TABLE IF EXISTS contact_method;

CREATE TABLE
  contact_method (
    contact_method_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    party_guid uuid NOT NULL,
    contact_method_type character varying(10) NOT NULL,
    contact_value character varying(512) NOT NULL,
    is_primary boolean NOT NULL DEFAULT false,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now (),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT contact_method_pk PRIMARY KEY (contact_method_guid),
    CONSTRAINT contact_method_party_fk
      FOREIGN KEY (party_guid)
      REFERENCES party (party_guid),
    CONSTRAINT contact_method_type_fk
      FOREIGN KEY (contact_method_type)
      REFERENCES contact_method_type_code (contact_method_type_code)
  );

COMMENT ON TABLE contact_method IS 'Stores phone, email, and other contact methods associated with a party (person or business).';

COMMENT ON COLUMN contact_method.contact_method_guid IS 'The system-generated unique identifier for the contact method record.';

COMMENT ON COLUMN contact_method.party_guid IS 'The unique identifier of the party (person or business) associated with the contact method.';

COMMENT ON COLUMN contact_method.contact_method_type IS 'The type of contact method. References contact_method_type_code (e.g. PHONE, EMAIL).';

COMMENT ON COLUMN contact_method.contact_value IS 'The contact value itself (phone number, email address, etc.).';

COMMENT ON COLUMN contact_method.is_primary IS 'A boolean indicator of whether this is the primary contact method of its type for the party.';

COMMENT ON COLUMN contact_method.active_ind IS 'A boolean indicator to determine if the contact method is active.';

COMMENT ON COLUMN contact_method.create_user_id IS 'The id of the user that created the contact method.';

COMMENT ON COLUMN contact_method.create_utc_timestamp IS 'The timestamp when the contact method was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN contact_method.update_user_id IS 'The id of the user that updated the contact method.';

COMMENT ON COLUMN contact_method.update_utc_timestamp IS 'The timestamp when the contact method was updated. The timestamp is stored in UTC with no Offset.';

CREATE TRIGGER contact_method_history_trigger
BEFORE INSERT OR DELETE OR UPDATE
ON contact_method
FOR EACH ROW
EXECUTE FUNCTION audit_history (
  'contact_method_h',
  'contact_method_guid'
);

CREATE UNIQUE INDEX contact_method_primary_unique
ON contact_method (party_guid, contact_method_type)
WHERE is_primary = true
AND active_ind = true;

-- Add height and weight for people.   Store only in metric and convert to imperial on front end 

ALTER TABLE shared.person
    ADD COLUMN height_cm numeric(5,1),
    ADD COLUMN weight_kg numeric(5,1);

COMMENT ON COLUMN shared.person.height_cm IS 'The person''s height in centimetres. Stored as the canonical metric value; the UI provides a ft/in display toggle that converts for entry and display only.';
COMMENT ON COLUMN shared.person.weight_kg IS 'The person''s weight in kilograms. Stored as the canonical metric value; the UI provides a lb display toggle that converts for entry and display only.';

-- Add complexion for people.

CREATE TABLE complexion_code (
    complexion_code character varying(16) NOT NULL,
    short_description character varying(64) NOT NULL,
    long_description character varying(256),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT complexion_pk
      PRIMARY KEY (complexion_code)
);

COMMENT ON TABLE shared.complexion_code IS 'Contains the complexion options for a person. For example FAIR = Fair, OLIVE = Olive.';

COMMENT ON COLUMN shared.complexion_code.complexion_code IS 'A human readable code used to identify a complexion.';
COMMENT ON COLUMN shared.complexion_code.short_description IS 'The short description of the complexion.';
COMMENT ON COLUMN shared.complexion_code.long_description IS 'The long description of the complexion.';
COMMENT ON COLUMN shared.complexion_code.display_order IS 'The order in which the complexions should be displayed when presented to a user in a list.';
COMMENT ON COLUMN shared.complexion_code.active_ind IS 'A boolean indicator to determine if a complexion is active.';
COMMENT ON COLUMN shared.complexion_code.create_user_id IS 'The id of the user that created the complexion.';
COMMENT ON COLUMN shared.complexion_code.create_utc_timestamp IS 'The timestamp when the complexion was created. The timestamp is stored in UTC with no Offset.';
COMMENT ON COLUMN shared.complexion_code.update_user_id IS 'The id of the user that updated the complexion.';
COMMENT ON COLUMN shared.complexion_code.update_utc_timestamp IS 'The timestamp when the complexion was updated. The timestamp is stored in UTC with no Offset.';

ALTER TABLE person
    ADD COLUMN complexion_code character varying(16);

ALTER TABLE person
    ADD CONSTRAINT fk_person__complexion_code
    FOREIGN KEY (complexion_code)
    REFERENCES complexion_code (complexion_code);

COMMENT ON COLUMN shared.person.complexion_code IS 'The complexion of the person. References complexion_code.';

-- Add build for people

CREATE TABLE build_code (
    build_code character varying(16) NOT NULL,
    short_description character varying(64) NOT NULL,
    long_description character varying(256),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT build_pk
      PRIMARY KEY (build_code)
);

COMMENT ON TABLE shared.build_code IS 'Contains the build options for a person. For example SLENDER = Slender, MEDIUM = Medium, LARGE = Large.';

COMMENT ON COLUMN shared.build_code.build_code IS 'A human readable code used to identify a build.';
COMMENT ON COLUMN shared.build_code.short_description IS 'The short description of the build.';
COMMENT ON COLUMN shared.build_code.long_description IS 'The long description of the build.';
COMMENT ON COLUMN shared.build_code.display_order IS 'The order in which the builds should be displayed when presented to a user in a list.';
COMMENT ON COLUMN shared.build_code.active_ind IS 'A boolean indicator to determine if a build is active.';
COMMENT ON COLUMN shared.build_code.create_user_id IS 'The id of the user that created the build.';
COMMENT ON COLUMN shared.build_code.create_utc_timestamp IS 'The timestamp when the build was created. The timestamp is stored in UTC with no Offset.';
COMMENT ON COLUMN shared.build_code.update_user_id IS 'The id of the user that updated the build.';
COMMENT ON COLUMN shared.build_code.update_utc_timestamp IS 'The timestamp when the build was updated. The timestamp is stored in UTC with no Offset.';

ALTER TABLE person
    ADD COLUMN build_code character varying(16);

ALTER TABLE person
    ADD CONSTRAINT fk_person__build_code
    FOREIGN KEY (build_code)
    REFERENCES build_code (build_code);

COMMENT ON COLUMN shared.person.build_code IS 'The build of the person. References build_code.';

-- Add hair colour for people

CREATE TABLE hair_colour_code (
    hair_colour_code character varying(16) NOT NULL,
    short_description character varying(64) NOT NULL,
    long_description character varying(256),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT hair_colour_pk
      PRIMARY KEY (hair_colour_code)
);

COMMENT ON TABLE shared.hair_colour_code IS 'Contains the hair colour options for a person. Codes follow the NCIC hair colour (HAI) standard, except OTH (Other) which is a local code. For example BLK = Black, BRO = Brown.';

COMMENT ON COLUMN shared.hair_colour_code.hair_colour_code IS 'A human readable code used to identify a hair colour. Follows the NCIC hair colour (HAI) standard where applicable.';
COMMENT ON COLUMN shared.hair_colour_code.short_description IS 'The short description of the hair colour.';
COMMENT ON COLUMN shared.hair_colour_code.long_description IS 'The long description of the hair colour.';
COMMENT ON COLUMN shared.hair_colour_code.display_order IS 'The order in which the hair colours should be displayed when presented to a user in a list.';
COMMENT ON COLUMN shared.hair_colour_code.active_ind IS 'A boolean indicator to determine if a hair colour is active.';
COMMENT ON COLUMN shared.hair_colour_code.create_user_id IS 'The id of the user that created the hair colour.';
COMMENT ON COLUMN shared.hair_colour_code.create_utc_timestamp IS 'The timestamp when the hair colour was created. The timestamp is stored in UTC with no Offset.';
COMMENT ON COLUMN shared.hair_colour_code.update_user_id IS 'The id of the user that updated the hair colour.';
COMMENT ON COLUMN shared.hair_colour_code.update_utc_timestamp IS 'The timestamp when the hair colour was updated. The timestamp is stored in UTC with no Offset.';

ALTER TABLE person
    ADD COLUMN hair_colour_code character varying(16);

ALTER TABLE person
    ADD CONSTRAINT fk_person__hair_colour_code
    FOREIGN KEY (hair_colour_code)
    REFERENCES hair_colour_code (hair_colour_code);

COMMENT ON COLUMN shared.person.hair_colour_code IS 'The hair colour of the person. References hair_colour_code.';

ALTER TABLE person
    ADD COLUMN hair_colour_other character varying(128);

COMMENT ON COLUMN shared.person.hair_colour_other IS 'A free-text hair colour description, used when hair_colour_code is OTH (Other).';

-- Add hair length for people

CREATE TABLE hair_length_code (
    hair_length_code character varying(16) NOT NULL,
    short_description character varying(64) NOT NULL,
    long_description character varying(256),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT hair_length_pk
      PRIMARY KEY (hair_length_code)
);

COMMENT ON TABLE shared.hair_length_code IS 'Contains the hair length options for a person. For example SHORT = Short, LONG = Long.';

COMMENT ON COLUMN shared.hair_length_code.hair_length_code IS 'A human readable code used to identify a hair length.';
COMMENT ON COLUMN shared.hair_length_code.short_description IS 'The short description of the hair length.';
COMMENT ON COLUMN shared.hair_length_code.long_description IS 'The long description of the hair length.';
COMMENT ON COLUMN shared.hair_length_code.display_order IS 'The order in which the hair lengths should be displayed when presented to a user in a list.';
COMMENT ON COLUMN shared.hair_length_code.active_ind IS 'A boolean indicator to determine if a hair length is active.';
COMMENT ON COLUMN shared.hair_length_code.create_user_id IS 'The id of the user that created the hair length.';
COMMENT ON COLUMN shared.hair_length_code.create_utc_timestamp IS 'The timestamp when the hair length was created. The timestamp is stored in UTC with no Offset.';
COMMENT ON COLUMN shared.hair_length_code.update_user_id IS 'The id of the user that updated the hair length.';
COMMENT ON COLUMN shared.hair_length_code.update_utc_timestamp IS 'The timestamp when the hair length was updated. The timestamp is stored in UTC with no Offset.';

ALTER TABLE person
    ADD COLUMN hair_length_code character varying(16);

ALTER TABLE person
    ADD CONSTRAINT fk_person__hair_length_code
    FOREIGN KEY (hair_length_code)
    REFERENCES hair_length_code (hair_length_code);

COMMENT ON COLUMN shared.person.hair_length_code IS 'The hair length of the person. References hair_length_code.';

-- Add eye colour for people

CREATE TABLE eye_colour_code (
    eye_colour_code character varying(16) NOT NULL,
    short_description character varying(64) NOT NULL,
    long_description character varying(256),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT eye_colour_pk
      PRIMARY KEY (eye_colour_code)
);

COMMENT ON TABLE shared.eye_colour_code IS 'Contains the eye colour options for a person. Codes follow the NCIC eye colour (EYE) standard, except AMBER and OTH (Other) which are local codes. For example BLU = Blue, BRO = Brown.';

COMMENT ON COLUMN shared.eye_colour_code.eye_colour_code IS 'A human readable code used to identify an eye colour. Follows the NCIC eye colour (EYE) standard where applicable.';
COMMENT ON COLUMN shared.eye_colour_code.short_description IS 'The short description of the eye colour.';
COMMENT ON COLUMN shared.eye_colour_code.long_description IS 'The long description of the eye colour.';
COMMENT ON COLUMN shared.eye_colour_code.display_order IS 'The order in which the eye colours should be displayed when presented to a user in a list.';
COMMENT ON COLUMN shared.eye_colour_code.active_ind IS 'A boolean indicator to determine if an eye colour is active.';
COMMENT ON COLUMN shared.eye_colour_code.create_user_id IS 'The id of the user that created the eye colour.';
COMMENT ON COLUMN shared.eye_colour_code.create_utc_timestamp IS 'The timestamp when the eye colour was created. The timestamp is stored in UTC with no Offset.';
COMMENT ON COLUMN shared.eye_colour_code.update_user_id IS 'The id of the user that updated the eye colour.';
COMMENT ON COLUMN shared.eye_colour_code.update_utc_timestamp IS 'The timestamp when the eye colour was updated. The timestamp is stored in UTC with no Offset.';

ALTER TABLE person
    ADD COLUMN eye_colour_code character varying(16);

ALTER TABLE person
    ADD CONSTRAINT fk_person__eye_colour_code
    FOREIGN KEY (eye_colour_code)
    REFERENCES eye_colour_code (eye_colour_code);

COMMENT ON COLUMN shared.person.eye_colour_code IS 'The eye colour of the person. References eye_colour_code.';

ALTER TABLE person
    ADD COLUMN eye_colour_other character varying(128);

COMMENT ON COLUMN shared.person.eye_colour_other IS 'A free-text eye colour description, used when eye_colour_code is OTH (Other).';

-- Add Facial Hair to Person

CREATE TABLE facial_hair_style_code (
    facial_hair_style_code character varying(16) NOT NULL,
    short_description character varying(64) NOT NULL,
    long_description character varying(256),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT facial_hair_style_pk
      PRIMARY KEY (facial_hair_style_code)
);

COMMENT ON TABLE shared.facial_hair_style_code IS 'Contains the facial hair style options for a person. Local code set. For example GOATEE = Goatee, MUSTACHE = Mustache.';

COMMENT ON COLUMN shared.facial_hair_style_code.facial_hair_style_code IS 'A human readable code used to identify a facial hair style.';
COMMENT ON COLUMN shared.facial_hair_style_code.short_description IS 'The short description of the facial hair style.';
COMMENT ON COLUMN shared.facial_hair_style_code.long_description IS 'The long description of the facial hair style.';
COMMENT ON COLUMN shared.facial_hair_style_code.display_order IS 'The order in which the facial hair styles should be displayed when presented to a user in a list.';
COMMENT ON COLUMN shared.facial_hair_style_code.active_ind IS 'A boolean indicator to determine if a facial hair style is active.';
COMMENT ON COLUMN shared.facial_hair_style_code.create_user_id IS 'The id of the user that created the facial hair style.';
COMMENT ON COLUMN shared.facial_hair_style_code.create_utc_timestamp IS 'The timestamp when the facial hair style was created. The timestamp is stored in UTC with no Offset.';
COMMENT ON COLUMN shared.facial_hair_style_code.update_user_id IS 'The id of the user that updated the facial hair style.';
COMMENT ON COLUMN shared.facial_hair_style_code.update_utc_timestamp IS 'The timestamp when the facial hair style was updated. The timestamp is stored in UTC with no Offset.';

ALTER TABLE person
    ADD COLUMN facial_hair_ind boolean;

COMMENT ON COLUMN shared.person.facial_hair_ind IS 'Indicates whether the person has facial hair. true = has facial hair, false = does not have facial hair, null = unknown / not assessed.';

ALTER TABLE person
    ADD COLUMN additional_hair_descriptors character varying(512);

COMMENT ON COLUMN shared.person.additional_hair_descriptors IS 'Free-text additional hair descriptors for the person.';

CREATE TABLE
  person_facial_hair_style_code (
    person_facial_hair_style_code_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    person_guid uuid NOT NULL,
    facial_hair_style_code character varying(16) NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT NOW(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT person_facial_hair_style_code_pk PRIMARY KEY (person_facial_hair_style_code_guid),
    CONSTRAINT person_facial_hair_style_code_person_fk
      FOREIGN KEY (person_guid)
      REFERENCES person (person_guid),
    CONSTRAINT person_facial_hair_style_code_facial_hair_style_code_fk
      FOREIGN KEY (facial_hair_style_code)
      REFERENCES facial_hair_style_code (facial_hair_style_code)
  );

COMMENT ON TABLE shared.person_facial_hair_style_code IS 'A junction table associating a person with their facial hair styles. A person may have multiple facial hair styles.';

COMMENT ON COLUMN shared.person_facial_hair_style_code.person_facial_hair_style_code_guid IS 'A system generated unique identifier for the person facial hair style association.';
COMMENT ON COLUMN shared.person_facial_hair_style_code.person_guid IS 'The person the facial hair style is associated with. References person.';
COMMENT ON COLUMN shared.person_facial_hair_style_code.facial_hair_style_code IS 'The facial hair style associated with the person. References facial_hair_style_code.';
COMMENT ON COLUMN shared.person_facial_hair_style_code.active_ind IS 'A boolean indicator to determine if the person facial hair style association is active. Used to support soft deletes.';
COMMENT ON COLUMN shared.person_facial_hair_style_code.create_user_id IS 'The id of the user that created the person facial hair style association.';
COMMENT ON COLUMN shared.person_facial_hair_style_code.create_utc_timestamp IS 'The timestamp when the person facial hair style association was created. The timestamp is stored in UTC with no Offset.';
COMMENT ON COLUMN shared.person_facial_hair_style_code.update_user_id IS 'The id of the user that updated the person facial hair style association.';
COMMENT ON COLUMN shared.person_facial_hair_style_code.update_utc_timestamp IS 'The timestamp when the person facial hair style association was updated. The timestamp is stored in UTC with no Offset.';

CREATE TABLE
  person_facial_hair_style_code_h (
    h_person_facial_hair_style_code_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

ALTER TABLE person_facial_hair_style_code_h
ADD CONSTRAINT pk_h_person_facial_hair_style_code
PRIMARY KEY (h_person_facial_hair_style_code_guid);

CREATE TRIGGER person_facial_hair_style_code_history_trigger
BEFORE INSERT OR DELETE OR UPDATE
ON person_facial_hair_style_code
FOR EACH ROW
EXECUTE FUNCTION audit_history ('person_facial_hair_style_code_h', 'person_facial_hair_style_code_guid');

COMMENT ON TABLE person_facial_hair_style_code_h IS 'Stores the audit history for person to facial hair style relationship records.';
COMMENT ON COLUMN person_facial_hair_style_code_h.h_person_facial_hair_style_code_guid IS 'The system-generated unique identifier for the person to facial hair style relationship history record.';
COMMENT ON COLUMN person_facial_hair_style_code_h.target_row_id IS 'The unique identifier of the person to facial hair style relationship record affected by the operation.';
COMMENT ON COLUMN person_facial_hair_style_code_h.operation_type IS 'The type of database operation executed on the person to facial hair style relationship record. For example I = Insert, U = Update, D = Delete.';
COMMENT ON COLUMN person_facial_hair_style_code_h.operation_user_id IS 'The id of the user that executed the operation.';
COMMENT ON COLUMN person_facial_hair_style_code_h.operation_executed_at IS 'The timestamp when the operation was executed. The timestamp is stored in UTC with no Offset.';
COMMENT ON COLUMN person_facial_hair_style_code_h.data_after_executed_operation IS 'A JSON representation of the person to facial hair style relationship record after the operation was executed.';

-- Add Tattoo fields to person
ALTER TABLE person
    ADD COLUMN tattoo_ind boolean;

COMMENT ON COLUMN shared.person.tattoo_ind IS 'Indicates whether the person has tattoos. true = has tattoos, false = does not have tattoos, null = unknown / not assessed.';

ALTER TABLE person
    ADD COLUMN tattoo_description character varying(512);

COMMENT ON COLUMN shared.person.tattoo_description IS 'A free-text description of the person''s tattoos, used when tattoo_ind is true.';

-- Add additional descriptors and comments to person

ALTER TABLE person
    ADD COLUMN additional_descriptors text;

COMMENT ON COLUMN shared.person.additional_descriptors IS 'Free-text additional descriptors for the person.';

ALTER TABLE person
    ADD COLUMN comments text;

COMMENT ON COLUMN shared.person.comments IS 'Free-text comments about the person.';

-- Add BOLO field

ALTER TABLE person
    ADD COLUMN bolo_ind boolean;

COMMENT ON COLUMN shared.person.bolo_ind IS 'Indicates whether the person has a caution flag or advises officers to be on the lookout (BOLO) for the invdividual.';

-- Explicitly track who created it

ALTER TABLE party
    ADD COLUMN created_by_app_user_guid uuid;

ALTER TABLE party
    ADD CONSTRAINT fk_party__created_by_app_user_guid
    FOREIGN KEY (created_by_app_user_guid)
    REFERENCES app_user (app_user_guid);

COMMENT ON COLUMN shared.party.created_by_app_user_guid IS 'The app user that created the party. References app_user.';