CREATE UNIQUE INDEX app_user_activity_xref_adminsup_active_unique
ON app_user_activity_xref (activity_type, activity_identifier_ref, app_user_guid)
WHERE active_ind = true AND app_user_activity_xref_code = 'ADMINSUPRT';
