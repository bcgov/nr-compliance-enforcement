-- Hard code app_user_guid for test user so it can be reliably used in other test data.
UPDATE shared.app_user
SET
  app_user_guid = '63f8bda9-7cdc-42d5-a405-81f6bdb554f6'::uuid
WHERE
  user_id = 'ENCETST1';
