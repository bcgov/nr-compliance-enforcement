UPDATE hwcr_complaint_nature_code SET long_description = 'Livestock/pets - killed/injured - not present' WHERE hwcr_complaint_nature_code = 'LIVNCOU';
UPDATE hwcr_complaint_nature_code SET long_description = 'Livestock/pets - killed/injured - present/recent/suspected' WHERE hwcr_complaint_nature_code = 'LIVPRES';

-- Add unique constraing on staging_metadata_mapping for entity_code, staged_data_value, live_data_value
ALTER TABLE public.staging_metadata_mapping ADD CONSTRAINT staging_metadata_mapping_unique UNIQUE (entity_code, staged_data_value, live_data_value);

UPDATE staging_metadata_mapping SET live_data_value = 'LIVPRES' WHERE entity_code = 'cmpltntrcd' AND staged_data_value = 'Livestock/pets - killed/injured - present/recent (Coyote/Bobcat)';
UPDATE staging_metadata_mapping SET live_data_value = 'LIVPRES' WHERE entity_code = 'cmpltntrcd' AND staged_data_value = 'Livestock/pets - killed/injured - present/recent/suspected (Black/Grizzly Bear, Wolf, Cougar)';
UPDATE staging_metadata_mapping SET live_data_value = 'LIVNCOU' WHERE entity_code = 'cmpltntrcd' AND staged_data_value = 'Livestock/pets - killed/injured - not present (No Black/Grizzly Bear, Wolf, Cougar suspected)';

UPDATE hwcr_complaint SET hwcr_complaint_nature_code = 'LIVPRES'
WHERE hwcr_complaint_nature_code = (SELECT hwcr_complaint_nature_code FROM hwcr_complaint_nature_code WHERE short_description = LEFT('Livestock/pets - killed/injured - present/recent (Coyote/Bobcat)', 50));
UPDATE hwcr_complaint_nature_code set active_ind = false
WHERE hwcr_complaint_nature_code = (SELECT hwcr_complaint_nature_code FROM hwcr_complaint_nature_code WHERE short_description = LEFT('Livestock/pets - killed/injured - present/recent (Coyote/Bobcat)', 50));

UPDATE hwcr_complaint SET hwcr_complaint_nature_code = 'LIVPRES'
WHERE hwcr_complaint_nature_code = (SELECT hwcr_complaint_nature_code FROM hwcr_complaint_nature_code WHERE short_description = LEFT('Livestock/pets - killed/injured - present/recent/suspected (Black/Grizzly Bear, Wolf, Cougar)', 50));
UPDATE hwcr_complaint_nature_code set active_ind = false
WHERE hwcr_complaint_nature_code = (SELECT hwcr_complaint_nature_code FROM hwcr_complaint_nature_code WHERE short_description = LEFT('Livestock/pets - killed/injured - present/recent/suspected (Black/Grizzly Bear, Wolf, Cougar)', 50));

UPDATE hwcr_complaint SET hwcr_complaint_nature_code = 'LIVNCOU'
WHERE hwcr_complaint_nature_code = (SELECT hwcr_complaint_nature_code FROM hwcr_complaint_nature_code WHERE short_description = LEFT('Livestock/pets - killed/injured - not present (No Black/Grizzly Bear, Wolf, Cougar suspected)', 50));
UPDATE hwcr_complaint_nature_code set active_ind = false
WHERE hwcr_complaint_nature_code = (SELECT hwcr_complaint_nature_code FROM hwcr_complaint_nature_code WHERE short_description = LEFT('Livestock/pets - killed/injured - not present (No Black/Grizzly Bear, Wolf, Cougar suspected)', 50));