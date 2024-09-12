--
-- alter the feature_agency_xref table to add a uniqueness constraint between feature and agency
-- this is to avoid the repeatable scripts re-adding new entries into the XREF that already exist
--
ALTER TABLE feature_agency_xref
ADD CONSTRAINT "UK_unique_feature_agency" UNIQUE (feature_code, agency_code);

UPDATE configuration 
SET    configuration_value = configuration_value::int + 1
WHERE  configuration_code = 'CDTABLEVER';
