ALTER TABLE case_management.decision
DROP CONSTRAINT fk_decision__rationale_code;

ALTER TABLE case_management.decision
RENAME COLUMN rationale_code TO rationale_text;

ALTER TABLE case_management.decision
ALTER COLUMN rationale_text TYPE varchar(4000);

DROP TABLE if exists case_management.rationale_code;