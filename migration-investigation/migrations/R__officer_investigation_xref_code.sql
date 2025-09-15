-- Add assignee to code table
insert into investigation.officer_investigation_xref_code (
  officer_investigation_xref_code,
	short_description,
  long_description,
  display_order,
  create_user_id,
  create_utc_timestamp,
  update_user_id,
  update_utc_timestamp,
  active_ind
) values(
  'ASSIGNEE',
  'Officer assigned',
  'The officer to whom the investigation is assigned.',
  1,
  user,
  now(),
  user,
  now(),
  true
) ON CONFLICT (officer_investigation_xref_code) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    display_order = EXCLUDED.display_order,
    active_ind = EXCLUDED.active_ind,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = NOW();
