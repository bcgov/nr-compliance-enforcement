-- inserts the test user account.  This should not be migrated to prod.
insert into person (first_name, middle_name_1, middle_name_2, last_name, create_user_id, create_user_guid, create_timestamp, update_user_id, update_user_guid, update_timestamp)
values ('ENV', null, null, 'TestAcct', user, null, now(), user, null, now())
ON CONFLICT DO NOTHING;

-- create test officers
insert into officer(user_id, create_user_id, create_user_guid, create_timestamp, update_user_id, update_user_guid, update_timestamp, person_guid)
select 'ENVETST1', user, null, now(), user, null, now(), person_guid
from person where first_name = 'ENV' and last_name = 'TestAcct'
ON CONFLICT DO NOTHING;
