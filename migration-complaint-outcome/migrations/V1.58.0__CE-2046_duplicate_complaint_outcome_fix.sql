-- Updates to consolidate duplicate complaint_outcome_guid references
-- For each complaint_identifier with multiple complaint_outcome records,
-- update all references to point to the oldest complaint_outcome_guid.
-- Tables which reference the complaint_outcome.complaint_outcome table are:
-- - complaint_outcome.action
-- - complaint_outcome.assessment
-- - complaint_outcome.authorization_permit
-- - complaint_outcome.case_note
-- - complaint_outcome.decision
-- - complaint_outcome.prevention_education
-- - complaint_outcome.site
-- - complaint_outcome.wildlife
-- Once references have been updated, the duplicate complaint_outcome_guid records are deleted.
BEGIN;

-- Create and populate temporary tables

-- All complaint ids with multiple complaint_outcome records
CREATE TEMP TABLE duplicate_complaint_identifiers (
    complaint_identifier VARCHAR(20) PRIMARY KEY
);
INSERT INTO duplicate_complaint_identifiers (complaint_identifier)
SELECT complaint_identifier
FROM complaint_outcome.complaint_outcome
WHERE complaint_identifier IS NOT NULL
GROUP BY complaint_identifier
HAVING COUNT(*) > 1;

-- All complaint_outcome_guids referencing a complaint_identifier with multiple complaint_outcome records
-- The row number rn is used to rank the complaint outcomes from oldest (1) to newest for their given
-- complaint_identifier, based on the create_utc_timestamp value. 
CREATE TEMP TABLE affected_complaint_outcome_guids AS
SELECT 
    co.complaint_identifier,
    co.complaint_outcome_guid AS co_guid,
    ROW_NUMBER() OVER (
        PARTITION BY co.complaint_identifier 
        ORDER BY co.create_utc_timestamp ASC, co.complaint_outcome_guid ASC
    ) AS rn
FROM complaint_outcome.complaint_outcome co
INNER JOIN duplicate_complaint_identifiers dci
    ON co.complaint_identifier = dci.complaint_identifier;

-- The complaint_outcome_guid that will be used as the consolidation target on that complaint_identifier
CREATE TEMP TABLE target_guids AS
SELECT complaint_identifier, co_guid AS oldest_guid
FROM affected_complaint_outcome_guids
WHERE rn = 1;

-- The complaint_outcome_guids that will be deleted after the consolidation is complete (all but the target)
CREATE TEMP TABLE deletion_candidate_guids AS
SELECT co_guid AS complaint_outcome_guid
FROM affected_complaint_outcome_guids
WHERE rn > 1;

-- Update all references to the complaint_outcome_guid to the target_guid
-- Update action table
UPDATE complaint_outcome.action a
SET complaint_outcome_guid = tg.oldest_guid
FROM target_guids tg
INNER JOIN complaint_outcome.complaint_outcome co 
    ON co.complaint_identifier = tg.complaint_identifier
WHERE a.complaint_outcome_guid = co.complaint_outcome_guid
    AND a.complaint_outcome_guid != tg.oldest_guid;

-- Update assessment table
UPDATE complaint_outcome.assessment a
SET complaint_outcome_guid = tg.oldest_guid
FROM target_guids tg
INNER JOIN complaint_outcome.complaint_outcome co 
    ON co.complaint_identifier = tg.complaint_identifier
WHERE a.complaint_outcome_guid = co.complaint_outcome_guid
    AND a.complaint_outcome_guid != tg.oldest_guid;

-- Update authorization_permit table
UPDATE complaint_outcome.authorization_permit ap
SET complaint_outcome_guid = tg.oldest_guid
FROM target_guids tg
INNER JOIN complaint_outcome.complaint_outcome co 
    ON co.complaint_identifier = tg.complaint_identifier
WHERE ap.complaint_outcome_guid = co.complaint_outcome_guid
    AND ap.complaint_outcome_guid != tg.oldest_guid;

-- Update case_note table
UPDATE complaint_outcome.case_note cn
SET complaint_outcome_guid = tg.oldest_guid
FROM target_guids tg
INNER JOIN complaint_outcome.complaint_outcome co 
    ON co.complaint_identifier = tg.complaint_identifier
WHERE cn.complaint_outcome_guid = co.complaint_outcome_guid
    AND cn.complaint_outcome_guid != tg.oldest_guid;

-- Update decision table
UPDATE complaint_outcome.decision d
SET complaint_outcome_guid = tg.oldest_guid
FROM target_guids tg
INNER JOIN complaint_outcome.complaint_outcome co 
    ON co.complaint_identifier = tg.complaint_identifier
WHERE d.complaint_outcome_guid = co.complaint_outcome_guid
    AND d.complaint_outcome_guid != tg.oldest_guid;

-- Update prevention_education table
UPDATE complaint_outcome.prevention_education pe
SET complaint_outcome_guid = tg.oldest_guid
FROM target_guids tg
INNER JOIN complaint_outcome.complaint_outcome co 
    ON co.complaint_identifier = tg.complaint_identifier
WHERE pe.complaint_outcome_guid = co.complaint_outcome_guid
    AND pe.complaint_outcome_guid != tg.oldest_guid;

-- Update site table
UPDATE complaint_outcome.site s
SET complaint_outcome_guid = tg.oldest_guid
FROM target_guids tg
INNER JOIN complaint_outcome.complaint_outcome co 
    ON co.complaint_identifier = tg.complaint_identifier
WHERE s.complaint_outcome_guid = co.complaint_outcome_guid
    AND s.complaint_outcome_guid != tg.oldest_guid;

-- Update wildlife table
UPDATE complaint_outcome.wildlife w
SET complaint_outcome_guid = tg.oldest_guid
FROM target_guids tg
INNER JOIN complaint_outcome.complaint_outcome co 
    ON co.complaint_identifier = tg.complaint_identifier
WHERE w.complaint_outcome_guid = co.complaint_outcome_guid
    AND w.complaint_outcome_guid != tg.oldest_guid;

-- Update the update_utc_timestamp and update_user_id on the complaint_outcome record
UPDATE complaint_outcome.complaint_outcome co
SET 
    update_utc_timestamp = CURRENT_TIMESTAMP,
    update_user_id = CURRENT_USER
FROM target_guids tg
WHERE co.complaint_outcome_guid = tg.oldest_guid;

-- Delete complaint_outcome records that are no longer referenced
-- (all references have been consolidated to the oldest_guid)
DELETE FROM complaint_outcome.complaint_outcome co
WHERE co.complaint_outcome_guid IN (
    SELECT complaint_outcome_guid FROM deletion_candidate_guids
);

-- Clean up temporary tables
DROP TABLE IF EXISTS deletion_candidate_guids;
DROP TABLE IF EXISTS target_guids;
DROP TABLE IF EXISTS affected_complaint_outcome_guids;
DROP TABLE IF EXISTS duplicate_complaint_identifiers;

COMMIT;

-- Add a unique constraint to ensure only one record per complaint_identifier
ALTER TABLE complaint_outcome.complaint_outcome
    ADD CONSTRAINT uq_complaint_outcome_complaint_identifier UNIQUE (complaint_identifier);
