INSERT INTO build_code
    (build_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp)
VALUES
    ('SL', 'Slender', 'Slender build.', 1, true, 'FLYWAY', now()),
    ('MD',  'Medium',  'Medium build.',  2, true, 'FLYWAY', now()),
    ('LG',   'Large',   'Large build.',   3, true, 'FLYWAY', now())
ON CONFLICT (build_code) DO UPDATE SET
short_description = EXCLUDED.short_description,
long_description = EXCLUDED.long_description,
display_order = EXCLUDED.display_order,
active_ind = EXCLUDED.active_ind,
update_user_id = 'FLYWAY',
update_utc_timestamp = now();