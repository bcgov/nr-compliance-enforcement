ALTER TABLE investigation.investigation
ADD COLUMN supervisor_guid_ref UUID;

ALTER TABLE investigation.investigation
ADD COLUMN primary_investigator_guid_ref UUID;

ALTER TABLE investigation.investigation
ADD COLUMN file_coordinator_guid_ref UUID;

ALTER TABLE investigation.investigation
ADD COLUMN discovery_date timestamp without time zone NOT NULL DEFAULT now ();

COMMENT ON COLUMN investigation.investigation.supervisor_guid_ref IS 'ID of the user who is a team commander/supervisor of this investigation. This is a business field separate from the audit create_user_id column.';

COMMENT ON COLUMN investigation.investigation.primary_investigator_guid_ref IS 'ID of the user who is a primary investor of this investigation. This is a business field separate from the audit create_user_id column.';

COMMENT ON COLUMN investigation.investigation.file_coordinator_guid_ref IS 'ID of the user who is a file coordinator with this investigation. This is a business field separate from the audit create_user_id column.';

COMMENT ON COLUMN investigation.investigation.discovery_date IS 'The timestamp when the investigation was discovered.';