INSERT INTO hair_colour_code
    (hair_colour_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp)
VALUES
    ('BLK', 'Black',                 'Black.',                                1, true, 'FLYWAY', now()),
    ('BLN', 'Blond',                 'Blond or strawberry.',                  2, true, 'FLYWAY', now()),
    ('BRO', 'Brown',                 'Brown.',                                3, true, 'FLYWAY', now()),
    ('GRY', 'Grey / partially grey', 'Gray or partially gray.',               4, true, 'FLYWAY', now()),
    ('RED', 'Red / auburn',          'Red or auburn.',                        5, true, 'FLYWAY', now()),
    ('SDY', 'Sandy',                 'Sandy.',                                6, true, 'FLYWAY', now()),
    ('WHI', 'White',                 'White.',                                7, true, 'FLYWAY', now()),
    ('OTH', 'Other',                 'Other hair colour not otherwise listed.', 8, true, 'FLYWAY', now())
ON CONFLICT (hair_colour_code) DO UPDATE SET
short_description = EXCLUDED.short_description,
long_description = EXCLUDED.long_description,
display_order = EXCLUDED.display_order,
active_ind = EXCLUDED.active_ind,
update_user_id = 'FLYWAY',
update_utc_timestamp = now();