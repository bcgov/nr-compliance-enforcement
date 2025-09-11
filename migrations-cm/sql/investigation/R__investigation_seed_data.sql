---------------------------------
-- Inserts code table values into the CASE_STATUS table
-- or if the Code already exists, updates the data
---------------------------------
INSERT INTO investigation.investigation_status_code (
    investigation_status_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp
) VALUES
    ('OPEN', 'Open', 'Open', 10, TRUE, 'FLYWAY', NOW()),
    ('CLOSED', 'Closed', 'Closed', 20, TRUE, 'FLYWAY', NOW())
ON CONFLICT (investigation_status_code) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    display_order = EXCLUDED.display_order,
    active_ind = EXCLUDED.active_ind,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = NOW();

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
);
