CREATE TABLE
    investigation.exhibit (
        exhibit_guid UUID PRIMARY KEY DEFAULT public.uuid_generate_v4 (),
        task_guid UUID NOT NULL,
        investigation_guid UUID NOT NULL,
        exhibit_number INT NOT NULL,
        description TEXT NOT NULL,
        date_collected DATE NOT NULL DEFAULT CURRENT_DATE,
        collected_user_guid_ref UUID NOT NULL,
        active_ind BOOLEAN NOT NULL DEFAULT TRUE,
        create_user_id VARCHAR(32) NOT NULL,
        create_utc_timestamp timestamp without time zone DEFAULT now () NOT NULL,
        update_user_id VARCHAR(32),
        update_utc_timestamp timestamp without time zone,
        CONSTRAINT fk_exhibit__task FOREIGN KEY (task_guid) REFERENCES investigation.task (task_guid),
        CONSTRAINT fk_exhibit__investigation FOREIGN KEY (investigation_guid) REFERENCES investigation.investigation (investigation_guid),
        CONSTRAINT uq_exhibit_number_per_investigation UNIQUE (investigation_guid, exhibit_number)
    );

COMMENT ON TABLE investigation.exhibit IS 'An investigation task can have many exhibits. An exhibit is a physical or digital item collected as evidence during the course of an investigation task.';

COMMENT ON COLUMN investigation.exhibit.exhibit_guid IS 'Primary key. System generated unique key for exhibits. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN investigation.exhibit.task_guid IS 'Foreign key references investigation.task.task_guid. System generated unique key for tasks. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN investigation.exhibit.investigation_guid IS 'Foreign key references investigation.investigation.investigation_guid. Denormalized from task to support sequential exhibit numbering within an investigation. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN investigation.exhibit.exhibit_number IS 'System generated incremental exhibit number, sequential within the investigation. Generated via trigger on insert.';

COMMENT ON COLUMN investigation.exhibit.description IS 'A description of the exhibit collected during the investigation task.';

COMMENT ON COLUMN investigation.exhibit.date_collected IS 'The date the exhibit was collected. Defaults to the current date. Cannot be a future date.';

COMMENT ON COLUMN investigation.exhibit.collected_user_guid_ref IS 'Unenforced foreign key references shared.app_user_guid. GUID representing the officer that collected the exhibit. Defaults to the logged in user at time of creation. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN investigation.exhibit.active_ind IS 'A boolean indicator to determine if the exhibit is active. Inactive values are still retained in the system for legacy data integrity.';

COMMENT ON COLUMN investigation.exhibit.create_user_id IS 'The id of the user that created the exhibit record.';

COMMENT ON COLUMN investigation.exhibit.create_utc_timestamp IS 'The timestamp when the exhibit record was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN investigation.exhibit.update_user_id IS 'The id of the user that last updated the exhibit record.';

COMMENT ON COLUMN investigation.exhibit.update_utc_timestamp IS 'The timestamp when the exhibit record was last updated. The timestamp is stored in UTC with no offset.';