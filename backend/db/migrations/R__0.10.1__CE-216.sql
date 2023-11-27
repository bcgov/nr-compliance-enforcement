--
-- update agency table with updated EPO -> CEEB short description and display order
--
UPDATE agency_code SET short_description='CEEB', long_description = 'Compliance and Environmental Enforcement Branch' where agency_code = 'EPO';
UPDATE agency_code SET display_order = 2 WHERE agency_code = 'BCWF';
UPDATE agency_code SET display_order = 3 WHERE agency_code = 'BYLAW';
UPDATE agency_code SET display_order = 4 WHERE agency_code = 'COS';
UPDATE agency_code SET display_order = 5 WHERE agency_code = 'DOF';
UPDATE agency_code SET display_order = 6 WHERE agency_code = 'EPO';
UPDATE agency_code SET display_order = 7 WHERE agency_code = 'CEB';
UPDATE agency_code SET display_order = 8 WHERE agency_code = 'LE';
UPDATE agency_code SET display_order = 9 WHERE agency_code = 'OTHER';