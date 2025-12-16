-- Policy to limit access to COS ERS complaints based on user roles, referrals, and collaborations.
-- This policy applies to complaint.complaint and complaint.allegation_complaint tables, and the
-- complaint_outcome.complaint_outcome tables. The logic is applied directly to the complaint.complaint
-- table, and the other tables defer to it. This keeps the logic itself localized to a single policy to
-- avoid duplication and inconsistency.

-- Enable Row Level Security on complaint.complaint if not already enabled
ALTER TABLE complaint.complaint ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS policy_cos_ers_complaints ON complaint.complaint;

-- Create policy for complaint.complaint table
CREATE POLICY policy_cos_ers_complaints ON complaint.complaint
  FOR ALL
  USING (
    -- Use CASE to guarantee short-circuit on the first condition that is true
    CASE
      -- First check: allow access if the user's idir_user_guid claim is not set
      -- This allows mutations to bypass the RLS policy for now.
      WHEN COALESCE(current_setting('jwt.claims.idir_user_guid', true), '') = '' THEN true
      -- Second check: verify JWT token is not expired if it is set
      -- jwt.claims.exp is in seconds, compare with current timestamp in seconds
      WHEN (COALESCE(current_setting('jwt.claims.exp', true), '0')::bigint) < EXTRACT(EPOCH FROM NOW())::bigint THEN false
      -- Third check: for non-COS/ERS complaints, allow access (no restrictions)
      WHEN NOT (owned_by_agency_code_ref = 'COS' AND complaint_type_code = 'ERS') THEN true
      -- Fourth check: for COS/ERS complaints, verify user has access via one of:
      -- - COS role
      -- - Referral (from requesting users agency)
      -- - Collaborator
      WHEN (
        (',' || COALESCE(current_setting('jwt.claims.client_roles', true), '') || ',' LIKE '%,COS,%')
        OR
        -- Roles come in as a comma separated list. This prepends and appends a comma to the list
        -- so we can use LIKE to check for the role to avoid false negatives on ,<role>, for the first
        -- and last roles of the list, or a list of one, while also avoiding a name overlap causing a false
        -- postive
        EXISTS (
          SELECT 1
          FROM complaint.complaint_referral cr
          WHERE cr.complaint_identifier = complaint.complaint_identifier
          AND (',' || COALESCE(current_setting('jwt.claims.client_roles', true), '') || ',' LIKE '%,' || cr.referred_by_agency_code_ref || ',%')
        )
        OR
        -- NOTE: This block accesses the shared schema to get the app_user_guid
        -- associated with the querying user's auth_user_guid
        EXISTS (
          SELECT 1
          FROM complaint.app_user_complaint_xref aucx
          INNER JOIN shared.app_user au ON au.app_user_guid = aucx.app_user_guid_ref
          WHERE aucx.complaint_identifier = complaint.complaint_identifier
          AND aucx.app_user_complaint_xref_code = 'COLLABORAT'
          AND au.auth_user_guid::text = COALESCE(current_setting('jwt.claims.idir_user_guid', true), '')
          AND (au.deactivate_ind = false OR au.deactivate_ind IS NULL)
        )
      ) THEN true
      -- Default: deny access
      ELSE false
    END
  );

-- Enable Row Level Security on complaint.allegation_complaint if not already enabled
ALTER TABLE complaint.allegation_complaint ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS policy_cos_ers_allegation_complaints ON complaint.allegation_complaint;
-- Create policy for complaint.allegation_complaint table
-- This policy defers to the complaint.complaint policy to determine access rights
CREATE POLICY policy_cos_ers_allegation_complaints ON complaint.allegation_complaint
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM complaint.complaint c
      WHERE c.complaint_identifier = allegation_complaint.complaint_identifier
    )
  );

-- Enable Row Level Security on complaint.complaint if not already enabled
ALTER TABLE complaint_outcome.complaint_outcome ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS policy_cos_ers_complaint_outcome ON complaint_outcome.complaint_outcome;

-- Create policy for complaint.allegation_complaint table
-- This policy defers to the complaint.complaint policy to determine access rights
CREATE POLICY policy_cos_ers_complaint_outcome ON complaint_outcome.complaint_outcome
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM complaint.complaint c
      WHERE c.complaint_identifier = complaint_outcome.complaint_identifier
    )
  );
