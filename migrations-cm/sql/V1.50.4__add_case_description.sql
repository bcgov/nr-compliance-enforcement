ALTER TABLE shared.case_file
ADD COLUMN description TEXT;

COMMENT ON COLUMN shared.case_file.description IS 'Optional text description for the case file providing additional context or notes';