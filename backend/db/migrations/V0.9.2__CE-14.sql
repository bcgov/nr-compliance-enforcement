-- public.agency_code definition
-- Drop table
-- DROP TABLE public.agency_code;

create table public.timezone_code (
	timezone_code varchar(10) not null,
-- A human readable code used to identify a timezone (e.g. MDT).
timezone_value varchar(50) not null,
-- The timezone name, also known as the metazone (e.g. Mountain Daylight Time).
long_description varchar(250) null,
-- The UTC offset of the timezone (e.g. UTC-6).
display_order int4 not null,
-- The order in which the values of the timezone code table should be displayed when presented to a user in a list.
active_ind bool not null,
-- A boolean indicator to determine if the timezone code is active.
create_user_id varchar(32) not null,
-- The id of the user that created the timezone code.
create_timestamp timestamp not null,
-- The timestamp when the timezone code was created.  The timestamp is stored in UTC with no Offset.
update_user_id varchar(32) not null,
-- The id of the user that updated the timezone code.
update_timestamp timestamp not null,
-- The timestamp when the timezone code was updated.  The timestamp is stored in UTC with no Offset.
	constraint "PK_timezonecode" primary key (timezone_code)
);

comment on
table public.timezone_code is 'A list of timezone codes, which are used to identify specific timezones in a standardized manner.';
-- Column comments

comment on
column public.timezone_code.timezone_code is 'A human readable code used to identify an timezone  (e.g. MDT).';

comment on
column public.timezone_code.timezone_value is 'The timezone name, also known as the metazone (e.g. Mountain Daylight Time).';

comment on
column public.timezone_code.long_description is 'The long description of the The UTC offset of the timezone (e.g. UTC-6)';

comment on
column public.timezone_code.display_order is 'The order in which the values of the timezone code table should be displayed when presented to a user in a list.';

comment on
column public.timezone_code.active_ind is 'A boolean indicator to determine if the timezone code is active.';

comment on
column public.timezone_code.create_user_id is 'The id of the user that created the timezone code.';

comment on
column public.timezone_code.create_timestamp is 'The timestamp when the timezone was created.  The timestamp is stored in UTC with no Offset.';

comment on
column public.timezone_code.update_user_id is 'The id of the user that updated the timezone code.';

comment on
column public.timezone_code.update_timestamp is 'The timestamp when the timezone was updated.  The timestamp is stored in UTC with no Offset.';

-- populate code table
insert
	into
	public.timezone_code (timezone_code,
	timezone_value,
	long_description,
	display_order,
	active_ind,
	create_user_id,
	create_timestamp,
	update_user_id,
	update_timestamp)
values ('MDT','Mountain Daylight Time','UTC-6',1,true,'FLYWAY',CURRENT_TIMESTAMP,'FLYWAY',CURRENT_TIMESTAMP),
	('MST','Mountain Standard Time','UTC-7',2,true,'FLYWAY',CURRENT_TIMESTAMP,'FLYWAY',CURRENT_TIMESTAMP),
	('PDT','Pacific Daylight Time','UTC-7',3,true,'FLYWAY',CURRENT_TIMESTAMP,'FLYWAY',CURRENT_TIMESTAMP),
	('PST','Pacific Standard Time','UTC-8',4,true,'FLYWAY',CURRENT_TIMESTAMP,'FLYWAY',CURRENT_TIMESTAMP);

-- rename the incident_utc_datetime column in the complaint table to incident_utc_datetime
-- Also add timezone_code.  We want these two columns to be together, so create the 
-- new columns at the end of the table, copy the data over to the new column,
-- rename the new column, and drop the old column
alter table public.complaint add column incident_utc_datetime_temp timestamp;
alter table public.complaint add column timezone_code varchar(10);

-- The data was stored with a PDT offset.  Change this to UTC by subtracting 7 hours
update public.complaint set incident_utc_datetime_temp = incident_utc_datetime  - interval '7 hours';

alter table public.complaint drop column incident_utc_datetime;

-- rename temp column to its final form
alter table public.complaint rename column incident_utc_datetime_temp to incident_utc_datetime;

-- popupulate the timezone codes, assume everything created up to this point was in PDT
update public.complaint set timezone_code = 'PDT';

comment on
column public.complaint.incident_utc_datetime is 'The date and time at which the complaint occurred, in UTC.';
comment on
column public.complaint.timezone_code is 'A human readable code used to identify an timezone  (e.g. MDT).';

