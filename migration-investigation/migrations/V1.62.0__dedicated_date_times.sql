ALTER TABLE activity_note
    ADD COLUMN actioned_utc_date DATE,
    ADD COLUMN actioned_utc_time TIME DEFAULT NULL;

ALTER TABLE investigation
    ADD COLUMN discovery_date_utc_date DATE,
    ADD COLUMN discovery_date_utc_time TIME DEFAULT NULL;

COMMENT ON COLUMN activity_note.actioned_utc_date IS 'The date when the report entry was actioned.';
COMMENT ON COLUMN activity_note.actioned_utc_time IS 'The time when the report entry was actioned.';

COMMENT ON COLUMN investigation.discovery_date_utc_date IS 'The date when the investigation was discovered.';
COMMENT ON COLUMN investigation.discovery_date_utc_time IS 'The time when the investigation was discovered.';
