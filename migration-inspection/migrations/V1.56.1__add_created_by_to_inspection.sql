ALTER TABLE inspection.inspection
ADD COLUMN created_by_app_user_guid_ref UUID;

COMMENT ON COLUMN inspection.inspection.created_by_app_user_guid_ref IS 'ID of the user who created this inspection. This is a business field separate from the audit create_user_id column.';