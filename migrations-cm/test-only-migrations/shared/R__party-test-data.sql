INSERT INTO shared.party (party_guid,party_type,create_user_id,create_utc_timestamp,update_user_id,update_utc_timestamp) VALUES
	 ('827260a8-46b9-4a74-b30b-e9d64073483c','CMP','system',NOW(),'system',NOW()),
	 ('b5f45562-099d-44b5-9de3-13f1f98b1b9e','PRS','system',NOW(),'system',NOW())
ON CONFLICT DO NOTHING;
    
INSERT INTO shared.business (business_guid,"name",create_user_id,create_utc_timestamp,update_user_id,update_utc_timestamp,party_guid) VALUES
	 ('2754903f-a239-4323-a490-ae40b56f4a91','ABC Company','system',NOW(),'system',NOW(),'827260a8-46b9-4a74-b30b-e9d64073483c')
ON CONFLICT DO NOTHING;


INSERT INTO shared.person
(person_guid, first_name, middle_name, middle_name_2, last_name, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp, party_guid)
VALUES('865f1779-b472-445b-8fc0-b2e227a68be9', 'Antony', '', '', 'Rogers', 'system', NOW(), 'system', NOW(), 'b5f45562-099d-44b5-9de3-13f1f98b1b9e')
ON CONFLICT DO NOTHING;   
     