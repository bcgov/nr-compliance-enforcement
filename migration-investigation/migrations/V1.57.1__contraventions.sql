CREATE TABLE contravention (
    contravention_guid         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_guid         UUID REFERENCES investigation (investigation_guid),
    legislation_guid_ref       UUID NOT NULL,
    active_ind                 BOOLEAN NOT NULL DEFAULT TRUE,
    create_user_id             VARCHAR(32) NOT NULL,
    create_utc_timestamp       TIMESTAMP NOT NULL DEFAULT NOW(),
    update_user_id             VARCHAR(32),
    update_utc_timestamp       TIMESTAMP
);

COMMENT ON TABLE contravention IS
    'A contravention occurs when a party breaks a law or a regulation.';

COMMENT ON COLUMN contravention.contravention_guid IS
    'Primary key. Unique identifier for the contravention that has been identified as being part of this investigation.';

COMMENT ON COLUMN contravention.investigation_guid IS
    'Foreign key to investigation. Unique identifier for the investigation.';

COMMENT ON COLUMN contravention.legislation_guid_ref IS
    'Unenforced Foreign key to shared.legislation. Unique identifier for the legislation that has been contravened.';

COMMENT ON COLUMN contravention.active_ind IS
    'A boolean indicator to determine if the contravention is active.  Inactive values are still retained in the system for legacy data integrity but are not valid choices for new data being added.';

COMMENT ON COLUMN contravention.create_user_id IS
    'The id of the user that created the contravention.';

COMMENT ON COLUMN contravention.create_utc_timestamp IS
    'The timestamp when the contravention was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN contravention.update_user_id IS
    'The id of the user that last updated the contravention.';

COMMENT ON COLUMN contravention.update_utc_timestamp IS
    'The timestamp when the contravention was last updated. The timestamp is stored in UTC with no offset.';
