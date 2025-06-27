-- Prior data migration set case_note_guid for all actions related to a complaint, this script will set case_note_guid to NULL for all actions that are not related to a note.
UPDATE case_management.action
SET case_note_guid = NULL
WHERE action_type_action_xref_guid != (select action_type_action_xref_guid from action_type_action_xref where action_code = 'UPDATENOTE' and action_type_code='CASEACTION' and active_ind=true);

