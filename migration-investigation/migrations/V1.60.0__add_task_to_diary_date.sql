ALTER TABLE investigation.diary_date
ADD COLUMN task_guid UUID;

ALTER TABLE investigation.diary_date ADD CONSTRAINT fk_diary_date_task FOREIGN KEY (task_guid) REFERENCES investigation.task (task_guid);

COMMENT ON COLUMN investigation.diary_date.task_guid IS 'Foreign key: System generated unique identifier for a task.';