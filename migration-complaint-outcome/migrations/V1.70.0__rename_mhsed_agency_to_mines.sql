-- Rename the 'MHSED' outcome agency code to 'MINES'
-- I don't think there's data in any of these tables for MHSED, but for safety update all

INSERT INTO complaint_outcome.outcome_agency_code (
    outcome_agency_code, short_description, long_description, active_ind,
    create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp, display_order
)
SELECT 'MINES', short_description, long_description, active_ind,
       create_user_id, create_utc_timestamp, 'FLYWAY', NOW(), display_order
FROM complaint_outcome.outcome_agency_code
WHERE outcome_agency_code = 'MHSED'
ON CONFLICT (outcome_agency_code) DO NOTHING;

UPDATE complaint_outcome.assessment
    SET outcome_agency_code = 'MINES' WHERE outcome_agency_code = 'MHSED';
UPDATE complaint_outcome.complaint_outcome
    SET owned_by_agency_code = 'MINES' WHERE owned_by_agency_code = 'MHSED';
UPDATE complaint_outcome.case_note
    SET outcome_agency_code = 'MINES' WHERE outcome_agency_code = 'MHSED';
UPDATE complaint_outcome.hwcr_outcome_actioned_by_code
    SET outcome_agency_code = 'MINES' WHERE outcome_agency_code = 'MHSED';
UPDATE complaint_outcome.inaction_reason_code
    SET outcome_agency_code = 'MINES' WHERE outcome_agency_code = 'MHSED';
UPDATE complaint_outcome.prevention_education
    SET outcome_agency_code = 'MINES' WHERE outcome_agency_code = 'MHSED';
UPDATE complaint_outcome.decision
    SET outcome_agency_code = 'MINES' WHERE outcome_agency_code = 'MHSED';

DELETE FROM complaint_outcome.outcome_agency_code WHERE outcome_agency_code = 'MHSED';
