---------------------------------
-- Inserts code table values into the CASE_ACTIVITY_TYPE_CODE table
-- or if the Code already exists, updates the data
---------------------------------
INSERT INTO shared.case_activity_type_code (
    case_activity_type_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp
) VALUES
    ('COMP', 'Complaint', 'Complaint', 10, TRUE, 'FLYWAY', NOW()),
    ('INVSTGTN', 'Investigation', 'Investigation', 20, TRUE, 'FLYWAY', NOW())
ON CONFLICT (case_activity_type_code) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    display_order = EXCLUDED.display_order,
    active_ind = EXCLUDED.active_ind,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = NOW();
