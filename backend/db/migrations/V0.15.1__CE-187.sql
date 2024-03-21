INSERT
	INTO
	configuration (configuration_code,
	configuration_value,
	long_description,
	active_ind,
	create_user_id,
	create_utc_timestamp,
	update_user_id,
	update_utc_timestamp)
VALUES ('CDTABLEVER',
  '1',
  'The current version of the application stored in the database.   Will be incremented by 1 with each  change to signal to the application cache that the values of the code tables should be refreshed.',
  true,
  CURRENT_USER,
  CURRENT_TIMESTAMP,
  CURRENT_USER,
  CURRENT_TIMESTAMP) 
ON CONFLICT DO NOTHING;