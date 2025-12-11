ALTER TABLE legislation
ADD COLUMN IF NOT EXISTS trailing_text TEXT;

COMMENT ON COLUMN legislation.trailing_text IS 'Text that appears after child elements';