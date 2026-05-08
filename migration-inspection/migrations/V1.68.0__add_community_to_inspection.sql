ALTER TABLE inspection.inspection
ADD COLUMN geo_organization_unit_code_ref character varying(10);

COMMENT ON COLUMN inspection.inspection.geo_organization_unit_code_ref IS 'Unenforced FK to shared.geo_organization_unit_code. A human readable code used to identify a geographical organization unit.  The geographical unit where the office is located.   This might not necessarily be the lowest level in the geographical organizational unit hierarchy.';
