CREATE TABLE activity_note_code (
    activity_note_code              VARCHAR(16) PRIMARY KEY NOT NULL,
    short_description               VARCHAR(64) NOT NULL,
    long_description                VARCHAR(256),
    display_order                   INTEGER,
    active_ind                      BOOLEAN DEFAULT true NOT NULL,
    create_user_id                  VARCHAR(32) NOT NULL,
    create_utc_timestamp            TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    update_user_id                  VARCHAR(32),
    update_utc_timestamp            TIMESTAMP WITHOUT TIME ZONE
);

COMMENT ON TABLE activity_note_code IS
    'Reference table defining types of activity notes.';

COMMENT ON COLUMN activity_note_code.activity_note_code IS
    'Primary key. Code representing the type of activity note.';

COMMENT ON COLUMN activity_note_code.short_description IS
    'The short description of the activity note code. Used to store shorter versions of the long description when applicable.';

COMMENT ON COLUMN activity_note_code.long_description IS
    'The long description of the activity note code. May contain additional detail not typically displayed in the application.';

COMMENT ON COLUMN activity_note_code.display_order IS
    'The order in which the values of the activity note code should be displayed when presented to a user in a list. Originally incremented by 10s to allow for new values to be easily added.';

COMMENT ON COLUMN activity_note_code.active_ind IS
    'A boolean indicator to determine if the activity note code is active. Inactive values are retained for legacy data integrity but are not valid choices for new data.';

COMMENT ON COLUMN activity_note_code.create_user_id IS
    'The id of the user that created the activity note code.';

COMMENT ON COLUMN activity_note_code.create_utc_timestamp IS
    'The timestamp when the activity note code was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN activity_note_code.update_user_id IS
    'The id of the user that last updated the activity note code.';

COMMENT ON COLUMN activity_note_code.update_utc_timestamp IS
    'The timestamp when the activity note code was last updated. The timestamp is stored in UTC with no offset.';

INSERT INTO activity_note_code (
    activity_note_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
) VALUES
(
    'CONTREP',
    'Continuation Report',
    'Continuation Report',
    10,
    true,
    'SYSTEM',
    now()
),
(
    'TASKACT',
    'Task Action',
    'Task Action',
    20,
    true,
    'SYSTEM',
    now()
);

ALTER TABLE investigation.activity_note
ADD COLUMN task_guid UUID;

ALTER TABLE investigation.activity_note ADD CONSTRAINT fk_activity_note_task FOREIGN KEY (task_guid) REFERENCES investigation.task (task_guid);

COMMENT ON COLUMN investigation.activity_note.task_guid IS 'Foreign key: System generated unique identifier for a task.';

ALTER TABLE investigation.activity_note 
ADD COLUMN activity_note_code VARCHAR(16);

UPDATE investigation.activity_note SET activity_note_code = 'CONTREP' WHERE activity_note_code IS NULL;

ALTER TABLE investigation.activity_note 
ALTER COLUMN activity_note_code SET NOT NULL;

ALTER TABLE investigation.activity_note
ADD CONSTRAINT fk_activity_note_code
FOREIGN KEY (activity_note_code)
REFERENCES activity_note_code (activity_note_code);

COMMENT ON COLUMN investigation.activity_note.activity_note_code IS 'Foreign key. Code representing the type task category.';