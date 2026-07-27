-- Add BOLO COMMENT field
ALTER TABLE investigation.investigation_person
ADD COLUMN bolo_comment text;

COMMENT ON COLUMN investigation.investigation_person.bolo_ind IS 'Indicates the reason why the person has a caution flag (BOLO).';

ALTER TABLE investigation.investigation_business
ADD COLUMN bolo_ind boolean;

COMMENT ON COLUMN investigation.investigation_business.bolo_ind IS 'Indicates whether the business has a caution flag or advises officers to be on the lookout (BOLO).';

ALTER TABLE investigation.investigation_business
ADD COLUMN bolo_comment text;

COMMENT ON COLUMN investigation.investigation_business.bolo_ind IS 'Indicates the reason why the business has a caution flag (BOLO).';