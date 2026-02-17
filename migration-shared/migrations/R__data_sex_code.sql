INSERT INTO shared.sex_code VALUES
  ('M', 'Male', 'Male', 1, true, 'system', NOW(), NULL, NULL),
  ('F', 'Female', 'Female', 2, true, 'system', NOW(), NULL, NULL),
  ('U', 'Unknown', 'Unknown', 3, true, 'system', NOW(), NULL, NULL)
  ON CONFLICT DO NOTHING;
