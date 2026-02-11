INSERT INTO business_identifier_code (
    business_identifier_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp)VALUES
  ('BNUM', 'Business Number', 'CRA Business Number (BN)', 10, true, 'system', NOW(), NULL, NULL),
  ('WSBC', 'WorkSafeBC Number', 'WorkSafeBC Number', 20, true, 'system', NOW(), NULL, NULL)
ON CONFLICT (business_identifier_code) DO UPDATE SET
short_description = EXCLUDED.short_description,
long_description = EXCLUDED.long_description,
display_order = EXCLUDED.display_order,
active_ind = EXCLUDED.active_ind,
update_user_id = 'FLYWAY',
update_utc_timestamp = NOW();
