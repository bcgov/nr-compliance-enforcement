-- Rename task remarks column to subject
ALTER TABLE investigation.task
RENAME COLUMN remarks TO subject;

COMMENT ON COLUMN investigation.task.subject IS 'The subject for a task.';
