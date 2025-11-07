ALTER TABLE shared.case_file
ADD COLUMN created_by_app_user_guid UUID REFERENCES app_user (app_user_guid);

COMMENT ON COLUMN shared.case_file.created_by_app_user_guid IS 'Foreign key to app_user. The user who created this case file. This is a business field separate from the audit create_user_id column.';