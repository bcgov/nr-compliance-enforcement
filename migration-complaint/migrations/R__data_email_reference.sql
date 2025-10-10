---------------------------------
-- Inserts code table values into the EMAIL_REFERENCE table
-- or if the Code already exists, updates the data
---------------------------------
INSERT INTO email_reference (
    email_reference_guid, email_address, agency_code_ref, geo_organization_unit_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp, active_ind
) VALUES
('359fd776-dcbd-47e4-a9ec-dd29a19617c9', 'EnvironmentalComplaints@gov.bc.ca', 'EPO', NULL, 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('6ae106cb-dbf1-40c8-8a8c-242943396246', 'COS.Bulkley-CassiarZone@gov.bc.ca', 'COS', 'BLKYCSR', 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('b249ea08-8901-4129-88ab-0be294ed0500', 'COS.Cariboo-ChilcotinZone@gov.bc.ca', 'COS', 'CRBOCHLCTN', 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('a89e804d-9b0f-4ce2-89f3-282103ff562f', 'COS.CaribooThompsonZone@gov.bc.ca', 'COS', 'CRBOTMPSN', 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('3e58a1f1-cb95-4506-9a9b-5a34e28792e1', 'COS.CentralIslandZone@gov.bc.ca', 'COS', 'CENISL', 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('40110158-248c-42b5-87a7-54bdf48b1b4e', 'COS.CentralOkanaganZone@gov.bc.ca', 'COS', 'CENOKNGN', 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('b9d1e096-a4dc-4eef-99ca-9bd9ea9087a6', 'COS.FraserNorthZone@gov.bc.ca', 'COS', 'FRSRN', 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('bac0b7b6-d8dd-4bd8-a109-3ea8abde662f', 'COS.FraserSouthZone@gov.bc.ca', 'COS', 'FRSRS', 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('9fc164e1-e773-48ee-b845-f1815b19bed2', 'COS.Nechako-LakesZone@gov.bc.ca  ', 'COS', 'NCHKOLKS', 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('4fd7ca92-753f-4349-9631-b914dc1d1345', 'COS.NorthCoastZone@gov.bc.ca', 'COS', 'NCST', 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('823a3d3b-88ea-4a8a-9c64-e41a5fc28300', 'COs.North.Island.Zone@gov.bc.ca', 'COS', 'NISL', 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('9b9ff714-c4dc-4768-add1-2336d57494c6', 'COSNOKAN@gov.bc.ca', 'COS', 'NOKNGN', 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('b4bba5eb-91ee-4bc9-936c-800baa3c30db', 'COS.North.Peace.Zone@gov.bc.ca', 'COS', 'NPCE', 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('629a3b7a-b896-4408-89ab-7d5616a955e6', 'COS.OminecaZone@gov.bc.ca', 'COS', 'OMNCA', 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('a1adc03b-6ba3-4074-8713-868631b2bf46', 'COS.SeatoSkyZone@gov.bc.ca', 'COS', 'SEA2SKY', 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('cd502141-4c87-4e46-83e0-c1beb1c310bb', 'COS.South.Island.Zone@gov.bc.ca', 'COS', 'SISL', 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('4facc07d-fd03-4976-b1b0-23ce8e231789', 'COS.SouthOkanaganZone@gov.bc.ca', 'COS', 'SOKNGN', 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('083b3ce3-8e73-41c7-8e01-760b27642b45', 'COS.SouthPeaceZone@gov.bc.ca', 'COS', 'SPCE', 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('3ec1df5e-5f83-4849-b426-4fb7ec21b48e', 'COS.Sunshine.Coast.Zone@gov.bc.ca', 'COS', 'SNSHNCST', 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('23eaf999-0ffe-42bf-8deb-1ae7759b58f1', 'COS.ThompsonNicolaZone@gov.bc.ca', 'COS', 'TMPSNNCLA', 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('097d60fb-6603-4d4a-b15d-5a0071bbcc11', 'COSCKZ@gov.bc.ca', 'COS', 'CLMBAKTNY', 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('85e18e06-baaf-4f36-82f1-001d785c2f94', 'COS.East.Kootenay.Zone@gov.bc.ca', 'COS', 'EKTNY', 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('3c6ad456-b4eb-4b7c-b0e7-e411a9f7e71b', 'COS.WestKootenay.Zone@gov.bc.ca', 'COS', 'WKTNY', 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('6bfe170b-7a0e-4a72-b726-586411fa4b37', 'parksandrecreation.natcom@gov.bc.ca', 'PARKS', NULL, 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true),
('a6f6f536-a3b9-4caa-b631-40a515e83b50', 'CE.FrontCounterBCContactCentre@gov.bc.ca', 'NROS', NULL, 'postgres', '2025-09-08 23:27:23.600236', 'postgres', '2025-09-08 23:27:35.381491', true)
ON CONFLICT (email_reference_guid) DO UPDATE SET
    email_address = EXCLUDED.email_address,
    agency_code_ref = EXCLUDED.agency_code_ref,
    geo_organization_unit_code = EXCLUDED.geo_organization_unit_code,
    active_ind = EXCLUDED.active_ind,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = NOW();