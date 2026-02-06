INSERT INTO shared.party_type_code (party_type_code,short_description,long_description,display_order,active_ind,create_user_id,create_utc_timestamp,update_user_id,update_utc_timestamp) VALUES
	 ('CMP','Company','Company',10,true,'system',NOW(), NULL, NULL),
	 ('PRS','Person','Person',20,true,'system',NOW(), NULL,NULL),
	 ('CNT','Contact','Company Contact',30,true,'system',NOW(), NULL,NULL)
ON CONFLICT (party_type_code) DO UPDATE SET
short_description = EXCLUDED.short_description,
long_description = EXCLUDED.long_description,
display_order = EXCLUDED.display_order,
active_ind = EXCLUDED.active_ind,
update_user_id = 'FLYWAY',
update_utc_timestamp = NOW();