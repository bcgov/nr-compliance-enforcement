-- Expand local party profile tables to support creating investigation-scoped parties
-- with the same data fields available on global (shared) party profiles.

-- ==========================================
-- EXPAND INVESTIGATION_PERSON
-- ==========================================
ALTER TABLE investigation.investigation_person
  ADD COLUMN date_of_birth DATE,
  ADD COLUMN drivers_license_number VARCHAR(64),
  ADD COLUMN drivers_license_jurisdiction VARCHAR(64),
  ADD COLUMN sex_code_ref VARCHAR(16);

COMMENT ON COLUMN investigation.investigation_person.date_of_birth IS
    'The date of birth of the person.';

COMMENT ON COLUMN investigation.investigation_person.drivers_license_number IS
    'The drivers license number of the person.';

COMMENT ON COLUMN investigation.investigation_person.drivers_license_jurisdiction IS
    'The jurisdiction that issued the drivers license.';

COMMENT ON COLUMN investigation.investigation_person.sex_code_ref IS
    'Cross schema foreign key (unenforced) to shared.sex_code. Code representing the sex of the person.';

-- ==========================================
-- INVESTIGATION_CONTACT_METHOD
-- ==========================================
CREATE TABLE investigation.investigation_contact_method (
    investigation_contact_method_guid   UUID DEFAULT public.uuid_generate_v4() NOT NULL,
    investigation_person_guid           UUID,
    investigation_business_guid         UUID,
    contact_method_type_code_ref        VARCHAR(10) NOT NULL,
    contact_value                       VARCHAR(512),
    is_primary                          BOOLEAN DEFAULT false NOT NULL,
    active_ind                          BOOLEAN DEFAULT true NOT NULL,
    create_user_id                      VARCHAR(32) NOT NULL,
    create_utc_timestamp                TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    update_user_id                      VARCHAR(32),
    update_utc_timestamp                TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT investigation_contact_method_pk PRIMARY KEY (investigation_contact_method_guid),
    CONSTRAINT fk_investigation_contact_method_person FOREIGN KEY (investigation_person_guid)
        REFERENCES investigation.investigation_person (investigation_person_guid) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT fk_investigation_contact_method_business FOREIGN KEY (investigation_business_guid)
        REFERENCES investigation.investigation_business (investigation_business_guid) ON DELETE NO ACTION ON UPDATE NO ACTION
);

COMMENT ON TABLE investigation.investigation_contact_method IS
    'Stores contact methods for persons and businesses within an investigation. These are local to the investigation and are not shared across other investigations or the global party profile.';

COMMENT ON COLUMN investigation.investigation_contact_method.investigation_contact_method_guid IS
    'Primary key. System generated unique identifier for the investigation contact method.';

COMMENT ON COLUMN investigation.investigation_contact_method.investigation_person_guid IS
    'Foreign key to investigation_person. Links the contact method to a person within the investigation. Mutually exclusive with investigation_business_guid.';

COMMENT ON COLUMN investigation.investigation_contact_method.investigation_business_guid IS
    'Foreign key to investigation_business. Links the contact method to a business within the investigation. Mutually exclusive with investigation_person_guid.';

COMMENT ON COLUMN investigation.investigation_contact_method.contact_method_type_code_ref IS
    'Cross schema foreign key (unenforced) to shared.contact_method_type_code. Code representing the type of contact method (e.g. phone, email).';

COMMENT ON COLUMN investigation.investigation_contact_method.contact_value IS
    'The contact value such as a phone number or email address.';

COMMENT ON COLUMN investigation.investigation_contact_method.is_primary IS
    'A boolean indicator to determine if this is the primary contact method for the person or business.';

COMMENT ON COLUMN investigation.investigation_contact_method.active_ind IS
    'A boolean indicator to determine if the contact method is active.';

COMMENT ON COLUMN investigation.investigation_contact_method.create_user_id IS
    'The id of the user that created the contact method.';

COMMENT ON COLUMN investigation.investigation_contact_method.create_utc_timestamp IS
    'The timestamp when the contact method was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN investigation.investigation_contact_method.update_user_id IS
    'The id of the user that last updated the contact method.';

COMMENT ON COLUMN investigation.investigation_contact_method.update_utc_timestamp IS
    'The timestamp when the contact method was last updated. The timestamp is stored in UTC with no offset.';

-- ==========================================
-- INVESTIGATION_BUSINESS_IDENTIFIER
-- ==========================================
CREATE TABLE investigation.investigation_business_identifier (
    investigation_business_identifier_guid  UUID DEFAULT public.uuid_generate_v4() NOT NULL,
    investigation_business_guid             UUID NOT NULL,
    business_identifier_code_ref            VARCHAR(16) NOT NULL,
    identifier_value                        VARCHAR(256) NOT NULL,
    active_ind                              BOOLEAN DEFAULT true NOT NULL,
    create_user_id                          VARCHAR(32) NOT NULL,
    create_utc_timestamp                    TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    update_user_id                          VARCHAR(32),
    update_utc_timestamp                    TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT investigation_business_identifier_pk PRIMARY KEY (investigation_business_identifier_guid),
    CONSTRAINT fk_investigation_business_identifier_business FOREIGN KEY (investigation_business_guid)
        REFERENCES investigation.investigation_business (investigation_business_guid) ON DELETE NO ACTION ON UPDATE NO ACTION
);

COMMENT ON TABLE investigation.investigation_business_identifier IS
    'Stores business identifiers (e.g. registration numbers) for businesses within an investigation. These are local to the investigation and are not shared across other investigations or the global party profile.';

COMMENT ON COLUMN investigation.investigation_business_identifier.investigation_business_identifier_guid IS
    'Primary key. System generated unique identifier for the investigation business identifier.';

COMMENT ON COLUMN investigation.investigation_business_identifier.investigation_business_guid IS
    'Foreign key to investigation_business. Links the identifier to a business within the investigation.';

COMMENT ON COLUMN investigation.investigation_business_identifier.business_identifier_code_ref IS
    'Cross schema foreign key (unenforced) to shared.business_identifier_code. Code representing the type of business identifier.';

COMMENT ON COLUMN investigation.investigation_business_identifier.identifier_value IS
    'The value of the business identifier.';

COMMENT ON COLUMN investigation.investigation_business_identifier.active_ind IS
    'A boolean indicator to determine if the business identifier is active.';

COMMENT ON COLUMN investigation.investigation_business_identifier.create_user_id IS
    'The id of the user that created the business identifier.';

COMMENT ON COLUMN investigation.investigation_business_identifier.create_utc_timestamp IS
    'The timestamp when the business identifier was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN investigation.investigation_business_identifier.update_user_id IS
    'The id of the user that last updated the business identifier.';

COMMENT ON COLUMN investigation.investigation_business_identifier.update_utc_timestamp IS
    'The timestamp when the business identifier was last updated. The timestamp is stored in UTC with no offset.';

-- ==========================================
-- INVESTIGATION_ALIAS
-- ==========================================
CREATE TABLE investigation.investigation_alias (
    investigation_alias_guid        UUID DEFAULT public.uuid_generate_v4() NOT NULL,
    investigation_business_guid     UUID NOT NULL,
    name                            VARCHAR(512) NOT NULL,
    active_ind                      BOOLEAN DEFAULT true NOT NULL,
    create_user_id                  VARCHAR(32) NOT NULL,
    create_utc_timestamp            TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    update_user_id                  VARCHAR(32),
    update_utc_timestamp            TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT investigation_alias_pk PRIMARY KEY (investigation_alias_guid),
    CONSTRAINT fk_investigation_alias_business FOREIGN KEY (investigation_business_guid)
        REFERENCES investigation.investigation_business (investigation_business_guid) ON DELETE NO ACTION ON UPDATE NO ACTION
);

COMMENT ON TABLE investigation.investigation_alias IS
    'Stores aliases (also known as names) for businesses within an investigation. These are local to the investigation and are not shared across other investigations or the global party profile.';

COMMENT ON COLUMN investigation.investigation_alias.investigation_alias_guid IS
    'Primary key. System generated unique identifier for the investigation alias.';

COMMENT ON COLUMN investigation.investigation_alias.investigation_business_guid IS
    'Foreign key to investigation_business. Links the alias to a business within the investigation.';

COMMENT ON COLUMN investigation.investigation_alias.name IS
    'The alias name for the business.';

COMMENT ON COLUMN investigation.investigation_alias.active_ind IS
    'A boolean indicator to determine if the alias is active.';

COMMENT ON COLUMN investigation.investigation_alias.create_user_id IS
    'The id of the user that created the alias.';

COMMENT ON COLUMN investigation.investigation_alias.create_utc_timestamp IS
    'The timestamp when the alias was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN investigation.investigation_alias.update_user_id IS
    'The id of the user that last updated the alias.';

COMMENT ON COLUMN investigation.investigation_alias.update_utc_timestamp IS
    'The timestamp when the alias was last updated. The timestamp is stored in UTC with no offset.';