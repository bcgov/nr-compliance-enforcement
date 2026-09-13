INSERT INTO party_external_id_code (
    party_external_id_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp)VALUES
  ('FWID', 'Fish and wildlife ID', 'BC Fish and Wildlife ID (FWID)', 10, true, 'system', NOW(), NULL, NULL),
  ('CLID', 'Client number', 'Natural resource sector client number', 20, true, 'system', NOW(), NULL, NULL),
  ('WIN', 'Winchester number', 'Winchester number', 30, true, 'system', NOW(), NULL, NULL),
  ('CORE', 'CORE number', 'Consumer afforestation / CORE number', 40, true, 'system', NOW(), NULL, NULL),
  ('SIN', 'Status Indian number', 'Indigenous Services Canada registry number', 50, true, 'system', NOW(), NULL, NULL),
  ('FPS', 'Fingerprint serial number', 'RCMP fingerprint serial number', 60, true, 'system', NOW(), NULL, NULL)
ON CONFLICT (party_external_id_code) DO UPDATE SET
short_description = EXCLUDED.short_description,
long_description = EXCLUDED.long_description,
display_order = EXCLUDED.display_order,
active_ind = EXCLUDED.active_ind,
update_user_id = 'FLYWAY',
update_utc_timestamp = NOW();
