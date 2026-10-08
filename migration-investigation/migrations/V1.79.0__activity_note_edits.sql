ALTER TABLE activity_note
ADD COLUMN edited_utc_timestamp TIMESTAMP;

ALTER TABLE activity_note
ADD COLUMN edited_app_user_guid_ref UUID;

COMMENT ON COLUMN investigation.activity_note.edited_utc_timestamp IS 'The timestamp when the activity note was last edited by a user. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN investigation.activity_note.edited_app_user_guid_ref IS 'Unenforced foreign key so shared.app_user.app_user_guid: System generated unique identifier for the app user that last edited the activity note.';