-- Rename the continuation_report table
ALTER TABLE investigation.continuation_report
RENAME TO activity_note;

ALTER TABLE investigation.activity_note
RENAME COLUMN continuation_report_guid TO activity_note_guid;

ALTER TABLE investigation.activity_note
RENAME CONSTRAINT continuation_report_pkey TO activity_note_pkey;