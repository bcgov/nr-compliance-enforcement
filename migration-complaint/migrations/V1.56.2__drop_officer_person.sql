ALTER TABLE complaint_referral
DROP CONSTRAINT IF EXISTS "FK_cmplreferral__officer_guid";

ALTER TABLE app_user_team_xref
DROP CONSTRAINT IF EXISTS "officer_team_xref_officer_fk";

ALTER TABLE linked_complaint_xref
DROP CONSTRAINT IF EXISTS "FK_lnkcmplxref_person_guid";

ALTER TABLE person_complaint_xref
DROP CONSTRAINT IF EXISTS "FK_person_complaint_xref__person_guid";

ALTER TABLE officer
DROP CONSTRAINT IF EXISTS "FK_officer_person";

DROP TRIGGER IF EXISTS officer_history_trigger ON officer;

DROP TRIGGER IF EXISTS person_history_trigger ON person;

DROP TRIGGER IF EXISTS person_complaint_xref_trigger ON person_complaint_xref;

DROP TABLE IF EXISTS officer CASCADE;

DROP TABLE IF EXISTS officer_h CASCADE;

DROP TABLE IF EXISTS person CASCADE;

DROP TABLE IF EXISTS person_h CASCADE;

ALTER TABLE complaint_referral
DROP COLUMN IF EXISTS officer_guid;

ALTER TABLE app_user_team_xref
DROP COLUMN IF EXISTS officer_guid;

ALTER TABLE linked_complaint_xref
DROP COLUMN IF EXISTS person_guid;

ALTER TABLE person_complaint_xref
DROP COLUMN IF EXISTS person_guid;

DROP INDEX IF EXISTS idx_user_source_officer_guid;

DROP INDEX IF EXISTS idx_user_source_person_guid;

-- Maybe we want to keep these for reference?
--ALTER TABLE app_user
--DROP COLUMN IF EXISTS source_officer_guid;
--ALTER TABLE app_user
--DROP COLUMN IF EXISTS source_person_guid;