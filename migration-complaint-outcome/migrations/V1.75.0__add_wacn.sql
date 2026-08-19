ALTER TABLE complaint_outcome.prevention_education
ADD COLUMN wacn_amount INTEGER;

COMMENT ON COLUMN complaint_outcome.prevention_education.wacn_amount IS 'The amount of Wildlife Attractant Compliance Notices are issued.';