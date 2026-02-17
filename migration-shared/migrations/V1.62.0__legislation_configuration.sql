CREATE TABLE IF NOT EXISTS legislation_configuration (
    legislation_configuration_guid UUID PRIMARY KEY DEFAULT public.uuid_generate_v4 (),
    legislation_guid UUID NOT NULL, 
    agency_code VARCHAR(10) NOT NULL,
    enabled_ind BOOLEAN NOT NULL DEFAULT TRUE,
    override_text TEXT,
    create_user_id VARCHAR(32) NOT NULL,
    create_utc_timestamp TIMESTAMP NOT NULL DEFAULT NOW (),
    update_user_id VARCHAR(32),
    update_utc_timestamp TIMESTAMP,
    CONSTRAINT fk_legislation_configuration_agency
        FOREIGN KEY (agency_code) REFERENCES agency_code (agency_code),
    CONSTRAINT fk_legislation_configuration_legislation
        FOREIGN KEY (legislation_guid) REFERENCES legislation (legislation_guid),
    CONSTRAINT uq_legislation_configuration_leg_agency
        UNIQUE (legislation_guid, agency_code)
);

COMMENT ON TABLE legislation_configuration IS
'Stores configuration settings that control legislation-related behavior at the agency level.';

COMMENT ON COLUMN legislation_configuration.legislation_configuration_guid IS
'Primary key. Unique identifier for this legislation configuration record.';

COMMENT ON COLUMN legislation_configuration.legislation_guid IS
'Foreign key to legislations. Identifies the legislation this configuration applies to.';

COMMENT ON COLUMN legislation_configuration.agency_code IS
'Foreign key to agency_code. Identifies the agency this configuration applies to.';

COMMENT ON COLUMN legislation_configuration.enabled_ind IS
'Whether this configuration is enabled. Disabled configurations will be ignored by the application.';

COMMENT ON COLUMN legislation_configuration.override_text IS
'Optional override text used to replace or supplement default legislation content.';

COMMENT ON COLUMN legislation_configuration.create_user_id IS
'The id of the user that created this record.';

COMMENT ON COLUMN legislation_configuration.create_utc_timestamp IS
'The timestamp when this record was created. Stored in UTC with no offset.';

COMMENT ON COLUMN legislation_configuration.update_user_id IS
'The id of the user that last updated this record.';

COMMENT ON COLUMN legislation_configuration.update_utc_timestamp IS
'The timestamp when this record was last updated. Stored in UTC with no offset.';