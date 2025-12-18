-- Drop the legislation_agency_xref table and related objects
-- Agency filtering should be done via legislation_source.agency_code
DROP TRIGGER IF EXISTS legislation_agency_xref_history_trigger ON shared.legislation_agency_xref;

DROP TABLE IF EXISTS shared.legislation_agency_xref_h;

DROP TABLE IF EXISTS shared.legislation_agency_xref;

-- Increase the size of the citation, full_citation, and section_title columns
ALTER TABLE shared.legislation
ALTER COLUMN citation TYPE VARCHAR(128);

ALTER TABLE shared.legislation
ALTER COLUMN full_citation TYPE VARCHAR(1024);

ALTER TABLE shared.legislation
ALTER COLUMN section_title TYPE VARCHAR(128);

-- Add import status and log columns to legislation_source
ALTER TABLE shared.legislation_source
ADD COLUMN IF NOT EXISTS import_status VARCHAR(16) DEFAULT 'PENDING';

ALTER TABLE shared.legislation_source
ADD COLUMN IF NOT EXISTS last_import_log TEXT;

COMMENT ON COLUMN shared.legislation_source.import_status IS 'Status of the last import attempt: PENDING, SUCCESS, or FAILED.';

COMMENT ON COLUMN shared.legislation_source.last_import_log IS 'Log message or error details from the last import attempt.';