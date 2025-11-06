ALTER TABLE investigation.investigation
ADD COLUMN created_by_app_user_guid_ref UUID;

COMMENT ON COLUMN investigation.investigation.created_by_app_user_guid_ref IS 'Foreign key to app_user. The user who created this investigation. This is a business field separate from the audit create_user_id column.';