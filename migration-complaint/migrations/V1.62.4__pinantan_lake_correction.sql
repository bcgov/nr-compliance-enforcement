-- Correct the name of Pinantan Lake
UPDATE complaint.staging_metadata_mapping
  SET staged_data_value = 'Pinantan Lake'
  WHERE live_data_value = 'PINATNLK';
