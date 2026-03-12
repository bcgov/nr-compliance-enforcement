-- Correct the name of Pinantan Lake
UPDATE complaint.staging_metadata_mapping
  SET staged_data_value = 'Pinantan Lake'
  WHERE staging_metadata_mapping_guid = 'dde36e04-f000-42ca-be52-4733516233c9';
