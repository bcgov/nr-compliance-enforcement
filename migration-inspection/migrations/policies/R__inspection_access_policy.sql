-- Policy to limit access to inspections based on the user's agency.
-- Applied only to inspection.inspection. Child tables are not RLS-protected
-- as they are reachable only through the parent inspection.

ALTER TABLE inspection.inspection ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_inspection_access ON inspection.inspection;
CREATE POLICY policy_inspection_access ON inspection.inspection
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
