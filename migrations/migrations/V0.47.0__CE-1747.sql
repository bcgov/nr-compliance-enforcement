--CE-1747 update park's email address
UPDATE complaint.email_reference
SET
	email_address = 'parksandrecreation.natcom@gov.bc.ca'
WHERE
	agency_code = 'PARKS';

UPDATE configuration 
SET    configuration_value = configuration_value::int + 1
WHERE  configuration_code = 'CDTABLEVER';