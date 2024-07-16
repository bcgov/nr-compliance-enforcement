-- As the repeatable scripts are always run after the DDL changes, update this script whenever the view definition changes.

CREATE OR REPLACE VIEW public.cos_geo_org_unit_flat_vw
AS SELECT DISTINCT 
    gou.geo_organization_unit_code AS region_code,
    gou.short_description AS region_name,
    gou2.geo_organization_unit_code AS zone_code,
    gou2.short_description AS zone_name,
    gou3.geo_organization_unit_code AS offloc_code,
    gou3.short_description AS offloc_name,
    CAST(COALESCE(gou4.geo_organization_unit_code, NULL) AS VARCHAR(10)) AS area_code,
    CAST(COALESCE(gou4.short_description, null) as VARCHAR(50)) AS area_name
FROM 
    geo_org_unit_structure gos
JOIN 
    geo_organization_unit_code gou ON gos.parent_geo_org_unit_code::text = gou.geo_organization_unit_code::text
JOIN 
    geo_org_unit_structure gos2 ON gos2.parent_geo_org_unit_code::text = gou.geo_organization_unit_code::text
JOIN 
    geo_organization_unit_code gou2 ON gos2.child_geo_org_unit_code::text = gou2.geo_organization_unit_code::text
JOIN 
    geo_org_unit_structure gos3 ON gos3.parent_geo_org_unit_code::text = gou2.geo_organization_unit_code::text
JOIN 
    geo_organization_unit_code gou3 ON gos3.child_geo_org_unit_code::text = gou3.geo_organization_unit_code::text
LEFT JOIN 
    geo_org_unit_structure gos4 ON gos4.parent_geo_org_unit_code::text = gou3.geo_organization_unit_code::text
LEFT JOIN 
    geo_organization_unit_code gou4 ON gos4.child_geo_org_unit_code::text = gou4.geo_organization_unit_code::text
WHERE 
    gou.geo_org_unit_type_code = 'REGION' 
    AND gou2.geo_org_unit_type_code = 'ZONE' 
    AND gou3.geo_org_unit_type_code = 'OFFLOC' 
    AND (gou4.geo_org_unit_type_code = 'AREA' OR gou4.geo_org_unit_type_code IS NULL)
    AND gos.agency_code = 'COS';


  
  

  

