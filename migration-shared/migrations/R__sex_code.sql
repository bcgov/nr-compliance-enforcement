INSERT INTO sex_code
    (sex_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp)
VALUES
    ('M', 'Male',    'Male',                            1, true, 'FLYWAY', now()),
    ('F', 'Female',  'Female',                          2, true, 'FLYWAY', now()),
    ('U', 'Unknown', 'Unknown',                         3, true, 'FLYWAY', now()),
    ('X', 'X',       'Unspecified or another gender',   4, true, 'FLYWAY', now())
ON CONFLICT (sex_code) DO UPDATE SET
short_description = EXCLUDED.short_description,
long_description = EXCLUDED.long_description,
display_order = EXCLUDED.display_order,
active_ind = EXCLUDED.active_ind,
update_user_id = 'FLYWAY',
update_utc_timestamp = NOW();
