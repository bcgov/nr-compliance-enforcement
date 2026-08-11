---------------------------------
-- CE-2337 Remove task sub-categories and rebuild the task category list
---------------------------------
-- Drop the sub-category
ALTER TABLE investigation.task
DROP COLUMN IF EXISTS task_type_code;

DROP TABLE IF EXISTS investigation.task_type_code;

-- path over the existing poc data
UPDATE investigation.task
SET
    task_category_type_code = 'ADMIN',
    update_user_id = 'FLYWAY',
    update_utc_timestamp = NOW ()
WHERE
    task_category_type_code <> 'ADMIN';

-- clear out poc categories and repeatable will add new ones
DELETE FROM investigation.task_category_type_code
WHERE
    task_category_type_code <> 'ADMIN';
