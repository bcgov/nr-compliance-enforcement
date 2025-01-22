UPDATE hwcr_complaint_nature_code set active_ind = false WHERE hwcr_complaint_nature_code = 'COUGARN';
UPDATE configuration 
SET    configuration_value = configuration_value::int + 1
WHERE  configuration_code = 'CDTABLEVER';