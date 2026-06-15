INSERT INTO approximate_age_code
    (approximate_age_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp)
VALUES
    ('18UNDER', '18 and under',      '18 years of age and under.',  1, true, 'FLYWAY', now()),
    ('19TO39',  '19 to 39 years',    '19 to 39 years of age.',      2, true, 'FLYWAY', now()),
    ('40TO59',  '40 to 59 years',    '40 to 59 years of age.',      3, true, 'FLYWAY', now()),
    ('60OVER',  '60 years and over', '60 years of age and over.',   4, true, 'FLYWAY', now())
ON CONFLICT (approximate_age_code) DO UPDATE SET
short_description = EXCLUDED.short_description,
long_description = EXCLUDED.long_description,
display_order = EXCLUDED.display_order,
active_ind = EXCLUDED.active_ind,
update_user_id = 'FLYWAY',
update_utc_timestamp = NOW();