ALTER TABLE geo_organization_unit_code ADD administrative_office_ind boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN geo_organization_unit_code.administrative_office_ind IS 'Indicates if the unit is a COSHQ Office.';

UPDATE configuration 
SET    configuration_value = configuration_value::int + 1
WHERE  configuration_code = 'CDTABLEVER';