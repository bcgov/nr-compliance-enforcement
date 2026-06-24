-- Foreign-key indexes on complaint_outcome child tables

CREATE INDEX IF NOT EXISTS idx_action_complaint_outcome_guid
  ON complaint_outcome.action (complaint_outcome_guid);

CREATE INDEX IF NOT EXISTS idx_assessment_complaint_outcome_guid
  ON complaint_outcome.assessment (complaint_outcome_guid);

CREATE INDEX IF NOT EXISTS idx_authorization_permit_complaint_outcome_guid
  ON complaint_outcome.authorization_permit (complaint_outcome_guid);

CREATE INDEX IF NOT EXISTS idx_case_note_complaint_outcome_guid
  ON complaint_outcome.case_note (complaint_outcome_guid);

CREATE INDEX IF NOT EXISTS idx_decision_complaint_outcome_guid
  ON complaint_outcome.decision (complaint_outcome_guid);

CREATE INDEX IF NOT EXISTS idx_prevention_education_complaint_outcome_guid
  ON complaint_outcome.prevention_education (complaint_outcome_guid);

CREATE INDEX IF NOT EXISTS idx_site_complaint_outcome_guid
  ON complaint_outcome.site (complaint_outcome_guid);

CREATE INDEX IF NOT EXISTS idx_wildlife_complaint_outcome_guid
  ON complaint_outcome.wildlife (complaint_outcome_guid);
