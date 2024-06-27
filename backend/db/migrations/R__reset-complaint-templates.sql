--
-- Reset the CDOGS template hashes every time the database scripts run 
-- this is to make sure that the most up to date template is used
--
UPDATE "configuration"
SET
  configuration_value = ''
WHERE
  configuration_code = 'HWCTMPLATE';

UPDATE "configuration"
SET
  configuration_value = ''
WHERE
  configuration_code = 'ERSTMPLATE';