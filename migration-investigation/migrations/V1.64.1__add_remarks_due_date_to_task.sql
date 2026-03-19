-- Add task_category_type_code column to task table
ALTER TABLE investigation.task
ADD COLUMN task_category_type_code VARCHAR(16) REFERENCES investigation.task_category_type_code (task_category_type_code);

-- Populate it from the existing task_type_code's parent category
UPDATE investigation.task t
SET
  task_category_type_code = ttc.task_category_type_code
FROM
  investigation.task_type_code ttc
WHERE
  t.task_type_code = ttc.task_type_code;

-- Enforce NOT NULL on the task_category_type_code
ALTER TABLE investigation.task
ALTER COLUMN task_category_type_code
SET
  NOT NULL;

-- Make task_type_code nullable
ALTER TABLE investigation.task
ALTER COLUMN task_type_code
DROP NOT NULL;

-- Add remarks, due_date columns to task table
ALTER TABLE investigation.task
ADD COLUMN remarks VARCHAR(256) NOT NULL DEFAULT '',
ADD COLUMN due_date DATE NOT NULL DEFAULT CURRENT_DATE;

COMMENT ON COLUMN investigation.task.due_date IS 'The due date for a task.';

COMMENT ON COLUMN investigation.task.remarks IS 'The remarks for a task.';

COMMENT ON COLUMN investigation.task.task_category_type_code IS 'The category for a task.';