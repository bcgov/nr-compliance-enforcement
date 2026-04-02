INSERT INTO shared.geo_org_unit_type_code (geo_org_unit_type_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
VALUES
    ('OFFLOC', 'Office Location', NULL, 3, true, 'FLYWAY', NOW(), 'FLYWAY', NOW())
ON CONFLICT DO NOTHING;

INSERT INTO shared.geo_organization_unit_code (geo_organization_unit_code, short_description, long_description, effective_date, expiry_date, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp, geo_org_unit_type_code, administrative_office_ind)
VALUES
    ('BLKCRKCR', 'Black Creek/Campbell River', 'Black Creek/Campbell River', NOW(), NULL, 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'OFFLOC', false),
    ('CHLWK', 'Chilliwack', 'Chilliwack', NOW(), NULL, 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'OFFLOC', false),
    ('NNIMO', 'Nanaimo', 'Nanaimo', NOW(), NULL, 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'OFFLOC', false),
    ('SQMSHWHS', 'Squamish/Whistler', 'Squamish/Whistler', NOW(), NULL, 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'OFFLOC', false),
    ('KMLPS', 'Kamloops', 'Kamloops', NOW(), NULL, 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'OFFLOC', false),
    ('WLMSLK', 'Williams Lake', 'Williams Lake', NOW(), NULL, 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'OFFLOC', false),
    ('DWSNCRK', 'Dawson Creek', 'Dawson Creek', NOW(), NULL, 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'OFFLOC', false),
    ('PRCG', 'Prince George', 'Prince George', NOW(), NULL, 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'OFFLOC', false),
    ('SMITHRS', 'Smithers', 'Smithers', NOW(), NULL, 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'OFFLOC', false),
    ('TERRC', 'Terrace', 'Terrace', NOW(), NULL, 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'OFFLOC', false),
    ('CSTLGAR', 'Castlegar', 'Castlegar', NOW(), NULL, 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'OFFLOC', false),
    ('CRNBK', 'Cranbrook', 'Cranbrook', NOW(), NULL, 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'OFFLOC', false),
    ('PNTCTN', 'Penticton', 'Penticton', NOW(), NULL, 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'OFFLOC', false),
    ('RVLSTK', 'Revelstoke', 'Revelstoke', NOW(), NULL, 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'OFFLOC', false),
    ('VRNON', 'Vernon', 'Vernon', NOW(), NULL, 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'OFFLOC', false)
ON CONFLICT DO NOTHING;

INSERT INTO shared.office (office_guid, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp, geo_organization_unit_code, agency_code_ref)
VALUES
    -- Coast
    (gen_random_uuid(), 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'BLKCRKCR', 'NROS'),  -- Campbell River
    (gen_random_uuid(), 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'CHLWK', 'NROS'),     -- Chilliwack
    (gen_random_uuid(), 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'NNIMO', 'NROS'),     -- Nanaimo
    (gen_random_uuid(), 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'SQMSHWHS', 'NROS'),  -- Squamish
    -- Interior
    (gen_random_uuid(), 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'KMLPS', 'NROS'),     -- Kamloops
    (gen_random_uuid(), 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'WLMSLK', 'NROS'),    -- Williams Lake
    -- North
    (gen_random_uuid(), 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'DWSNCRK', 'NROS'),   -- Dawson Creek
    (gen_random_uuid(), 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'PRCG', 'NROS'),      -- Prince George
    (gen_random_uuid(), 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'SMITHRS', 'NROS'),   -- Smithers
    (gen_random_uuid(), 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'TERRC', 'NROS'),     -- Terrace
    -- South
    (gen_random_uuid(), 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'CSTLGAR', 'NROS'),   -- Castlegar
    (gen_random_uuid(), 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'CRNBK', 'NROS'),     -- Cranbrook
    (gen_random_uuid(), 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'PNTCTN', 'NROS'),    -- Penticton
    (gen_random_uuid(), 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'RVLSTK', 'NROS'),    -- Revelstoke
    (gen_random_uuid(), 'FLYWAY', NOW(), 'FLYWAY', NOW(), 'VRNON', 'NROS')      -- Vernon
ON CONFLICT DO NOTHING;