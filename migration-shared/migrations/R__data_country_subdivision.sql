INSERT INTO shared.country_subdivision_code (country_subdivision_code,country_code,short_description,long_description,display_order,active_ind,create_user_id,create_utc_timestamp,update_user_id,update_utc_timestamp) VALUES
	 ('CA-AB','CA','Alberta','Alberta',10,true,'system',NOW(),NULL,NULL),
	 ('CA-BC','CA','British Columbia','British Columbia',20,true,'system',NOW(),NULL,NULL),
	 ('CA-MB','CA','Manitoba','Manitoba',30,true,'system',NOW(),NULL,NULL),
	 ('CA-NB','CA','New Brunswick','New Brunswick',40,true,'system',NOW(),NULL,NULL),
	 ('CA-NL','CA','Newfoundland and Labrador','Newfoundland and Labrador',50,true,'system',NOW(),NULL,NULL),
	 ('CA-NT','CA','Northwest Territories','Northwest Territories',60,true,'system',NOW(),NULL,NULL),
	 ('CA-NS','CA','Nova Scotia','Nova Scotia',70,true,'system',NOW(),NULL,NULL),
	 ('CA-NU','CA','Nunavut','Nunavut',80,true,'system',NOW(),NULL,NULL),
	 ('CA-ON','CA','Ontario','Ontario',90,true,'system',NOW(),NULL,NULL),
	 ('CA-PE','CA','Prince Edward Island','Prince Edward Island',100,true,'system',NOW(),NULL,NULL),
	 ('CA-QC','CA','Quebec','Quebec',110,true,'system',NOW(),NULL,NULL),
	 ('CA-SK','CA','Saskatchewan','Saskatchewan',120,true,'system',NOW(),NULL,NULL),
	 ('CA-YT','CA','Yukon','Yukon',130,true,'system',NOW(),NULL,NULL)
ON CONFLICT (country_subdivision_code) DO UPDATE SET
short_description = EXCLUDED.short_description,
long_description = EXCLUDED.long_description,
display_order = EXCLUDED.display_order,
active_ind = EXCLUDED.active_ind,
update_user_id = 'FLYWAY',
update_utc_timestamp = NOW();