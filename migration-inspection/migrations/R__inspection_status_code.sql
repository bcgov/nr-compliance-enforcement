---------------------------------
-- Inserts code table values into the inspection_status_code table
-- or if the Code already exists, updates the data
---------------------------------
INSERT INTO inspection.inspection_status_code (
    inspection_status_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp
) VALUES
    ('OPEN', 'Open', 'Open', 10, TRUE, 'FLYWAY', NOW()),
    ('CLOSED', 'Closed', 'Closed', 20, TRUE, 'FLYWAY', NOW())
ON CONFLICT (inspection_status_code) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    display_order = EXCLUDED.display_order,
    active_ind = EXCLUDED.active_ind,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = NOW();
