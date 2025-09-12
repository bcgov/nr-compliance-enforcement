-- Drop case_code table
DROP TABLE IF EXISTS case_management.case_code CASCADE;

ALTER TABLE case_management.case_file
DROP COLUMN IF EXISTS case_code;

-- Drop lead table and migrate lead_identifier to case_file.complaint_identifier
ALTER TABLE case_management.case_file
ADD COLUMN complaint_identifier VARCHAR(20);

UPDATE case_management.case_file
SET
  complaint_identifier = (
    SELECT
      lead_identifier
    FROM
      case_management.lead
    WHERE
      lead.case_identifier = case_file.case_file_guid
    LIMIT
      1
  );

ALTER TABLE case_management.lead
DROP CONSTRAINT IF EXISTS FK_lead__case_identifier;

DROP TRIGGER IF EXISTS lead_history_trigger ON case_management.lead;

DROP TABLE IF EXISTS case_management.lead CASCADE;

DROP TABLE IF EXISTS case_management.lead_h CASCADE;

-- Rename case_file to complaint_outcome
ALTER TABLE IF EXISTS case_management.case_file
RENAME TO complaint_outcome;

ALTER TABLE IF EXISTS case_management.case_file_h
RENAME TO complaint_outcome_h;

ALTER TABLE case_management.complaint_outcome
RENAME COLUMN case_file_guid TO complaint_outcome_guid;

ALTER TABLE case_management.prevention_education
RENAME COLUMN case_file_guid TO complaint_outcome_guid;

ALTER TABLE case_management.assessment
RENAME COLUMN case_file_guid TO complaint_outcome_guid;

ALTER TABLE case_management.case_note
RENAME COLUMN case_file_guid TO complaint_outcome_guid;

ALTER TABLE case_management.decision
RENAME COLUMN case_file_guid TO complaint_outcome_guid;

ALTER TABLE case_management.action
RENAME COLUMN case_guid TO complaint_outcome_guid;

ALTER TABLE case_management.wildlife
RENAME COLUMN case_file_guid TO complaint_outcome_guid;

ALTER TABLE case_management.site
RENAME COLUMN case_file_guid TO complaint_outcome_guid;

ALTER TABLE case_management.authorization_permit
RENAME COLUMN case_file_guid TO complaint_outcome_guid;

ALTER TABLE case_management.complaint_outcome_h
RENAME COLUMN h_case_file_guid TO h_complaint_outcome_guid;

DROP TRIGGER IF EXISTS case_file_history_trigger ON case_management.complaint_outcome;

CREATE TRIGGER complaint_outcome_history_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON case_management.complaint_outcome FOR EACH ROW EXECUTE FUNCTION case_management.audit_history ('complaint_outcome_h', 'complaint_outcome_guid');

ALTER TABLE IF EXISTS case_management.agency_code
RENAME TO outcome_agency_code;

ALTER TABLE case_management.outcome_agency_code
RENAME COLUMN agency_code TO outcome_agency_code;

ALTER TABLE case_management.hwcr_outcome_actioned_by_code
RENAME COLUMN agency_code TO outcome_agency_code;

ALTER TABLE case_management.inaction_reason_code
RENAME COLUMN agency_code TO outcome_agency_code;

ALTER TABLE case_management.case_note
RENAME COLUMN agency_code TO outcome_agency_code;

ALTER TABLE case_management.prevention_education
RENAME COLUMN agency_code TO outcome_agency_code;

ALTER TABLE case_management.decision
RENAME COLUMN lead_agency_code TO outcome_agency_code;

ALTER TABLE case_management.assessment
RENAME COLUMN assessed_by_agency_code TO outcome_agency_code;