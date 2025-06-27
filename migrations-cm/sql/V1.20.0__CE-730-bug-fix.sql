--
-- Remove not null constraint from drug_remaining_outcome_code
-- 
ALTER TABLE case_management.drug_administered
ALTER COLUMN drug_remaining_outcome_code
DROP NOT NULL;