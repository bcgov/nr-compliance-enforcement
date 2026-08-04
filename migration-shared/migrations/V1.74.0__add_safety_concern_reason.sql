-- Add BOLO COMMENT field
ALTER TABLE shared.person
ADD COLUMN safety_concern_reason text;

COMMENT ON COLUMN shared.person.safety_concern_reason IS 'Indicates the reason why the person has a safety concern flag.';

ALTER TABLE shared.business
ADD COLUMN safety_concern_ind boolean;

COMMENT ON COLUMN shared.business.safety_concern_ind IS 'Indicates whether the business has a safety concern flag.';

ALTER TABLE shared.business
ADD COLUMN safety_concern_reason text;

COMMENT ON COLUMN shared.business.safety_concern_ind IS 'Indicates the reason why the business has a safety concern flag.';

ALTER TABLE shared.person
RENAME COLUMN bolo_ind TO safety_concern_ind;

-- COMMENT ON COLUMN shared.person.bolo_ind IS 'Indicates whether the person has a caution flag or advises officers to be on the lookout (BOLO) for the invdividual.';
