--
-- ALTER TABLE wildlife
-- add missing active_ind column
--
ALTER TABLE IF EXISTS case_management.wildlife
ADD COLUMN IF NOT EXISTS active_ind boolean;

--comment
COMMENT ON COLUMN case_management.wildlife.active_ind is 'A boolean indicator to determine if the wildlife record is active.';

--
-- ALTER TABLE ear_tag
-- add missing active_ind column
--
ALTER TABLE IF EXISTS case_management.ear_tag
ADD COLUMN IF NOT EXISTS active_ind boolean;

--comment
COMMENT ON COLUMN case_management.ear_tag.active_ind is 'A boolean indicator to determine if the ear_tag record is active.';

--
-- ALTER TABLE drug_administered
-- add missing active_ind column
--
ALTER TABLE IF EXISTS case_management.drug_administered
ADD COLUMN IF NOT EXISTS active_ind boolean;

--comment
COMMENT ON COLUMN case_management.drug_administered.active_ind is 'A boolean indicator to determine if the drug_administered record is active.';