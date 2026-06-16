INSERT INTO facial_hair_style_code
    (facial_hair_style_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp)
VALUES
    ('CIRBRD', 'Circle beard', 'Circle beard.', 1, true, 'FLYWAY', now()),
    ('FLLBRD',   'Full beard',   'Full beard.',   2, true, 'FLYWAY', now()),
    ('GOATEE',      'Goatee',       'Goatee.',       3, true, 'FLYWAY', now()),
    ('MUSTCH',    'Mustache',     'Mustache.',     4, true, 'FLYWAY', now()),
    ('SDEBRN',   'Side burns',   'Side burns.',   5, true, 'FLYWAY', now()),
    ('SLPTCH',   'Soul patch',   'Soul patch.',   6, true, 'FLYWAY', now())
ON CONFLICT (facial_hair_style_code) DO UPDATE SET
short_description = EXCLUDED.short_description,
long_description = EXCLUDED.long_description,
display_order = EXCLUDED.display_order,
active_ind = EXCLUDED.active_ind,
update_user_id = 'FLYWAY',
update_utc_timestamp = now();