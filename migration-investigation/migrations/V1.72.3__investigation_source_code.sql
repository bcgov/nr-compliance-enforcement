CREATE TABLE investigation_source_code (
    investigation_source_code  VARCHAR(16) PRIMARY KEY NOT NULL,
    short_description         VARCHAR(64) NOT NULL,
    long_description          VARCHAR(256),
    display_order             INTEGER,
    active_ind                BOOLEAN DEFAULT true NOT NULL,
    create_user_id            VARCHAR(32) NOT NULL,
    create_utc_timestamp      TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    update_user_id            VARCHAR(32),
    update_utc_timestamp      TIMESTAMP WITHOUT TIME ZONE
);

COMMENT ON TABLE investigation_source_code IS 'A table that holds the source codes for investigations.';

COMMENT ON COLUMN investigation_source_code.investigation_source_code IS
    'The unique identifier for the investigation source code.';

COMMENT ON COLUMN investigation_source_code.short_description IS
    'The short description of the investigation source code.  Used to store shorter versions of the long description when applicable.';

COMMENT ON COLUMN investigation_source_code.long_description IS
    'The long description of the investigation source code.  May contain additional detail not typically displayed in the application.';

COMMENT ON COLUMN investigation_source_code.display_order IS
    'The order in which the values of the investigation source code should be displayed when presented to a user in a list.  Originally incremented by 10s to allow for new values to be easily added.';

COMMENT ON COLUMN investigation_source_code.active_ind IS
    'A boolean indicator to determine if the investigation source code is active.  Inactive values are still retained in the system for legacy data integrity but are not valid choices for new data being added.';

COMMENT ON COLUMN investigation_source_code.create_user_id IS
    'The id of the user that created the investigation source code.';

COMMENT ON COLUMN investigation_source_code.create_utc_timestamp IS
    'The timestamp when the investigation source code was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN investigation_source_code.update_user_id IS
    'The id of the user that last updated the investigation source code.';

COMMENT ON COLUMN investigation_source_code.update_utc_timestamp IS
    'The timestamp when the investigation source code was last updated. The timestamp is stored in UTC with no offset.';


ALTER TABLE investigation
ADD COLUMN investigation_source VARCHAR(16);


COMMENT ON COLUMN investigation.investigation_source IS 'The source code for the investigation';

INSERT INTO
    investigation.investigation_source_code (
        investigation_source_code,
        short_description,
        long_description,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp
    )
VALUES
    (
        'OFFND',
        'Officer found',
        'Officer found',
        10,
        TRUE,
        'FLYWAY',
        NOW()
    ),
    (
        'REPRDT',
        'Reported',
        'Reported',
        20,
        TRUE,
        'FLYWAY',
        NOW()
    )
ON CONFLICT (investigation_source_code) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    display_order = EXCLUDED.display_order,
    active_ind = EXCLUDED.active_ind,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = NOW();

UPDATE investigation
SET investigation_source = 'OFFND'
WHERE investigation_source IS NULL;

ALTER TABLE investigation
ALTER COLUMN investigation_source SET NOT NULL;

ALTER TABLE investigation ADD CONSTRAINT FK_investigation_source_code FOREIGN KEY (investigation_source) 
REFERENCES investigation_source_code(investigation_source_code);

