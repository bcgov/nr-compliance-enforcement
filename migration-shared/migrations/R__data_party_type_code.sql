INSERT INTO shared.party_type_code (party_type_code,short_description,long_description,display_order,active_ind,create_user_id,create_utc_timestamp,update_user_id,update_utc_timestamp) VALUES
	 ('CMP','Company','Company',1,true,'system',NOW(), NULL, NULL),
	 ('PRS','Person','Person',2,true,'system',NOW(), NULL,NULL)
   ON CONFLICT DO NOTHING;   