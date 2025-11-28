CREATE TABLE contravention_party_xref (
    contravention_party_xref_guid   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contravention_guid              UUID REFERENCES contravention (contravention_guid),
    investigation_party_guid        UUID REFERENCES investigation_party (investigation_party_guid),
    active_ind                      BOOLEAN NOT NULL DEFAULT TRUE,
    create_user_id                  VARCHAR(32) NOT NULL,
    create_utc_timestamp            TIMESTAMP NOT NULL DEFAULT NOW(),
    update_user_id                  VARCHAR(32),
    update_utc_timestamp            TIMESTAMP
);

COMMENT ON TABLE contravention_party_xref IS
    'Cross reference table linking many contraventions to many parties.';

COMMENT ON COLUMN contravention_party_xref.contravention_party_xref_guid IS
    'Primary key. Unique identifier for contravention/party cross reference.';

COMMENT ON COLUMN contravention_party_xref.contravention_guid IS
    'Foreign key to contravention. Unique identifier for the contravention.';

COMMENT ON COLUMN contravention_party_xref.investigation_party_guid IS
    'Foreign key to investigation party. Unique identifier for the party.';

COMMENT ON COLUMN contravention.active_ind IS
    'A boolean indicator to determine if the cross reference is active.  Inactive values are still retained in the system for legacy data integrity and history.';

COMMENT ON COLUMN contravention.create_user_id IS
    'The id of the user that associated the party to the contravention.';

COMMENT ON COLUMN contravention.create_utc_timestamp IS
    'The timestamp when the cross reference was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN contravention.update_user_id IS
    'The id of the user that removed the party from the contravention.';

COMMENT ON COLUMN contravention.update_utc_timestamp IS
    'The timestamp when the cross reference was last updated. The timestamp is stored in UTC with no offset.';
