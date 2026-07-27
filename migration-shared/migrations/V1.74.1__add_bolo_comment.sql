-- Add BOLO COMMENT field
ALTER TABLE shared.person
ADD COLUMN bolo_comment text;

COMMENT ON COLUMN shared.person.bolo_ind IS 'Indicates the reason why the person has a caution flag (BOLO).';

ALTER TABLE shared.business
ADD COLUMN bolo_ind boolean;

COMMENT ON COLUMN shared.business.bolo_ind IS 'Indicates whether the business has a caution flag or advises officers to be on the lookout (BOLO).';

ALTER TABLE shared.business
ADD COLUMN bolo_comment text;

COMMENT ON COLUMN shared.business.bolo_ind IS 'Indicates the reason why the business has a caution flag (BOLO).';