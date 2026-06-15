INSERT INTO eye_colour_code
    (eye_colour_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp)
VALUES
    ('AMBER', 'Amber',         'Amber.',                                 1, true, 'FLYWAY', now()),
    ('BLU',   'Blue',          'Blue.',                                  2, true, 'FLYWAY', now()),
    ('BRO',   'Brown',         'Brown.',                                 3, true, 'FLYWAY', now()),
    ('GRY',   'Grey',          'Gray.',                                  4, true, 'FLYWAY', now()),
    ('GRN',   'Green',         'Green.',                                 5, true, 'FLYWAY', now()),
    ('HAZ',   'Hazel',         'Hazel.',                                 6, true, 'FLYWAY', now()),
    ('MUL',   'Multicoloured', 'Multicoloured.',                          7, true, 'FLYWAY', now()),
    ('OTH',   'Other',         'Other eye colour not otherwise listed.', 8, true, 'FLYWAY', now())
ON CONFLICT (eye_colour_code) DO UPDATE SET
short_description = EXCLUDED.short_description,
long_description = EXCLUDED.long_description,
display_order = EXCLUDED.display_order,
active_ind = EXCLUDED.active_ind,
update_user_id = 'FLYWAY',
update_utc_timestamp = now();