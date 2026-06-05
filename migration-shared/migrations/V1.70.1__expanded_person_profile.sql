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