CREATE TABLE
    investigation.continuation_report (
        continuation_report_guid uuid DEFAULT public.uuid_generate_v4 () NOT NULL PRIMARY KEY,
        investigation_guid uuid NOT NULL,
        content_json JSONB NOT NULL,
        content_text TEXT,
        actioned_utc_timestamp timestamp without time zone,
        actioned_app_user_guid_ref uuid,
        reported_utc_timestamp timestamp without time zone,
        reported_app_user_guid_ref uuid,
        active_ind boolean default true NOT NULL,
        create_user_id character varying(32) NOT NULL,
        create_utc_timestamp timestamp without time zone DEFAULT now () NOT NULL,
        update_user_id character varying(32),
        update_utc_timestamp timestamp without time zone,
        CONSTRAINT fk_investigation_guid FOREIGN KEY (investigation_guid) REFERENCES investigation.investigation (investigation_guid)
    );

COMMENT ON TABLE continuation_report IS 'A table that holds report entries for an investigation report';

COMMENT ON COLUMN continuation_report.investigation_guid IS 'Foreign key: System generated unique identifier for an inspection';

COMMENT ON COLUMN continuation_report.continuation_report_guid IS 'Primary key: System generated unique identifier for a report entry.';

COMMENT ON COLUMN continuation_report.content_json IS 'The content of the report entry in JSONB format.';

COMMENT ON COLUMN continuation_report.content_text IS 'The content of the report entry in plain text format.';

COMMENT ON COLUMN continuation_report.actioned_utc_timestamp IS 'The timestamp when the report entry was actioned. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN continuation_report.actioned_app_user_guid_ref IS 'The foreign key reference to the app user who actioned the report entry.';

COMMENT ON COLUMN continuation_report.reported_utc_timestamp IS 'The timestamp when the report entry was reported. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN continuation_report.reported_app_user_guid_ref IS 'The foreign key reference to the app user who reported the report entry.';

COMMENT ON COLUMN continuation_report.active_ind IS 'True if the report entry is currently attached to the investigation, false if it was previously attached and then removed.';

COMMENT ON COLUMN continuation_report.create_user_id IS 'The id of the user that created the report.';

COMMENT ON COLUMN continuation_report.create_utc_timestamp IS 'The timestamp when the report was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN continuation_report.update_user_id IS 'The id of the user that updated the report.';

COMMENT ON COLUMN continuation_report.update_utc_timestamp IS 'The timestamp when the report was updated. The timestamp is stored in UTC with no offset.';