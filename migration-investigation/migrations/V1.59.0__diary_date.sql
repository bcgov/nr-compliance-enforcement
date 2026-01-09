CREATE TABLE
    investigation.diary_date (
        diary_date_guid uuid DEFAULT public.uuid_generate_v4 () NOT NULL PRIMARY KEY,
        investigation_guid uuid NOT NULL,
        due_date date NOT NULL,
        description character varying(4000) NOT NULL,
        active_ind boolean DEFAULT true NOT NULL,
        create_user_id character varying(32) NOT NULL,
        app_create_utc_timestamp timestamp without time zone NOT NULL,
        app_create_user_guid_ref uuid,
        app_update_utc_timestamp timestamp without time zone,
        app_update_user_guid_ref uuid,
        create_utc_timestamp timestamp without time zone DEFAULT now () NOT NULL,
        update_user_id character varying(32),
        update_utc_timestamp timestamp without time zone,
        CONSTRAINT fk_diary_date_investigation FOREIGN KEY (investigation_guid) REFERENCES investigation.investigation (investigation_guid)
    );

COMMENT ON TABLE investigation.diary_date IS 'A table that holds diary date entries for an investigation';

COMMENT ON COLUMN investigation.diary_date.diary_date_guid IS 'Primary key: System generated unique identifier for a diary date entry.';

COMMENT ON COLUMN investigation.diary_date.investigation_guid IS 'Foreign key: System generated unique identifier for an investigation';

COMMENT ON COLUMN investigation.diary_date.due_date IS 'The due date for the diary entry (date only, no time).';

COMMENT ON COLUMN investigation.diary_date.description IS 'Description of the diary date entry.';

COMMENT ON COLUMN investigation.diary_date.app_create_utc_timestamp IS 'The timestamp when the diary date was added. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN investigation.diary_date.app_create_user_guid_ref IS 'The foreign key reference to the app user who added the diary date.';

COMMENT ON COLUMN investigation.diary_date.app_update_utc_timestamp IS 'The timestamp when the diary date was last updated. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN investigation.diary_date.app_update_user_guid_ref IS 'The foreign key reference to the app user who last updated the diary date.';

COMMENT ON COLUMN investigation.diary_date.active_ind IS 'True if the diary date is active, false if it was deleted.';

COMMENT ON COLUMN investigation.diary_date.create_user_id IS 'The id of the user that created the record.';

COMMENT ON COLUMN investigation.diary_date.create_utc_timestamp IS 'The timestamp when the record was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN investigation.diary_date.update_user_id IS 'The id of the user that updated the record.';

COMMENT ON COLUMN investigation.diary_date.update_utc_timestamp IS 'The timestamp when the record was updated. The timestamp is stored in UTC with no offset.';