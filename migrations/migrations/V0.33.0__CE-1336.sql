UPDATE hwcr_complaint_nature_code SET long_description = 'Livestock/pets - killed/injured - not present' WHERE hwcr_complaint_nature_code = 'LIVNCOU';
UPDATE hwcr_complaint_nature_code SET long_description = 'Livestock/pets - killed/injured - present/recent/suspected' WHERE hwcr_complaint_nature_code = 'LIVPRES';

-- Add unique constraing on staging_metadata_mapping for entity_code, staged_data_value, live_data_value
ALTER TABLE public.staging_metadata_mapping ADD CONSTRAINT staging_metadata_mapping_unique UNIQUE (entity_code, staged_data_value, live_data_value);