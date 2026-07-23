-- Move the sex_code table to the shared schema

ALTER TABLE complaint_outcome.wildlife
    DROP CONSTRAINT fk_wildlife__sex_code;

ALTER TABLE complaint_outcome.wildlife
    RENAME COLUMN sex_code TO sex_code_ref;

ALTER TABLE complaint_outcome.wildlife
    ALTER COLUMN sex_code_ref TYPE character varying(16);

COMMENT ON COLUMN complaint_outcome.wildlife.sex_code_ref IS 'Unenforced FK to shared.sex_code.  A human readable code used to identify a sex type.';

DROP TRIGGER IF EXISTS sexcd_set_default_audit_values ON complaint_outcome.sex_code;

DROP TABLE complaint_outcome.sex_code;
