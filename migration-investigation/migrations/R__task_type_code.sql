---------------------------------
-- Inserts code table values into the TASK_TYPE table
-- or if the Code already exists, updates the data
---------------------------------
INSERT INTO investigation.task_type_code (
    task_type_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp
) VALUES
    ('TEMPTYPE1', 'Type 1', 'Type 1', 10, TRUE, 'FLYWAY', NOW()),
    ('TEMPTYPE2', 'Type 2', 'Type 2', 20, TRUE, 'FLYWAY', NOW()),
    ('TEMPTYPE3', 'Type 3', 'Type 3', 30, TRUE, 'FLYWAY', NOW()),
    ('TEMPTYPE4', 'Type 4', 'Type 4', 40, TRUE, 'FLYWAY', NOW()),
    ('TEMPTYPE5', 'Type 5', 'Type 5', 50, TRUE, 'FLYWAY', NOW())
ON CONFLICT (task_type_code) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    display_order = EXCLUDED.display_order,
    active_ind = EXCLUDED.active_ind,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = NOW();