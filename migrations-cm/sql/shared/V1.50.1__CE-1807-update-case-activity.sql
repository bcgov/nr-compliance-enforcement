-- Update the case_activity table to accommodate for UUIDs in the reference ID col.
alter table shared.case_activity
alter column activity_identifier_ref type varchar(50);

ALTER TABLE shared.case_file
RENAME COLUMN status TO case_status;