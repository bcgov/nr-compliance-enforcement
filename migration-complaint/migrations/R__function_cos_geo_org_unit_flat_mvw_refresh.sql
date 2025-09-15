 CREATE OR REPLACE FUNCTION complaint.cos_geo_org_unit_flat_mvw_refresh()
 RETURNS TRIGGER AS $$
 BEGIN 
 	REFRESH MATERIALIZED VIEW complaint.cos_geo_org_unit_flat_mvw;
	RETURN NULL;
 END;
$$ LANGUAGE plpgsql;