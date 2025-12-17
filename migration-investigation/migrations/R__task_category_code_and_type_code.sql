---------------------------------
-- Inserts code table values into the TASK_TYPE table
-- or if the Code already exists, updates the data
---------------------------------
INSERT INTO investigation.task_category_type_code (
    task_category_type_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp
) VALUES
    ('TEMPTYPE1', 'Type 1', 'Type 1', 10, TRUE, 'FLYWAY', NOW()),
    ('TEMPTYPE2', 'Type 2', 'Type 2', 20, TRUE, 'FLYWAY', NOW()),
    ('TEMPTYPE3', 'Type 3', 'Type 3', 30, TRUE, 'FLYWAY', NOW()),
    ('TEMPTYPE4', 'Type 4', 'Type 4', 40, TRUE, 'FLYWAY', NOW()),
    ('TEMPTYPE5', 'Type 5', 'Type 5', 50, TRUE, 'FLYWAY', NOW())
ON CONFLICT (task_category_type_code) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    display_order = EXCLUDED.display_order,
    active_ind = EXCLUDED.active_ind,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = NOW();

---------------------------------
-- Inserts code table values into the TASK_SUB_TYPE table
-- or if the Code already exists, updates the data
---------------------------------
INSERT INTO investigation.task_type_code (
    task_type_code, task_category_type_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp
) VALUES
    ('TEMPSUBTYPEA', 'TEMPTYPE1', 'Type a', 'Type a', 10, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPEB', 'TEMPTYPE1', 'Type b', 'Type b', 20, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPEC', 'TEMPTYPE1', 'Type c', 'Type c', 30, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPED', 'TEMPTYPE1', 'Type d', 'Type d', 40, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPEE', 'TEMPTYPE1', 'Type e', 'Type e', 50, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPEF', 'TEMPTYPE2', 'Type f', 'Type f', 60, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPEG', 'TEMPTYPE2', 'Type g', 'Type g', 70, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPEH', 'TEMPTYPE2', 'Type h', 'Type h', 80, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPEI', 'TEMPTYPE2', 'Type i', 'Type i', 90, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPEJ', 'TEMPTYPE2', 'Type j', 'Type j', 100, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPEK', 'TEMPTYPE3', 'Type k', 'Type k', 110, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPEL', 'TEMPTYPE3', 'Type l', 'Type l', 120, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPEM', 'TEMPTYPE3', 'Type m', 'Type m', 130, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPEN', 'TEMPTYPE3', 'Type n', 'Type n', 140, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPEO', 'TEMPTYPE3', 'Type o', 'Type o', 150, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPEP', 'TEMPTYPE4', 'Type p', 'Type p', 160, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPEQ', 'TEMPTYPE4', 'Type q', 'Type q', 170, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPER', 'TEMPTYPE4', 'Type r', 'Type r', 180, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPES', 'TEMPTYPE4', 'Type s', 'Type s', 190, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPET', 'TEMPTYPE4', 'Type t', 'Type t', 200, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPEU', 'TEMPTYPE5', 'Type u', 'Type u', 210, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPEV', 'TEMPTYPE5', 'Type v', 'Type v', 220, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPEW', 'TEMPTYPE5', 'Type w', 'Type w', 230, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPEX', 'TEMPTYPE5', 'Type x', 'Type x', 240, TRUE, 'FLYWAY', NOW()),
    ('TEMPSUBTYPEY', 'TEMPTYPE5', 'Type y', 'Type y', 250, TRUE, 'FLYWAY', NOW())
ON CONFLICT (task_type_code) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    display_order = EXCLUDED.display_order,
    active_ind = EXCLUDED.active_ind,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = NOW();