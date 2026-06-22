-- indexes for the collaborator plus case activity list/search

-- Matches the RLS collaborator subquery in policy_cos_ers_complaints
CREATE INDEX IF NOT EXISTS idx_app_user_auth_user_guid_normalized
  ON shared.app_user (UPPER(REPLACE(auth_user_guid::text, '-', '')));

CREATE INDEX IF NOT EXISTS idx_case_file_lead_agency_status
  ON shared.case_file (lead_agency, case_status);

CREATE INDEX IF NOT EXISTS idx_case_activity_activity_identifier_ref
  ON shared.case_activity (activity_identifier_ref);
