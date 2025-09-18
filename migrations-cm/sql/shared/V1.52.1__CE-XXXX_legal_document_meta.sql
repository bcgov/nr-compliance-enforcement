-- Add metadata columns to shared.legal_document
ALTER TABLE shared.legal_document
ADD COLUMN chapter VARCHAR(32),
ADD COLUMN year_enacted INT,
ADD COLUMN assented_to VARCHAR(64);

COMMENT ON COLUMN shared.legal_document.chapter IS 'Document chapter number from XML metadata (e.g., 53).';

COMMENT ON COLUMN shared.legal_document.year_enacted IS 'Year enacted from XML metadata (e.g., 2003).';

COMMENT ON COLUMN shared.legal_document.assented_to IS 'Assent date text from XML metadata (e.g., October 23, 2003).';