INSERT INTO shared.contact_method_type_code (
    contact_method_type_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp
) VALUES
    ('ALTPHONE1', 'Alternate phone 1', 'Alternate phone 1', 10, TRUE, 'FLYWAY', NOW()),
    ('ALTPHONE2', 'Alternate phone 2', 'Alternate phone 2', 20, TRUE, 'FLYWAY', NOW()),
    ('EMAILADDR', 'Email address', 'Email address', 30, TRUE, 'FLYWAY', NOW()),
    ('PRIMPHONE', 'Primary phone', 'Primary phone', 40, TRUE, 'FLYWAY', NOW())
ON CONFLICT (contact_method_type_code) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    display_order = EXCLUDED.display_order,
    active_ind = EXCLUDED.active_ind,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = NOW();
