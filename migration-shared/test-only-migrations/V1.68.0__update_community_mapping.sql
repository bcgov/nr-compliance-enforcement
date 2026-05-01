UPDATE shared.geo_org_unit_structure
SET update_utc_timestamp=CURRENT_TIMESTAMP, 
parent_geo_org_unit_code='NNIMO'
WHERE child_geo_org_unit_code='VALDESIS';

UPDATE shared.geo_org_unit_structure
SET update_utc_timestamp=CURRENT_TIMESTAMP, 
parent_geo_org_unit_code='BLKCRKCR'
WHERE child_geo_org_unit_code='FANNYBAY';
