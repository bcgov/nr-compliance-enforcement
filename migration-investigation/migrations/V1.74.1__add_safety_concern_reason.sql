-- Add BOLO COMMENT field
ALTER TABLE investigation.investigation_person
ADD COLUMN safety_concern_reason text;

COMMENT ON COLUMN investigation.investigation_person.safety_concern_reason IS 'Indicates the reason why the person has a safety concern flag.';

ALTER TABLE investigation.investigation_business
ADD COLUMN safety_concern_ind boolean;

COMMENT ON COLUMN investigation.investigation_business.safety_concern_ind IS 'Indicates whether the business has a safety concern flag.';

ALTER TABLE investigation.investigation_business
ADD COLUMN safety_concern_reason text;

COMMENT ON COLUMN investigation.investigation_business.safety_concern_reason IS 'Indicates the reason why the business has a safety concern flag.';

ALTER TABLE investigation.investigation_person
RENAME COLUMN bolo_ind TO safety_concern_ind;

-- COMMENT ON COLUMN investigation_person.bolo_ind IS 'Indicates whether the person has a caution flag or advises officers to be on the lookout (BOLO) for the invdividual.';