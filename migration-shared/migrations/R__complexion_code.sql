INSERT INTO complexion_code
    (complexion_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp)
VALUES
    ('ALB',      'Albino',         'Albino complexion.',        1,  true, 'FLYWAY', now()),
    ('BLK',       'Black',          'Black complexion.',         2,  true, 'FLYWAY', now()),
    ('LBR',  'Brown (light)',  'Light brown complexion.',   3,  true, 'FLYWAY', now()),
    ('MBR', 'Brown (medium)', 'Medium brown complexion.',  4,  true, 'FLYWAY', now()),
    ('DBR',   'Brown (dark)',   'Dark brown complexion.',    5,  true, 'FLYWAY', now()),
    ('DRK',        'Dark',           'Dark complexion.',          6,  true, 'FLYWAY', now()),
    ('FAR',        'Fair',           'Fair complexion.',          7,  true, 'FLYWAY', now()),
    ('LGT',       'Light',          'Light complexion.',         8,  true, 'FLYWAY', now()),
    ('MED',      'Medium',         'Medium complexion.',        9,  true, 'FLYWAY', now()),
    ('OLV',       'Olive',          'Olive complexion.',         10, true, 'FLYWAY', now()),
    ('RUD',       'Ruddy',          'Ruddy complexion.',         11, true, 'FLYWAY', now()),
    ('SAL',      'Sallow',         'Sallow complexion.',        12, true, 'FLYWAY', now()),
    ('YEL',      'Yellow',         'Yellow complexion.',        13, true, 'FLYWAY', now())
ON CONFLICT (complexion_code) DO UPDATE SET
short_description = EXCLUDED.short_description,
long_description = EXCLUDED.long_description,
display_order = EXCLUDED.display_order,
active_ind = EXCLUDED.active_ind,
update_user_id = 'FLYWAY',
update_utc_timestamp = now();