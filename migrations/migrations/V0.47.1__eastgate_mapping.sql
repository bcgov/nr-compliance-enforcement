UPDATE staging_metadata_mapping
SET
  live_data_value = 'EASTGTE'
WHERE
  entity_code = 'geoorgutcd'
  AND staged_data_value = 'Eastgate';