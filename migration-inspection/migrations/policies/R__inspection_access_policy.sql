-- Policy to limit access to inspections based on the user's agency.
-- The logic is applied directly to inspection.inspection, and the other tables 
-- defer to it. This keeps the logic itself localized to a single policy to
-- avoid duplication and inconsistency.

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

ALTER TABLE inspection.inspection_party ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_inspection_party_access ON inspection.inspection_party;
CREATE POLICY policy_inspection_party_access ON inspection.inspection_party
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM inspection.inspection i
      WHERE i.inspection_guid = inspection_party.inspection_guid
    )
  );

ALTER TABLE inspection.officer_inspection_xref ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_officer_inspection_xref_access ON inspection.officer_inspection_xref;
CREATE POLICY policy_officer_inspection_xref_access ON inspection.officer_inspection_xref
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM inspection.inspection i
      WHERE i.inspection_guid = officer_inspection_xref.inspection_guid
    )
  );

-- Defers through inspection_party -> inspection. NULL inspection_party_guid is therefore hidden.
ALTER TABLE inspection.inspection_business ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_inspection_business_access ON inspection.inspection_business;
CREATE POLICY policy_inspection_business_access ON inspection.inspection_business
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM inspection.inspection_party ip
      WHERE ip.inspection_party_guid = inspection_business.inspection_party_guid
    )
  );

ALTER TABLE inspection.inspection_person ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_inspection_person_access ON inspection.inspection_person;
CREATE POLICY policy_inspection_person_access ON inspection.inspection_person
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM inspection.inspection_party ip
      WHERE ip.inspection_party_guid = inspection_person.inspection_party_guid
    )
  );
