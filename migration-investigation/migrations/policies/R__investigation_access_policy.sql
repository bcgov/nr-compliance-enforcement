-- Policy to limit access to investigations based on the user's agency.
-- Applied to investigation.investigation and investigation.task. Other child 
-- tables are not RLS-protected as they are reachable only through the parent 
-- investigation.

ALTER TABLE investigation.investigation ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_investigation_access ON investigation.investigation;
CREATE POLICY policy_investigation_access ON investigation.investigation
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
      -- Allow access when the row's owned_by_agency_ref matches the user's agency.
      WHEN owned_by_agency_ref = COALESCE(current_setting('jwt.claims.agency_code', true), '') THEN true
      -- Default: deny access
      ELSE false
    END
  );

ALTER TABLE investigation.task ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_task_access ON investigation.task;
CREATE POLICY policy_task_access ON investigation.task
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM investigation.investigation i
      WHERE i.investigation_guid = task.investigation_guid
    )
  );
