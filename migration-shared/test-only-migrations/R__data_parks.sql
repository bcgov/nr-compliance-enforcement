-- Insert Park Test Data
insert into shared.park ("external_id", "name", "create_user_id", "update_user_id") 
values ('0001', 'Strathcona Park - Lindsay Loop', 'system', 'system')
on conflict do nothing;
insert into shared.park ("external_id", "name", "create_user_id", "update_user_id") 
values ('0010', 'Inonoaklin Park', 'system', 'system')
on conflict do nothing;
insert into shared.park ("external_id", "name", "create_user_id", "update_user_id") 
values ('1000', 'Hunwadi/Ahnuhati-Bald Conservancy', 'system', 'system')
on conflict do nothing;
insert into shared.park ("external_id", "name", "create_user_id", "update_user_id") 
values ('0073', 'sx̌ʷəx̌ʷnitkʷ Park', 'system', 'system')
on conflict do nothing;