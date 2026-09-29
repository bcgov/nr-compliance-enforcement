UPDATE contravention c
SET geo_organization_unit_code_ref = COALESCE(
    (SELECT i.geo_organization_unit_code_ref FROM investigation i WHERE i.investigation_guid = c.investigation_guid),
    'VICTORIA'
)
WHERE c.geo_organization_unit_code_ref IS NULL;

ALTER TABLE contravention ALTER COLUMN geo_organization_unit_code_ref SET NOT NULL;
