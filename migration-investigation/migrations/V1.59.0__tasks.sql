CREATE TABLE task_category_type_code  (
    task_category_type_code         VARCHAR(16) PRIMARY KEY  NOT NULL,
    short_description               VARCHAR(64) NOT NULL,
    long_description                VARCHAR(256),
    display_order                   INTEGER,
    active_ind                      BOOLEAN DEFAULT true NOT NULL,
    create_user_id                  VARCHAR(32) NOT NULL,
    create_utc_timestamp            TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    update_user_id                  VARCHAR(32),
    update_utc_timestamp            TIMESTAMP WITHOUT TIME ZONE
);

COMMENT ON TABLE task_category_type_code IS
    'Reference table defining categories of tasks.';

COMMENT ON COLUMN task_category_type_code.task_category_type_code IS
    'Primary key. Code representing the type of task category.';

COMMENT ON COLUMN task_category_type_code.short_description IS
    'The short description of the task category type code.  Used to store shorter versions of the long description when applicable.';

COMMENT ON COLUMN task_category_type_code.long_description IS
    'The long description of the task category type code.  May contain additional detail not typically displayed in the application.';

COMMENT ON COLUMN task_category_type_code.display_order IS
    'The order in which the values of the task category type code should be displayed when presented to a user in a list.  Originally incremented by 10s to allow for new values to be easily added.';

COMMENT ON COLUMN task_category_type_code.active_ind IS
    'A boolean indicator to determine if the task category type is active.  Inactive values are still retained in the system for legacy data integrity but are not valid choices for new data being added.';

COMMENT ON COLUMN task_category_type_code.create_user_id IS
    'The id of the user that created the task category type code.';

COMMENT ON COLUMN task_category_type_code.create_utc_timestamp IS
    'The timestamp when the task category type code was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN task_category_type_code.update_user_id IS
    'The id of the user that last updated the task category type code.';

COMMENT ON COLUMN task_category_type_code.update_utc_timestamp IS
    'The timestamp when the task type category code was last updated. The timestamp is stored in UTC with no offset.';

CREATE TABLE task_type_code  (
    task_type_code              VARCHAR(16) PRIMARY KEY  NOT NULL,
    task_category_type_code     VARCHAR(16) NOT NULL REFERENCES task_category_type_code (task_category_type_code),
    short_description           VARCHAR(64) NOT NULL,
    long_description            VARCHAR(256),
    display_order               INTEGER,
    active_ind                  BOOLEAN DEFAULT true NOT NULL,
    create_user_id              VARCHAR(32) NOT NULL,
    create_utc_timestamp        TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    update_user_id              VARCHAR(32),
    update_utc_timestamp        TIMESTAMP WITHOUT TIME ZONE
);

COMMENT ON TABLE task_type_code IS
    'Reference table defining types and categories of tasks types.';

COMMENT ON COLUMN task_type_code.task_type_code IS
    'Primary key. Code representing the type of task.';

COMMENT ON COLUMN task_type_code.task_category_type_code IS
    'Foreign key. Code representing the type task category.';

COMMENT ON COLUMN task_type_code.short_description IS
    'The short description of the task type code.  Used to store shorter versions of the long description when applicable.';

COMMENT ON COLUMN task_type_code.long_description IS
    'The long description of the task type code.  May contain additional detail not typically displayed in the application.';

COMMENT ON COLUMN task_type_code.display_order IS
    'The order in which the values of the task type code should be displayed when presented to a user in a list.  Originally incremented by 10s to allow for new values to be easily added.';

COMMENT ON COLUMN task_type_code.active_ind IS
    'A boolean indicator to determine if the task type is active.  Inactive values are still retained in the system for legacy data integrity but are not valid choices for new data being added.';

COMMENT ON COLUMN task_type_code.create_user_id IS
    'The id of the user that created the task type code.';

COMMENT ON COLUMN task_type_code.create_utc_timestamp IS
    'The timestamp when the task type code was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN task_type_code.update_user_id IS
    'The id of the user that last updated the task type code.';

COMMENT ON COLUMN task_type_code.update_utc_timestamp IS
    'The timestamp when the task type code was last updated. The timestamp is stored in UTC with no offset.';

CREATE TABLE task_status_code  (
    task_status_code                VARCHAR(16) PRIMARY KEY NOT NULL,
    short_description               VARCHAR(64) NOT NULL,
    long_description                VARCHAR(256),
    display_order                   INTEGER,
    active_ind                      BOOLEAN DEFAULT true NOT NULL,
    create_user_id                  VARCHAR(32) NOT NULL,
    create_utc_timestamp            TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    update_user_id                  VARCHAR(32),
    update_utc_timestamp            TIMESTAMP WITHOUT TIME ZONE
);

COMMENT ON TABLE task_status_code IS
    'Reference table defining task status types';

COMMENT ON COLUMN task_status_code.task_status_code IS
    'Primary key. Code representing the task status types.';

COMMENT ON COLUMN task_status_code.short_description IS
    'The short description of the task status code.  Used to store shorter versions of the long description when applicable.';

COMMENT ON COLUMN task_status_code.long_description IS
    'The long description of the task status code.  May contain additional detail not typically displayed in the application.';

COMMENT ON COLUMN task_status_code.display_order IS
    'The order in which the values of the task status code should be displayed when presented to a user in a list.  Originally incremented by 10s to allow for new values to be easily added.';

COMMENT ON COLUMN task_status_code.active_ind IS
    'A boolean indicator to determine if the task status is active.  Inactive values are still retained in the system for legacy data integrity but are not valid choices for new data being added.';

COMMENT ON COLUMN task_status_code.create_user_id IS
    'The id of the user that created the task status code.';

COMMENT ON COLUMN task_status_code.create_utc_timestamp IS
    'The timestamp when the task status code was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN task_status_code.update_user_id IS
    'The id of the user that last updated the task status code.';

COMMENT ON COLUMN task_status_code.update_utc_timestamp IS
    'The timestamp when the task status code was last updated. The timestamp is stored in UTC with no offset.';


CREATE TABLE task (
    task_guid                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_guid              UUID NOT NULL REFERENCES investigation (investigation_guid),
    task_type_code                  VARCHAR(16) NOT NULL REFERENCES task_type_code (task_type_code),
    task_status_code                VARCHAR(16) NOT NULL REFERENCES task_status_code (task_status_code),
    assigned_app_user_guid_ref      UUID,
    task_number                     INTEGER NOT NULL,
    description                     TEXT,
    active_ind                      BOOLEAN NOT NULL DEFAULT TRUE,
    create_user_id                  VARCHAR(32) NOT NULL,
    create_utc_timestamp            TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    update_user_id                  VARCHAR(32),
    update_utc_timestamp            TIMESTAMP WITHOUT TIME ZONE
);

ALTER TABLE task
ADD CONSTRAINT unique_task_number_per_investigation UNIQUE (investigation_guid, task_number);

COMMENT ON TABLE task IS
    'An investigation can have many tasks. A task is a major action taken on an investigation by an investigator.';

COMMENT ON COLUMN task.task_guid IS
    'Primary key. System generated unique key for tasks. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN task.investigation_guid IS
    'Foreign key references investigation.investigation_guid. System generated unique key for investigations. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN task.task_type_code IS
    'Foreign key references task_type_code.task_type_code. Code representing the task type. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN task.task_status_code IS
    'Foreign key references task_status_code.task_status_code. Code representing the task status. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN task.assigned_app_user_guid_ref IS
    'Uneforced foreign key references shared.app_userapp_user_guid. GUID representing the officer assigned to the task. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN task.task_number IS
    'System generated incremental task number';

COMMENT ON COLUMN task.description IS
    'A description of the work required to complete the task';

COMMENT ON COLUMN task.active_ind IS
    'A boolean indicator to determine if the task is active.  Inactive values are still retained in the system for legacy data integrity';

COMMENT ON COLUMN task.create_user_id IS
    'The id of the user that created the task.';

COMMENT ON COLUMN task.create_utc_timestamp IS
    'The timestamp when the task was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN task.update_user_id IS
    'The id of the user that last updated the task.';

COMMENT ON COLUMN task.update_utc_timestamp IS
    'The timestamp when the task was last updated. The timestamp is stored in UTC with no offset.';

CREATE TABLE task_h (
    h_task_guid                     uuid PRIMARY KEY DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id                   uuid NOT NULL,
    operation_type                  CHARACTER(1) NOT NULL,
    operation_user_id               VARCHAR(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at           TIMESTAMP WITHOUT TIME ZONE DEFAULT now () NOT NULL,
    data_after_executed_operation   JSONB
  );

COMMENT ON TABLE task_h IS 'History table for task table';

COMMENT ON COLUMN task_h.h_task_guid IS 'System generated unique key for task history. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN task_h.target_row_id IS 'The unique key for the task that has been created or modified.';

COMMENT ON COLUMN task_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT ON COLUMN task_h.operation_user_id IS 'The id of the user that created or modified the data in the task table. Defaults to the logged in user if not passed in by the application.';

COMMENT ON COLUMN task_h.operation_executed_at IS 'The timestamp when the data in the task table was created or modified. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN task_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully. This implies that the latest row in the audit table will always match with the current row in the live table.';

CREATE TRIGGER task_history_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON task FOR EACH ROW EXECUTE FUNCTION audit_history ('task_h', 'task_guid');
