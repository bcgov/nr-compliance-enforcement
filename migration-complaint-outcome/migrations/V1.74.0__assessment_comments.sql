ALTER TABLE complaint_outcome.assessment
    ADD COLUMN comments VARCHAR(4000);

COMMENT ON COLUMN complaint_outcome.assessment.comments IS 'Free-text comments recorded against an assessment.';
