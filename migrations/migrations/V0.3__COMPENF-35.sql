CREATE OR REPLACE VIEW cos_geo_org_unit_flat_vw AS
SELECT distinct 
    gou.geo_organization_unit_code AS region_code, 
    gou.short_description AS region_name, 
    gou2.geo_organization_unit_code AS zone_code, 
    gou2.short_description AS zone_name, 
    gou3.geo_organization_unit_code as offloc_code, 
    gou3.short_description AS offloc_name, 
    gou4.geo_organization_unit_code AS area_code,
    gou4.short_description AS area_name
FROM geo_org_unit_structure gos
JOIN geo_organization_unit_code gou ON gos.parent_geo_org_unit_code = gou.geo_organization_unit_code
JOIN geo_org_unit_structure gos2 ON gos2.parent_geo_org_unit_code = gou.geo_organization_unit_code
JOIN geo_organization_unit_code gou2 ON gos2.child_geo_org_unit_code = gou2.geo_organization_unit_code
JOIN geo_org_unit_structure gos3 ON gos3.parent_geo_org_unit_code = gou2.geo_organization_unit_code
JOIN geo_organization_unit_code gou3 ON gos3.child_geo_org_unit_code = gou3.geo_organization_unit_code
JOIN geo_org_unit_structure gos4 ON gos4.parent_geo_org_unit_code = gou3.geo_organization_unit_code
JOIN geo_organization_unit_code gou4 ON gos4.child_geo_org_unit_code = gou4.geo_organization_unit_code
WHERE gou.geo_org_unit_type_code = 'REGION' 
AND gou2.geo_org_unit_type_code = 'ZONE'
AND gou3.geo_org_unit_type_code = 'OFFLOC'
AND gou4.geo_org_unit_type_code = 'AREA'
and gos.agency_code = 'COS' 