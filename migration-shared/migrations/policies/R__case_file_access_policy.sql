-- Policy to limit access to case files based on the user's agency.
-- The logic is applied directly to shared.case_file, and the other tables defer to it. 
-- This keeps the logic itself localized to a single policy to avoid duplication and inconsistency.

ALTER TABLE shared.case_file ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS policy_case_file_access ON shared.case_file;

CREATE POLICY policy_case_file_access ON shared.case_file
  FOR ALL
  USING (
    -- Use CASE to guarantee short-circuit on the first condition that is true
    CASE
      -- Allow access if the user's idir_user_guid claim is not set
      -- This allows mutations to bypass the RLS policy for now.
      WHEN COALESCE(current_setting('jwt.claims.idir_user_guid', true), '') = '' THEN true
      -- Verify JWT token is not expired if it is set
      -- jwt.claims.exp is in seconds, compare with current timestamp in seconds
      WHEN (COALESCE(current_setting('jwt.claims.exp', true), '0')::bigint) < EXTRACT(EPOCH FROM NOW())::bigint THEN false
      -- Allow access when the row's lead_agency matches the user's agency. The mapping from
      -- Keycloak role name to agency_code is computed by the application in setRlsClaims and
      -- passed in as jwt.claims.agency_code so this policy stays schema-self-contained.
      WHEN lead_agency = COALESCE(current_setting('jwt.claims.agency_code', true), '') THEN true
      -- Default: deny access
      ELSE false
    END
  );

ALTER TABLE shared.case_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS policy_case_activity_access ON shared.case_activity;

-- Defers to the shared.case_file policy
CREATE POLICY policy_case_activity_access ON shared.case_activity
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM shared.case_file cf
      WHERE cf.case_file_guid = case_activity.case_file_guid
    )
  );
