-- As the repeatable scripts are always run after the DDL changes, update this script whenever the view definition changes.

DROP MATERIALIZED VIEW IF EXISTS public.cos_geo_org_unit_flat_mvw;

CREATE MATERIALIZED VIEW public.cos_geo_org_unit_flat_mvw
AS SELECT DISTINCT gou.geo_organization_unit_code AS region_code,
    gou.short_description AS region_name,
    gou2.geo_organization_unit_code AS zone_code,
    gou2.short_description AS zone_name,
    gou3.geo_organization_unit_code AS offloc_code,
    gou3.short_description AS offloc_name,
    COALESCE(gou4.geo_organization_unit_code, NULL::character varying)::character varying(10) AS area_code,
    COALESCE(gou4.short_description, NULL::character varying)::character varying(50) AS area_name,
    gou3.administrative_office_ind
   FROM geo_org_unit_structure gos
     JOIN geo_organization_unit_code gou ON gos.parent_geo_org_unit_code::text = gou.geo_organization_unit_code::text
     JOIN geo_org_unit_structure gos2 ON gos2.parent_geo_org_unit_code::text = gou.geo_organization_unit_code::text
     JOIN geo_organization_unit_code gou2 ON gos2.child_geo_org_unit_code::text = gou2.geo_organization_unit_code::text
     JOIN geo_org_unit_structure gos3 ON gos3.parent_geo_org_unit_code::text = gou2.geo_organization_unit_code::text
     JOIN geo_organization_unit_code gou3 ON gos3.child_geo_org_unit_code::text = gou3.geo_organization_unit_code::text
     LEFT JOIN geo_org_unit_structure gos4 ON gos4.parent_geo_org_unit_code::text = gou3.geo_organization_unit_code::text
     LEFT JOIN geo_organization_unit_code gou4 ON gos4.child_geo_org_unit_code::text = gou4.geo_organization_unit_code::text
  WHERE gou.geo_org_unit_type_code::text = 'REGION'::text 
  AND gou2.geo_org_unit_type_code::text = 'ZONE'::text 
  AND gou3.geo_org_unit_type_code::text = 'OFFLOC'::text 
  AND (gou4.geo_org_unit_type_code::text = 'AREA'::text OR gou4.geo_org_unit_type_code IS NULL) 
  AND gos.agency_code::text = 'COS'::text;
  
 CREATE INDEX  IF NOT EXISTS area_code
  ON cos_geo_org_unit_flat_mvw (area_code);
 
 CREATE OR REPLACE FUNCTION cos_geo_org_unit_flat_mvw_refresh()
 RETURNS TRIGGER AS $$
 BEGIN 
 	REFRESH MATERIALIZED VIEW cos_geo_org_unit_flat_mvw;
	RETURN NULL;
 END;
$$ LANGUAGE plpgsql;
 
  
CREATE OR REPLACE TRIGGER geo_org_unit_structure_insert_update_refresh_mvw 
AFTER INSERT OR UPDATE 
ON geo_org_unit_structure
EXECUTE FUNCTION cos_geo_org_unit_flat_mvw_refresh();

CREATE OR REPLACE TRIGGER geo_organization_unit_code_insert_update_refresh_mvw 
AFTER INSERT OR UPDATE 
ON geo_organization_unit_code
EXECUTE FUNCTION cos_geo_org_unit_flat_mvw_refresh();
