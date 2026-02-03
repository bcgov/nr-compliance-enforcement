-- Create the sex_code table to reference from the party
CREATE TABLE shared.sex_code (
    sex_code character varying(10) NOT NULL,
    short_description character varying(50) NOT NULL,
    long_description character varying(250),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);

ALTER TABLE ONLY shared.sex_code ADD CONSTRAINT "PK_sex_code" PRIMARY KEY (sex_code);
CREATE TRIGGER sexcd_set_default_audit_values BEFORE UPDATE ON shared.sex_code FOR EACH ROW EXECUTE FUNCTION shared.update_audit_columns();

COMMENT ON TABLE shared.sex_code IS 'Contains the list of biological sexes supported by the system.  For example M = "Male"';
COMMENT ON COLUMN shared.sex_code.sex_code IS 'A human readable code used to identify a sex type.';
COMMENT ON COLUMN shared.sex_code.short_description IS 'The short description of a sex type.';
COMMENT ON COLUMN shared.sex_code.long_description IS 'The long description of a sex type.';
COMMENT ON COLUMN shared.sex_code.display_order IS 'The order in which the values of the sex type should be displayed when presented to a user in a list.';
COMMENT ON COLUMN shared.sex_code.active_ind IS 'A boolean indicator to determine if a sex type is active.';
COMMENT ON COLUMN shared.sex_code.create_user_id IS 'The id of the user that created the sex type.';
COMMENT ON COLUMN shared.sex_code.create_utc_timestamp IS 'The timestamp when the sex type was created.  The timestamp is stored in UTC with no Offset.';
COMMENT ON COLUMN shared.sex_code.update_user_id IS 'The id of the user that updated the sex type.';
COMMENT ON COLUMN shared.sex_code.update_utc_timestamp IS 'The timestamp when the sex type was updated.  The timestamp is stored in UTC with no Offset.';


-- Update the shared.person table with new properties
ALTER TABLE shared.person
    ADD COLUMN date_of_birth date,
    ADD COLUMN drivers_license_number character varying(64),
    ADD COLUMN drivers_license_jurisdiction character varying(64),
    ADD COLUMN sex_code character varying(16);

ALTER TABLE ONLY shared.person
    ADD CONSTRAINT fk_person__sex_code FOREIGN KEY (sex_code) REFERENCES shared.sex_code(sex_code);

COMMENT ON COLUMN shared.person.date_of_birth IS 'The date of birth of the pereson.';
COMMENT ON COLUMN shared.person.drivers_license_number IS 'The drivers license number of the pereson.';
COMMENT ON COLUMN shared.person.drivers_license_jurisdiction IS 'The jurisdiction that issued the drivers license.';
COMMENT ON COLUMN shared.person.middle_name IS 'The middle name of the pereson.';
COMMENT ON COLUMN shared.person.sex_code IS 'A reference to the sex code of the pereson.';

-- Add is_primary field to the shared.contact_method table that defaults to false
ALTER TABLE shared.contact_method
    ADD COLUMN is_primary boolean NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN shared.contact_method.is_primary IS 'A boolean indicator of whether a contact method is the primary of that type for a person.';

-- Only allow one record of a given contact_method_type to be the primary for a person
-- e.g. one primary phone number, one primary email address, etc.
CREATE UNIQUE INDEX contact_method_primary_unique
    ON shared.contact_method (person_guid, contact_method_type)
    WHERE is_primary = true;

-- Set any existing records with a contact_method_type of PRIMPHONE to is_primary = true
UPDATE shared.contact_method
    SET is_primary = TRUE
    WHERE contact_method_type = 'PRIMPHONE';

INSERT INTO shared.contact_method_type_code (
    contact_method_type_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp
) VALUES
    ('PHONE', 'Phone number', 'Phone number', 10, TRUE, 'FLYWAY', NOW())
ON CONFLICT DO NOTHING;

-- Update existing records with a contact_method_type of PRIMPHONE or ALTPHONE to use the new PHONE code
UPDATE shared.contact_method
    SET contact_method_type = 'PHONE'
    WHERE contact_method_type IN ('PRIMPHONE', 'ALTPHONE');
