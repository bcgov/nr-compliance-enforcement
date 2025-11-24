-- ---------------------
-- Initial Data
-- This can't be a re-runnable script as it relies on generated GUIDs
-- ---------------------

INSERT INTO legislation (
    legislation_guid,
    legislation_type_code,
    parent_legislation_guid,
    citation,
    full_citation,
    section_title,
    legislation_text,
    alternate_text,
    effective_date,
    display_order,
    create_user_id,
    create_utc_timestamp
)
VALUES
-- EMA
('16c6da2b-2b27-4117-a8ed-0f4a910ef829','ACT',NULL,'Environmental Management Act SBC 2003','Environmental Management Act SBC 2003',NULL,'Environmental Management Act', NULL,'2003-10-23 00:00:00', 10,'FLYWAY', NOW()),
-- Park Act
('97057368-9ed4-4784-9ddd-319394aec360','ACT',NULL,'Park Act RSBC 1996','Park Act RSBC 1996',NULL,'Park Act',NULL,'1996-12-31 00:00:00', 20,'FLYWAY', NOW()),
-- Hazardous Waste Regulation
('f08c8cdb-0b62-4bc9-887f-207c4309a85c','REG','16c6da2b-2b27-4117-a8ed-0f4a910ef829','Hazardous Waste Regulation 64/88','Hazardous Waste Regulation 64/88',NULL,'Hazardous Waste Regulation',NULL,'1988-04-01 00:00:00', 10,'FLYWAY', NOW()),
-- Park, Conservancy and Recreation Area Regulation
('d2a956d6-c608-4df3-b06b-ae92943596f0','REG','97057368-9ed4-4784-9ddd-319394aec360','Park, Conservancy and Recreation Area Regulation 180/90','Park, Conservancy and Recreation Area Regulation 180/90',NULL,'Park, Conservancy and Recreation Area Regulation',NULL,'1990-08-01 00:00:00', 20,'FLYWAY', NOW()),
-- EMA s.7
('be637fda-e5ae-455d-851e-d75922b51c4f','SEC','16c6da2b-2b27-4117-a8ed-0f4a910ef829','s.7','Environmental Management Act SBC 2003 s.7','Hazardous waste — confinement', NULL, NULL,'2003-10-23 00:00:00',10,'FLYWAY',NOW()),
('897df840-fa4c-4107-b5d3-15d7fb068747','SUBSEC','be637fda-e5ae-455d-851e-d75922b51c4f','(1)','Environmental Management Act SBC 2003 s.7(1)',NULL,'A person who produces, stores, transports, handles, treats, recycles, deals with, processes or owns a hazardous waste must keep the hazardous waste confined in accordance with the regulations.',NULL,'2003-10-23 00:00:00',10,'FLYWAY',NOW()),
('6aa5d495-5c9d-42cb-a2c5-7f7005698ea7','SUBSEC','be637fda-e5ae-455d-851e-d75922b51c4f','(2)','Environmental Management Act SBC 2003 s.7(2)',NULL,'Except to the extent expressly authorized by a permit, an approval, an order, a waste management plan or the regulations, a person must not release a hazardous waste from the confinement required by subsection (1).','Release hazardous waste','2003-10-23 00:00:00',20,'FLYWAY',NOW()),
-- EMA s.8
('5b1fb227-fa10-4b5a-bcdf-88faa80c8e91','SEC','16c6da2b-2b27-4117-a8ed-0f4a910ef829','s.8','Environmental Management Act SBC 2003 s.8','Hazardous waste management facility','A person must not construct, establish, alter, enlarge, extend, use or operate a facility for the treatment, recycling, storage, disposal or destruction of a hazardous waste except in accordance with the regulations.','Unauthorized operation of hazardous waste site','2003-10-23 00:00:00',20,'FLYWAY',NOW()),
-- EMA s.9
('7f900312-c052-486e-a6d0-70c32e2566f7','SEC','16c6da2b-2b27-4117-a8ed-0f4a910ef829','s.9','Environmental Management Act SBC 2003 s.9','Hazardous waste storage and disposal',NULL,NULL,'2003-10-23 00:00:00',30,'FLYWAY',NOW()),
('d9c6d2ef-e2d8-4e06-9458-5f580a6c4631','SUBSEC','7f900312-c052-486e-a6d0-70c32e2566f7','(1)','Environmental Management Act SBC 2003 s.9(1)',NULL,'A person must not store more than a prescribed amount of a hazardous waste except in accordance with any of the following that apply:','Unlawful storage of hazardous waste','2003-10-23 00:00:00',10,'FLYWAY',NOW()),
('81f3ff4c-2e2f-4c0f-b05c-9aadecadc908','PAR','d9c6d2ef-e2d8-4e06-9458-5f580a6c4631','(a)','Environmental Management Act SBC 2003 s.9(1)(a)',NULL,'the regulations in relation to storing hazardous waste;',NULL,'2003-10-23 00:00:00',10,'FLYWAY',NOW()),
('21a10eff-aa6b-4842-b431-f47a7217d6ef','PAR','d9c6d2ef-e2d8-4e06-9458-5f580a6c4631','(b)','Environmental Management Act SBC 2003 s.9(1)(b)',NULL,'an order that requires the person to store that kind of hazardous waste;',NULL,'2003-10-23 00:00:00',20,'FLYWAY',NOW()),
('36505f89-bf38-4982-8bf9-2ee47044e2be','PAR','d9c6d2ef-e2d8-4e06-9458-5f580a6c4631','(c)','Environmental Management Act SBC 2003 s.9(1)(c)',NULL,'an approved waste management plan that provides for storage of hazardous waste.',NULL,'2003-10-23 00:00:00',30,'FLYWAY',NOW()),
-- HWR s.6
('8f7e5b45-ac1c-419c-b063-dc319ff55aff','SEC','f08c8cdb-0b62-4bc9-887f-207c4309a85c','s.6','Hazardous Waste Regulation 64/88 s.6','Waste record',NULL,NULL,'1988-04-01 00:00:00',10,'FLYWAY',NOW()),
('9eb185bd-a70a-4d73-af95-7252b8af5882','SUBSEC','8f7e5b45-ac1c-419c-b063-dc319ff55aff','(1)','Hazardous Waste Regulation 64/88 s.6(1)',NULL,'The owner of a hazardous waste facility must keep for inspection by an officer an operating record at the facility and must record in a written or retrievable electronic form the following information for each hazardous waste received, stored or shipped:',NULL,'1988-04-01 00:00:00',10,'FLYWAY',NOW()),
('79cf71ab-4dd5-4d5e-9d59-5843b24011ac','PAR','9eb185bd-a70a-4d73-af95-7252b8af5882','(a)','Hazardous Waste Regulation 64/88 s.6(1)(a)',NULL,'the description including',NULL,'1988-04-01 00:00:00',10,'FLYWAY',NOW()),
('2b40d17a-140d-4a90-b58a-a5fa8a08dc05','PAR','9eb185bd-a70a-4d73-af95-7252b8af5882','(b)','Hazardous Waste Regulation 64/88 s.6(1)(b)',NULL,'the quantity in kilograms or litres',NULL,'1988-04-01 00:00:00',20,'FLYWAY',NOW()),
('0b8aa864-277d-4692-9a3a-506b97283641','SUBPAR','79cf71ab-4dd5-4d5e-9d59-5843b24011ac','(i)','Hazardous Waste Regulation 64/88 s.6(1)(a)(i)',NULL,'the name and identification number as described in the federal dangerous goods regulations, and',NULL,'1988-04-01 00:00:00',10,'FLYWAY',NOW()),
('b1fb903b-3e44-4398-982c-aa7f6b164661','SUBPAR','79cf71ab-4dd5-4d5e-9d59-5843b24011ac','(ii)','Hazardous Waste Regulation 64/88 s.6(1)(a)(ii)',NULL,'the physical state (i.e. whether it is solid, liquid, gaseous or a combination of one or more of these)',NULL,'1988-04-01 00:00:00',20,'FLYWAY',NOW()),
-- Park Act s.4
('33ad4c7d-86df-4f33-8078-17f68a8fa8f6','SEC','d2a956d6-c608-4df3-b06b-ae92943596f0','s.4','Park, Conservancy and Recreation Area Regulation 180/90 s.4','Permits for guiding required','A person must not act as a guide or offer services as a guide in a park, conservancy or recreation area without',NULL,'1990-08-01 00:00:00',10,'FLYWAY',NOW()),
('55dd3828-f7c7-45bd-8b6b-d4e746ea7ce7','PAR','33ad4c7d-86df-4f33-8078-17f68a8fa8f6','(a)','Park, Conservancy and Recreation Area Regulation 180/90 s.4(a)',NULL,'a valid park use permit or resource use permit issued for that purpose, and',NULL,'1990-08-01 00:00:00',10,'FLYWAY',NOW()),
('91d08696-3442-4ca6-9561-a85e17ea4351','PAR','33ad4c7d-86df-4f33-8078-17f68a8fa8f6','(b)','Park, Conservancy and Recreation Area Regulation 180/90 s.4(b)',NULL,'a licence or permit to guide if required by or under the Wildlife Act.',NULL,'1990-08-01 00:00:00',20,'FLYWAY',NOW()),
-- Park Act s.5
('8d281e80-dfe3-49e5-a3ce-68a7b9835151','SEC','d2a956d6-c608-4df3-b06b-ae92943596f0','s.5','Park, Conservancy and Recreation Area Regulation 180/90 s.5','Permits for trapping required','A person must not trap or take any fur bearing animal in a park, conservancy or recreation area without','Trap without permit','1990-08-01 00:00:00',20,'FLYWAY',NOW()),
('3fe1ad00-b571-4f4a-9ddd-3dc5921b3294','PAR','8d281e80-dfe3-49e5-a3ce-68a7b9835151','(a)','Park, Conservancy and Recreation Area Regulation 180/90 s.5(a)',NULL,'a valid park use permit or resource use permit issued for that purpose, and',NULL,'1990-08-01 00:00:00',10,'FLYWAY',NOW()),
('9ad66b8f-da7a-4e13-9ff0-e7a7f300e918','PAR','8d281e80-dfe3-49e5-a3ce-68a7b9835151','(b)','Park, Conservancy and Recreation Area Regulation 180/90 s.5(b)',NULL,'a licence or permit to trap issued under the Wildlife Act.',NULL,'1990-08-01 00:00:00',20,'FLYWAY',NOW()),
-- Park Act s.7
('19b5f25c-7798-4b1a-8622-199cde0a62e6','SEC','d2a956d6-c608-4df3-b06b-ae92943596f0','s.7','Park, Conservancy and Recreation Area Regulation 180/90 s.7','Must give information','Every person who enters or is in a park, conservancy or recreation area must, at the request of a park officer or park ranger, provide information about any matter pertaining to the use or occupancy of the park, conservancy or recreation area including that person''s correct name, address, destination and proposed activities and conduct in the park, conservancy or recreation area','Fail to give information','1990-08-01 00:00:00',30,'FLYWAY',NOW());


-- Agency Mappings

INSERT INTO legislation_agency_xref (
    legislation_guid,
    agency_code,
    create_user_id,
    create_utc_timestamp
) VALUES
-- Acts / Regulations
-- Environmental Management Act (ACT)
('16c6da2b-2b27-4117-a8ed-0f4a910ef829','COS','FLYWAY',NOW()), 
('16c6da2b-2b27-4117-a8ed-0f4a910ef829','EPO','FLYWAY',NOW()), 
-- Park Act (ACT)
('97057368-9ed4-4784-9ddd-319394aec360','COS','FLYWAY',NOW()), 
('97057368-9ed4-4784-9ddd-319394aec360','PARKS','FLYWAY',NOW()), 
-- Hazardous Waste Regulation (REG)
('f08c8cdb-0b62-4bc9-887f-207c4309a85c','COS','FLYWAY',NOW()), 
('f08c8cdb-0b62-4bc9-887f-207c4309a85c','EPO','FLYWAY',NOW()),
-- Park, Conservancy and Recreation Area Regulation (REG) 
('d2a956d6-c608-4df3-b06b-ae92943596f0','COS','FLYWAY',NOW()), 
('d2a956d6-c608-4df3-b06b-ae92943596f0','PARKS','FLYWAY',NOW()),
-- EMA Section / Subsections / Paragraphs
('be637fda-e5ae-455d-851e-d75922b51c4f','COS','FLYWAY',NOW()), 
('897df840-fa4c-4107-b5d3-15d7fb068747','COS','FLYWAY',NOW()), 
('6aa5d495-5c9d-42cb-a2c5-7f7005698ea7','COS','FLYWAY',NOW()), 
('5b1fb227-fa10-4b5a-bcdf-88faa80c8e91','COS','FLYWAY',NOW()), 
('7f900312-c052-486e-a6d0-70c32e2566f7','COS','FLYWAY',NOW()), 
('d9c6d2ef-e2d8-4e06-9458-5f580a6c4631','COS','FLYWAY',NOW()), 
('81f3ff4c-2e2f-4c0f-b05c-9aadecadc908','COS','FLYWAY',NOW()), 
('21a10eff-aa6b-4842-b431-f47a7217d6ef','COS','FLYWAY',NOW()), 
('36505f89-bf38-4982-8bf9-2ee47044e2be','COS','FLYWAY',NOW()), 
-- HWR Section / Subsections / Paragraphs / Subparagraphs
('8f7e5b45-ac1c-419c-b063-dc319ff55aff','COS','FLYWAY',NOW()), 
('9eb185bd-a70a-4d73-af95-7252b8af5882','COS','FLYWAY',NOW()), 
('79cf71ab-4dd5-4d5e-9d59-5843b24011ac','COS','FLYWAY',NOW()), 
('2b40d17a-140d-4a90-b58a-a5fa8a08dc05','COS','FLYWAY',NOW()), 
('0b8aa864-277d-4692-9a3a-506b97283641','COS','FLYWAY',NOW()), 
('b1fb903b-3e44-4398-982c-aa7f6b164661','COS','FLYWAY',NOW()), 
('8f7e5b45-ac1c-419c-b063-dc319ff55aff','EPO','FLYWAY',NOW()), 
('9eb185bd-a70a-4d73-af95-7252b8af5882','EPO','FLYWAY',NOW()), 
('79cf71ab-4dd5-4d5e-9d59-5843b24011ac','EPO','FLYWAY',NOW()), 
('2b40d17a-140d-4a90-b58a-a5fa8a08dc05','EPO','FLYWAY',NOW()), 
('0b8aa864-277d-4692-9a3a-506b97283641','EPO','FLYWAY',NOW()), 
('b1fb903b-3e44-4398-982c-aa7f6b164661','EPO','FLYWAY',NOW()), 
-- Park Regulation Section / Paragraphs
('33ad4c7d-86df-4f33-8078-17f68a8fa8f6','COS','FLYWAY',NOW()), 
('55dd3828-f7c7-45bd-8b6b-d4e746ea7ce7','COS','FLYWAY',NOW()), 
('91d08696-3442-4ca6-9561-a85e17ea4351','COS','FLYWAY',NOW()), 
('8d281e80-dfe3-49e5-a3ce-68a7b9835151','COS','FLYWAY',NOW()), 
('3fe1ad00-b571-4f4a-9ddd-3dc5921b3294','COS','FLYWAY',NOW()), 
('9ad66b8f-da7a-4e13-9ff0-e7a7f300e918','COS','FLYWAY',NOW()), 
('19b5f25c-7798-4b1a-8622-199cde0a62e6','COS','FLYWAY',NOW()),
('33ad4c7d-86df-4f33-8078-17f68a8fa8f6','PARKS','FLYWAY',NOW()), 
('55dd3828-f7c7-45bd-8b6b-d4e746ea7ce7','PARKS','FLYWAY',NOW()), 
('91d08696-3442-4ca6-9561-a85e17ea4351','PARKS','FLYWAY',NOW()), 
('8d281e80-dfe3-49e5-a3ce-68a7b9835151','PARKS','FLYWAY',NOW()), 
('3fe1ad00-b571-4f4a-9ddd-3dc5921b3294','PARKS','FLYWAY',NOW()), 
('9ad66b8f-da7a-4e13-9ff0-e7a7f300e918','PARKS','FLYWAY',NOW()), 
('19b5f25c-7798-4b1a-8622-199cde0a62e6','PARKS','FLYWAY',NOW()); 
