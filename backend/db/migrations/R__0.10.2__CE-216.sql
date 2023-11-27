--
-- insert new office records
--
INSERT INTO office (geo_organization_unit_code, agency_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp) 
SELECT 'NNIMO', 'EPO', user, now(), user, now()
ON CONFLICT DO NOTHING;

INSERT INTO office (geo_organization_unit_code, agency_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp) 
SELECT 'VICTRA', 'EPO', user, now(), user, now()
ON CONFLICT DO NOTHING;

INSERT INTO office (geo_organization_unit_code, agency_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp) 
SELECT 'MSNSR', 'EPO', user, now(), user, now()
ON CONFLICT DO NOTHING;

INSERT INTO office (geo_organization_unit_code, agency_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp) 
SELECT 'PNTCTN', 'EPO', user, now(), user, now()
ON CONFLICT DO NOTHING;

INSERT INTO office (geo_organization_unit_code, agency_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp) 
SELECT 'NLSON', 'EPO', user, now(), user, now()
ON CONFLICT DO NOTHING;

INSERT INTO office (geo_organization_unit_code, agency_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp) 
SELECT 'CRNBK', 'EPO', user, now(), user, now()
ON CONFLICT DO NOTHING;

INSERT INTO office (geo_organization_unit_code, agency_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp) 
SELECT 'KMLPS', 'EPO', user, now(), user, now()
ON CONFLICT DO NOTHING;

INSERT INTO office (geo_organization_unit_code, agency_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp) 
SELECT 'WLMSLK', 'EPO', user, now(), user, now()
ON CONFLICT DO NOTHING;

INSERT INTO office (geo_organization_unit_code, agency_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp) 
SELECT 'SMITHRS', 'EPO', user, now(), user, now()
ON CONFLICT DO NOTHING;

INSERT INTO office (geo_organization_unit_code, agency_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp) 
SELECT 'PRCG', 'EPO', user, now(), user, now()
ON CONFLICT DO NOTHING;

INSERT INTO office (geo_organization_unit_code, agency_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp) 
SELECT 'PRTMCNL', 'PARKS', user, now(), user, now()
ON CONFLICT DO NOTHING;

INSERT INTO office (geo_organization_unit_code, agency_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp) 
SELECT 'KMLPS', 'PARKS', user, now(), user, now()
ON CONFLICT DO NOTHING;

INSERT INTO office (geo_organization_unit_code, agency_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp) 
SELECT 'WLMSLK', 'PARKS', user, now(), user, now()
ON CONFLICT DO NOTHING;

INSERT INTO office (geo_organization_unit_code, agency_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp) 
SELECT 'PNTCTN', 'PARKS', user, now(), user, now()
ON CONFLICT DO NOTHING;

INSERT INTO office (geo_organization_unit_code, agency_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp) 
SELECT 'VRNON', 'PARKS', user, now(), user, now()
ON CONFLICT DO NOTHING;

INSERT INTO office (geo_organization_unit_code, agency_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp) 
SELECT 'NLSON', 'PARKS', user, now(), user, now()
ON CONFLICT DO NOTHING;

INSERT INTO office (geo_organization_unit_code, agency_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp) 
SELECT 'CRNBK', 'PARKS', user, now(), user, now()
ON CONFLICT DO NOTHING;

INSERT INTO office (geo_organization_unit_code, agency_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp) 
SELECT 'SMITHRS', 'PARKS', user, now(), user, now()
ON CONFLICT DO NOTHING;

INSERT INTO office (geo_organization_unit_code, agency_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp) 
SELECT 'ATLIN', 'PARKS', user, now(), user, now()
ON CONFLICT DO NOTHING;

INSERT INTO office (geo_organization_unit_code, agency_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp) 
SELECT 'DSELK', 'PARKS', user, now(), user, now()
ON CONFLICT DO NOTHING;

INSERT INTO office (geo_organization_unit_code, agency_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp) 
SELECT 'PRCG', 'PARKS', user, now(), user, now()
ON CONFLICT DO NOTHING;

INSERT INTO office (geo_organization_unit_code, agency_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp) 
SELECT 'FRTSTJN', 'PARKS', user, now(), user, now()
ON CONFLICT DO NOTHING;

