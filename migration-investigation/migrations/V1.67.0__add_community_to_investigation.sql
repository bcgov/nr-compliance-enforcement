ALTER TABLE investigation.investigation
ADD COLUMN community_code_ref character varying(10);

COMMENT ON COLUMN investigation.investigation.community_code_ref IS 'Geographic community (geo_organization_unit_code) associated with the investigation.';
