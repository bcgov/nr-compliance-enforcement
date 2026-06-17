INSERT INTO gender_code
    (gender_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp)
VALUES
    ('MN', 'Man/boy',    'Man or boy.',    1, true, 'FLYWAY', now()),
    ('NB', 'Non-binary', 'Non-binary.',    2, true, 'FLYWAY', now()),
    ('WM', 'Woman/girl', 'Woman or girl.', 3, true, 'FLYWAY', now())
ON CONFLICT (gender_code) DO UPDATE SET
short_description = EXCLUDED.short_description,
long_description = EXCLUDED.long_description,
display_order = EXCLUDED.display_order,
active_ind = EXCLUDED.active_ind,
update_user_id = 'FLYWAY',
update_utc_timestamp = NOW();