-- Policy to limit access to COS ERS complaints based on user roles, referrals, and collaborations
-- This policy applies to complaint.complaint and complaint.allegation_complaint tables

-- Enable Row Level Security on complaint.complaint if not already enabled
ALTER TABLE complaint.complaint ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security on complaint.allegation_complaint if not already enabled
ALTER TABLE complaint.allegation_complaint ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS policy_cos_ers_complaints ON complaint.complaint;
DROP POLICY IF EXISTS policy_cos_ers_allegation_complaints ON complaint.allegation_complaint;

-- Create policy for complaint.complaint table
CREATE POLICY policy_cos_ers_complaints ON complaint.complaint
  FOR ALL
  USING (
    -- First check: Deny access if JWT token is expired
    -- jwt.claims.exp is in milliseconds, compare with current timestamp in milliseconds
    (COALESCE(current_setting('jwt.claims.exp', true), '0')::bigint) >= (EXTRACT(EPOCH FROM NOW()) * 1000)::bigint
    AND
    -- For non-COS/ERS complaints, allow access (no restrictions)
    -- For COS/ERS complaints, apply additional restrictions
    (
      NOT (owned_by_agency_code_ref = 'COS' AND complaint_type_code = 'ERS')
      OR
      -- Condition 1: User has COS role
      (',' || COALESCE(current_setting('jwt.claims.user_roles', true), '') || ',' LIKE '%,COS,%')
      OR
      -- Condition 2: User's role matches referred_by_agency_code_ref in complaint_referral
      EXISTS (
        SELECT 1
        FROM complaint.complaint_referral cr
        WHERE cr.complaint_identifier = complaint.complaint_identifier
        AND (',' || COALESCE(current_setting('jwt.claims.user_roles', true), '') || ',' LIKE '%,' || cr.referred_by_agency_code_ref || ',%')
      )
      OR
      -- Condition 3: User is a collaborator on the complaint
      EXISTS (
        SELECT 1
        FROM complaint.app_user_complaint_xref aucx
        INNER JOIN shared.app_user au ON au.app_user_guid = aucx.app_user_guid_ref
        WHERE aucx.complaint_identifier = complaint.complaint_identifier
        AND aucx.app_user_complaint_xref_code = 'COLLABORAT'
        AND au.auth_user_guid::text = COALESCE(current_setting('jwt.claims.idir_user_guid', true), '')
        AND (au.deactivate_ind = false OR au.deactivate_ind IS NULL)
      )
    )
  );

-- Create policy for complaint.allegation_complaint table
-- This policy checks the parent complaint.complaint table for access control
CREATE POLICY policy_cos_ers_allegation_complaints ON complaint.allegation_complaint
  FOR ALL
  USING (
    -- First check: Deny access if JWT token is expired
    -- The 'exp' claim here is set using JavaScript's Date.now(), which returns milliseconds since epoch,
    -- EXTRACT(EPOCH FROM NOW()) returns seconds since epocg so we multiply by 1000
    (COALESCE(current_setting('jwt.claims.exp', true), '0')::bigint) >= (EXTRACT(EPOCH FROM NOW()) * 1000)::bigint
    AND
    -- Check access through the parent complaint
    EXISTS (
      SELECT 1
      FROM complaint.complaint c
      WHERE c.complaint_identifier = allegation_complaint.complaint_identifier
      AND (
        -- For non-COS/ERS complaints, allow access and bypass the upcoming logic
        NOT (c.owned_by_agency_code_ref = 'COS' AND c.complaint_type_code = 'ERS')
        OR
        -- Condition 1: User has COS role
        -- Roles come in as a comma separated list. This prepends and appends a comma to the list
        -- so we can use LIKE to check for the role to avoid false negatives on ,<role>, for the first
        -- and last roles of the list, or a list of one, while also avoiding a name overlap causing a false
        -- postive
        (',' || COALESCE(current_setting('jwt.claims.user_roles', true), '') || ',' LIKE '%,COS,%')
        OR
        -- Condition 2: User's role matches referred_by_agency_code_ref in complaint_referral
        EXISTS (
          SELECT 1
          FROM complaint.complaint_referral cr
          WHERE cr.complaint_identifier = c.complaint_identifier
          AND (',' || COALESCE(current_setting('jwt.claims.user_roles', true), '') || ',' LIKE '%,' || cr.referred_by_agency_code_ref || ',%')
        )
        OR
        -- Condition 3: User is a collaborator on the complaint
        EXISTS (
          SELECT 1
          FROM complaint.app_user_complaint_xref aucx
          INNER JOIN shared.app_user au ON au.app_user_guid = aucx.app_user_guid_ref
          WHERE aucx.complaint_identifier = c.complaint_identifier
          AND aucx.app_user_complaint_xref_code = 'COLLABORAT'
          AND au.auth_user_guid::text = COALESCE(current_setting('jwt.claims.idir_user_guid', true), '')
          AND (au.deactivate_ind = false OR au.deactivate_ind IS NULL)
        )
      )
    )
  );
