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


INSERT INTO shared.party (party_guid,party_type,create_user_id,create_utc_timestamp,update_user_id,update_utc_timestamp) VALUES
   ('6c65e099-7c32-429b-abdf-c5ccda9c9779','PRS','system',NOW(),'system',NOW()),
   ('4f5a201a-fbdd-40db-9da1-119d465ce204','PRS','system',NOW(),'system',NOW()),
   ('21e5d3ba-a4b1-4d19-8c8a-147d8d5cba49','PRS','system',NOW(),'system',NOW()),
   ('15f6d336-c98e-4165-93e9-f3cad6f11b18','PRS','system',NOW(),'system',NOW()),
   ('edf23f0f-e6fd-49aa-84f1-ac57f4931dfd','PRS','system',NOW(),'system',NOW()),
   ('2f219a8a-825a-43f8-84b8-ac0895adaad6','PRS','system',NOW(),'system',NOW()),
   ('b926c308-f2c3-42b7-a0ff-b635a954141a','PRS','system',NOW(),'system',NOW()),
   ('071d03d0-d3d8-488a-8660-d01b59d07b02','PRS','system',NOW(),'system',NOW()),
   ('6f03b8ea-e389-4f80-9af0-19b2a52b4424','PRS','system',NOW(),'system',NOW()),
   ('3f514e91-0c25-471e-af65-d337aedab196','PRS','system',NOW(),'system',NOW()),
   ('6532c891-afa2-444b-a7ef-e19fef8a1340','PRS','system',NOW(),'system',NOW()),
   ('d7f734a3-988c-4420-945f-60e5a3c2f43f','PRS','system',NOW(),'system',NOW()),
   ('fb845379-e684-4598-9bed-ed9b81e51f41','PRS','system',NOW(),'system',NOW()),
   ('f3cb9906-e50a-48ca-93b3-5d21eb54eafb','PRS','system',NOW(),'system',NOW()),
	 ('a5b8fad3-28cf-48b1-af7a-05d0c91fa4d9','CMP','system',NOW(),'system',NOW()),
	 ('d8dd356d-db4d-4aed-9ca3-cb8ec02e87f4','CMP','system',NOW(),'system',NOW()),
	 ('ca147576-5c02-414f-ae36-4eb49473bcb2','CMP','system',NOW(),'system',NOW()),
	 ('191e012a-1fe9-4470-afb7-06f02613177c','CMP','system',NOW(),'system',NOW()),
	 ('ebf4ad07-63d8-43e8-ad53-6b65fb3a0e08','CMP','system',NOW(),'system',NOW()),
	 ('53bf7854-d7f1-4dff-9e63-95e15c6c02e7','CMP','system',NOW(),'system',NOW()),
	 ('c204f78e-e19a-4587-82e7-960d9cae75bc','CMP','system',NOW(),'system',NOW()),
	 ('7a81353b-dfb8-44a8-bcd9-b1e2261b476d','CMP','system',NOW(),'system',NOW()),
	 ('5f7ab3df-c97a-4401-bd89-63dd539edf53','CMP','system',NOW(),'system',NOW()),
	 ('b6205a63-1d7f-4414-a2ae-54e261285718','CMP','system',NOW(),'system',NOW()),
	 ('5a443cd2-08c4-457a-960f-62320e13ba12','CMP','system',NOW(),'system',NOW()),
	 ('6cd6c06b-0bba-4ce2-88af-d3e4e8a628f6','CMP','system',NOW(),'system',NOW()),
	 ('e0b68653-e7da-4ea5-826a-41ed37c31fd6','CMP','system',NOW(),'system',NOW()),
	 ('52a8a304-c20b-4cd1-8ee9-40cdfb5dc6f3','CMP','system',NOW(),'system',NOW())
ON CONFLICT DO NOTHING;


INSERT INTO shared.business (business_guid,"name",create_user_id,create_utc_timestamp,update_user_id,update_utc_timestamp,party_guid) VALUES
	 ('327783f6-27ae-4088-9af5-8a0250068b2e','Nexus','system' ,NOW(),'system' ,NOW(),'a5b8fad3-28cf-48b1-af7a-05d0c91fa4d9'),
	 ('70b8a98d-9bbc-4631-905a-c142f06fc500','Festivo','system' ,NOW(),'system' ,NOW(),'d8dd356d-db4d-4aed-9ca3-cb8ec02e87f4'),
	 ('014f2cef-a1ab-4ef0-8cfd-15a5f347d5d5','Elysium','system' ,NOW(),'system' ,NOW(),'ca147576-5c02-414f-ae36-4eb49473bcb2'),
	 ('6a18a4fb-3d53-46f4-88c5-d3e0c9fd1ec8','Epicenter','system' ,NOW(),'system' ,NOW(),'191e012a-1fe9-4470-afb7-06f02613177c'),
	 ('0f70a30d-63ca-4eb5-bb21-a5e68c5d0275','Chronicle','system' ,NOW(),'system' ,NOW(),'ebf4ad07-63d8-43e8-ad53-6b65fb3a0e08'),
	 ('c8b00439-30f0-430b-b1e6-866e580f54b8','Eventure','system' ,NOW(),'system' ,NOW(),'53bf7854-d7f1-4dff-9e63-95e15c6c02e7'),
	 ('044cea22-ad5e-47a8-9283-3ffd2e8b6044','Empower','system' ,NOW(),'system' ,NOW(),'c204f78e-e19a-4587-82e7-960d9cae75bc'),
	 ('1dbbdbb6-c74f-45c3-afc4-1b718258bf76','Vigor','system' ,NOW(),'system' ,NOW(),'7a81353b-dfb8-44a8-bcd9-b1e2261b476d'),
	 ('7f228c72-97da-4208-8815-f1b01943d977','Holistic Harmony','system' ,NOW(),'system' ,NOW(),'5f7ab3df-c97a-4401-bd89-63dd539edf53'),
	 ('ebdc619d-558d-4b2d-a463-8518b6bd6a9a','Pure Health Path','system' ,NOW(),'system' ,NOW(),'b6205a63-1d7f-4414-a2ae-54e261285718'),
	 ('38c18a99-28c4-4e47-ae7d-10ddefaf8727','Wholesome Wellness','system' ,NOW(),'system' ,NOW(),'5a443cd2-08c4-457a-960f-62320e13ba12'),
	 ('8ab06618-f927-4ed6-a703-9f4d63a09393','Essence','system' ,NOW(),'system' ,NOW(),'6cd6c06b-0bba-4ce2-88af-d3e4e8a628f6'),
	 ('49c6a8a7-c021-42b7-ac8d-a23eb6eece6c','Aegis','system' ,NOW(),'system' ,NOW(),'e0b68653-e7da-4ea5-826a-41ed37c31fd6'),
	 ('96dd6bac-6638-4f00-a886-2af658e4622e','Revital','system' ,NOW(),'system' ,NOW(),'52a8a304-c20b-4cd1-8ee9-40cdfb5dc6f3')
   ON CONFLICT DO NOTHING;



INSERT INTO shared.person (person_guid,first_name,middle_name,middle_name_2,last_name,create_user_id,create_utc_timestamp,update_user_id,update_utc_timestamp,party_guid) VALUES
	 ('a80ec49d-ebbe-4642-a730-6778b79e8401','Michael',NULL,NULL,'Scott','system',NOW(),'system',NOW(),'6c65e099-7c32-429b-abdf-c5ccda9c9779'),
	 ('453ce7f8-0ddb-4fa8-8d84-1ac749e75b6a','Selma',NULL,NULL,'Berger','system',NOW(),'system',NOW(),'4f5a201a-fbdd-40db-9da1-119d465ce204'),
	 ('9602e6c9-277c-4f14-aca2-ccee7c951034','Emerson',NULL,NULL,'Higgins','system',NOW(),'system',NOW(),'21e5d3ba-a4b1-4d19-8c8a-147d8d5cba49'),
	 ('854e0e79-bf6a-4cd5-9333-61715d341dc6','Elijah',NULL,NULL,'Travis','system',NOW(),'system',NOW(),'15f6d336-c98e-4165-93e9-f3cad6f11b18'),
	 ('9c55db2f-8e08-4b57-a583-41ee4b0419b6','Jared',NULL,NULL,'Curtis','system',NOW(),'system',NOW(),'edf23f0f-e6fd-49aa-84f1-ac57f4931dfd'),
	 ('e4273e82-808f-4e1f-982e-083e8ff492c0','Juliet',NULL,NULL,'Conrad','system',NOW(),'system',NOW(),'2f219a8a-825a-43f8-84b8-ac0895adaad6'),
	 ('05dff431-f812-4f78-99bb-524b19211c5d','Jeffrey',NULL,NULL,'Clayton','system',NOW(),'system',NOW(),'b926c308-f2c3-42b7-a0ff-b635a954141a'),
	 ('b08e7932-ab12-474a-b105-53cba16b510a','Jay',NULL,NULL,'Lopez','system',NOW(),'system',NOW(),'071d03d0-d3d8-488a-8660-d01b59d07b02'),
	 ('a3ba4d5d-396b-41dd-bbf7-2b37047bde47','Dewayne',NULL,NULL,'Ewing','system',NOW(),'system',NOW(),'6f03b8ea-e389-4f80-9af0-19b2a52b4424'),
	 ('c5c27af6-48d0-4dfa-9305-0206260e0291','Stella',NULL,NULL,'Khan','system',NOW(),'system',NOW(),'3f514e91-0c25-471e-af65-d337aedab196'),
	 ('ddb322f3-d0bb-4888-b647-aa31e91b60a8','Joan',NULL,NULL,'Matthews','system',NOW(),'system',NOW(),'d7f734a3-988c-4420-945f-60e5a3c2f43f'),
	 ('444037f1-8a70-45df-94f8-743127836c1b','Gustavo',NULL,NULL,'Smith','system',NOW(),'system',NOW(),'fb845379-e684-4598-9bed-ed9b81e51f41'),
	 ('1b0adb9b-9d9f-4f8e-aeab-684dd88fe8c9','Mary',NULL,NULL,'Randall','system',NOW(),'system',NOW(),'f3cb9906-e50a-48ca-93b3-5d21eb54eafb')
ON CONFLICT DO NOTHING;   