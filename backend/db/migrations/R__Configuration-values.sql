insert
	into
	configuration(configuration_code,
	configuration_value,
	long_description,
	active_ind,
	create_user_id,
	create_utc_timestamp,
	update_user_id,
	update_utc_timestamp)
values ('DFLTPAGNUM',
'50',
'The default number of rows per page when displaying lists within the application.',
true,
CURRENT_USER,
CURRENT_TIMESTAMP,
CURRENT_USER,
CURRENT_TIMESTAMP) ON CONFLICT DO NOTHING;

insert
	into
	configuration(configuration_code,
	configuration_value,
	long_description,
	active_ind,
	create_user_id,
	create_utc_timestamp,
	update_user_id,
	update_utc_timestamp)
values ('MAXFILESZ',
'5000',
'The maximum file size (in Megabytes) supported for upload.',
true,
CURRENT_USER,
CURRENT_TIMESTAMP,
CURRENT_USER,
CURRENT_TIMESTAMP) ON CONFLICT DO NOTHING;