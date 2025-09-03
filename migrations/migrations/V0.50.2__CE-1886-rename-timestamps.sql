ALTER TABLE linked_complaint_xref_type_code
RENAME COLUMN create_timestamp TO create_utc_timestamp;

ALTER TABLE linked_complaint_xref_type_code
RENAME COLUMN update_timestamp TO update_utc_timestamp;

COMMENT ON COLUMN linked_complaint_xref_type_code.create_utc_timestamp IS 'The timestamp when the linked complaint type code was created.  The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN linked_complaint_xref_type_code.update_utc_timestamp IS 'The timestamp when the linked complaint type code was updated.  The timestamp is stored in UTC with no Offset.';