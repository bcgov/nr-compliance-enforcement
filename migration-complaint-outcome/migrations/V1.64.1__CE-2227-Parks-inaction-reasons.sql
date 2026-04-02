-- Add Parks inaction codes

INSERT INTO complaint_outcome.inaction_reason_code VALUES ('PKDUPLCT', 'PARKS', 'Duplicate', 'Duplicate', 1, true, 'postgres', now(), 'postgres', now());
INSERT INTO complaint_outcome.inaction_reason_code VALUES ('PKNOPSFTYC', 'PARKS', 'No public safety concern', 'No public safety concern', 2, true, 'postgres', now(), 'postgres', now());
INSERT INTO complaint_outcome.inaction_reason_code VALUES ('PKOTHOPRTY', 'PARKS', 'Other operational priorities', 'Other operational priorities', 3, true, 'postgres', now(), 'postgres', now());
INSERT INTO complaint_outcome.inaction_reason_code VALUES ('PKOUTSDMT', 'PARKS', 'Outside mandate', 'Outside mandate', 40, true, 'postgres', now(), 'postgres', now());

-- Remap assessments owned by Parks (outcome_agency_code) that still reference COS inaction codes.
UPDATE complaint_outcome.assessment a
SET
    inaction_reason_code = CASE a.inaction_reason_code
        WHEN 'DUPLICATE' THEN 'PKDUPLCT'
        WHEN 'NOPUBSFTYC' THEN 'PKNOPSFTYC'
        WHEN 'OTHOPRPRTY' THEN 'PKOTHOPRTY'
        WHEN 'OUTSDCOSMT' THEN 'PKOUTSDMT'
    END,
    update_user_id = 'postgres',
    update_utc_timestamp = now()
WHERE a.outcome_agency_code = 'PARKS'
    AND a.inaction_reason_code IN ('DUPLICATE', 'NOPUBSFTYC', 'OTHOPRPRTY', 'OUTSDCOSMT');
