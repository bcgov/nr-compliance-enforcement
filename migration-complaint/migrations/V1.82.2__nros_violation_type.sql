---------------------------------
-- Add new NROS violation types
---------------------------------

INSERT INTO complaint.violation_code (violation_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
VALUES
    ('ALGAE', 'ALGAE', 'Algae', 170, true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    ('FORESTOPS', 'FORESTOPS', 'Forestry operations', 180, true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    ('FORESTPRAC', 'FORESTPRAC', 'Forest practices', 190, true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    ('HERITAGE', 'HERITAGE', 'Heritage Conservation Act', 200, true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    ('CROWNLAND', 'CROWNLAND', 'Land Act - Unauthorized use of Crown Land', 210, true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    ('RANGE', 'RANGE', 'Range use', 220, true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    ('ROAD', 'ROAD', 'Road construction/use', 230, true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    ('SPILLS', 'SPILLS', 'Spills', 240, true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    ('WATERACT', 'WATERACT', 'Water Act', 250, true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    ('WATERSUST', 'WATERSUST', 'Water Sustainability Act', 260, true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    ('WEED', 'WEED', 'Weed Control Act', 270, true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    ('WILDFIRE', 'WILDFIRE', 'Wildfire Act', 280, true, 'FLYWAY', NOW(), 'FLYWAY', NOW())
ON CONFLICT DO NOTHING;

---------------------------------
-- Map the incoming CHEFS violation type values to the codes
---------------------------------

INSERT INTO complaint.staging_metadata_mapping (staging_metadata_mapping_guid, entity_code, staged_data_value, live_data_value, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
VALUES
    (gen_random_uuid(), 'violatncd', 'Algae', 'ALGAE', 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'violatncd', 'Forestry operations', 'FORESTOPS', 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'violatncd', 'Forest practices', 'FORESTPRAC', 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'violatncd', 'Heritage Conservation Act', 'HERITAGE', 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'violatncd', 'Land Act - Unauthorized use of Crown Land', 'CROWNLAND', 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'violatncd', 'Range use', 'RANGE', 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'violatncd', 'Road construction/use', 'ROAD', 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'violatncd', 'Spills', 'SPILLS', 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'violatncd', 'Water Act', 'WATERACT', 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'violatncd', 'Water Sustainability Act', 'WATERSUST', 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'violatncd', 'Weed Control Act', 'WEED', 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'violatncd', 'Wildfire Act', 'WILDFIRE', 'FLYWAY', NOW(), 'FLYWAY', NOW())
ON CONFLICT DO NOTHING;


---------------------------------
-- Add violation type mappings for NROS
---------------------------------

INSERT INTO complaint.violation_agency_xref (violation_code, agency_code_ref, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp, active_ind)
VALUES
    ('ALGAE', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    ('FORESTOPS', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    ('FORESTPRAC', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    ('HERITAGE', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    ('CROWNLAND', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    ('RANGE', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    ('ROAD', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    ('SPILLS', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    ('WATERACT', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    ('WATERSUST', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    ('WEED', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    ('WILDFIRE', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    ('OTHER', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true)
ON CONFLICT DO NOTHING;