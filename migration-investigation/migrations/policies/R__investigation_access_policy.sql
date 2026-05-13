-- Policy to limit access to investigations based on the user's agency.
-- The logic is applied directly to investigation.investigation, and the other tables 
-- defer to it. This keeps the logic itself localized to a single policy to
-- avoid duplication and inconsistency.

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

ALTER TABLE investigation.investigation_party ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_investigation_party_access ON investigation.investigation_party;
CREATE POLICY policy_investigation_party_access ON investigation.investigation_party
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM investigation.investigation i
      WHERE i.investigation_guid = investigation_party.investigation_guid
    )
  );

ALTER TABLE investigation.officer_investigation_xref ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_officer_investigation_xref_access ON investigation.officer_investigation_xref;
CREATE POLICY policy_officer_investigation_xref_access ON investigation.officer_investigation_xref
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM investigation.investigation i
      WHERE i.investigation_guid = officer_investigation_xref.investigation_guid
    )
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

ALTER TABLE investigation.diary_date ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_diary_date_access ON investigation.diary_date;
CREATE POLICY policy_diary_date_access ON investigation.diary_date
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM investigation.investigation i
      WHERE i.investigation_guid = diary_date.investigation_guid
    )
  );

ALTER TABLE investigation.activity_note ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_activity_note_access ON investigation.activity_note;
CREATE POLICY policy_activity_note_access ON investigation.activity_note
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM investigation.investigation i
      WHERE i.investigation_guid = activity_note.investigation_guid
    )
  );

ALTER TABLE investigation.exhibit ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_exhibit_access ON investigation.exhibit;
CREATE POLICY policy_exhibit_access ON investigation.exhibit
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM investigation.investigation i
      WHERE i.investigation_guid = exhibit.investigation_guid
    )
  );

-- investigation_guid is nullable; NULL is therefore hidden.
ALTER TABLE investigation.contravention ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_contravention_access ON investigation.contravention;
CREATE POLICY policy_contravention_access ON investigation.contravention
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM investigation.investigation i
      WHERE i.investigation_guid = contravention.investigation_guid
    )
  );

-- Defers through investigation_party -> investigation. NULL investigation_party_guid is hidden.
ALTER TABLE investigation.investigation_business ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_investigation_business_access ON investigation.investigation_business;
CREATE POLICY policy_investigation_business_access ON investigation.investigation_business
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM investigation.investigation_party ip
      WHERE ip.investigation_party_guid = investigation_business.investigation_party_guid
    )
  );

ALTER TABLE investigation.investigation_person ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_investigation_person_access ON investigation.investigation_person;
CREATE POLICY policy_investigation_person_access ON investigation.investigation_person
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM investigation.investigation_party ip
      WHERE ip.investigation_party_guid = investigation_person.investigation_party_guid
    )
  );

ALTER TABLE investigation.contravention_party_xref ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_contravention_party_xref_access ON investigation.contravention_party_xref;
CREATE POLICY policy_contravention_party_xref_access ON investigation.contravention_party_xref
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM investigation.contravention c
      WHERE c.contravention_guid = contravention_party_xref.contravention_guid
    )
  );

ALTER TABLE investigation.enforcement_action ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_enforcement_action_access ON investigation.enforcement_action;
CREATE POLICY policy_enforcement_action_access ON investigation.enforcement_action
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM investigation.contravention_party_xref cpx
      WHERE cpx.contravention_party_xref_guid = enforcement_action.contravention_party_xref_guid
    )
  );

ALTER TABLE investigation.ticket ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_ticket_access ON investigation.ticket;
CREATE POLICY policy_ticket_access ON investigation.ticket
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM investigation.enforcement_action ea
      WHERE ea.enforcement_action_guid = ticket.enforcement_action_guid
    )
  );
