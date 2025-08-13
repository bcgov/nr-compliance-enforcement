UPDATE configuration
SET
  configuration_value = configuration_value::int + 1
WHERE
  configuration_code = 'CDTABLEVER';