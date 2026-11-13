INSERT INTO app_user_activity_xref_code (
    app_user_activity_xref_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp)VALUES
  ('COLLABORAT', 'Collaborator', 'A person added as a collaborator on the activity.', 1, true, 'system', NOW(), NULL, NULL),
  ('ASSIGNEE', 'Primary investigator', 'A person assigned as the primary investigator on the activity.', 2, true, 'system', NOW(), NULL, NULL),
  ('SUPERVISOR', 'Supervisor', 'A person assigned as the supervisor on the activity.', 3, true, 'system', NOW(), NULL, NULL),
  ('FILECOORD', 'File coordinator', 'A person assigned as the file coordinator on the activity.', 4, true, 'system', NOW(), NULL, NULL)
ON CONFLICT (app_user_activity_xref_code) DO UPDATE SET
short_description = EXCLUDED.short_description,
long_description = EXCLUDED.long_description,
display_order = EXCLUDED.display_order,
active_ind = EXCLUDED.active_ind,
update_user_id = 'FLYWAY',
update_utc_timestamp = NOW();
