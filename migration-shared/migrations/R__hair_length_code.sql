INSERT INTO hair_length_code
    (hair_length_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp)
VALUES
    ('BALD',   'Bald',      'Bald.',               1, true, 'FLYWAY', now()),
    ('BUZZ',   'Buzz cut',  'Buzz cut.',           2, true, 'FLYWAY', now()),
    ('SHORT',  'Short',     'Short hair.',         3, true, 'FLYWAY', now()),
    ('MEDIUM', 'Medium',    'Medium-length hair.', 4, true, 'FLYWAY', now()),
    ('LONG',   'Long',      'Long hair.',          5, true, 'FLYWAY', now())
ON CONFLICT (hair_length_code) DO UPDATE SET
short_description = EXCLUDED.short_description,
long_description = EXCLUDED.long_description,
display_order = EXCLUDED.display_order,
active_ind = EXCLUDED.active_ind,
update_user_id = 'FLYWAY',
update_utc_timestamp = now();