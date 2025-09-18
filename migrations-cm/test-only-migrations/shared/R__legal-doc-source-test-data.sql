-- Test-only data for legal document sources
INSERT INTO
  shared.legal_document_source (source_url, create_user_id, create_utc_timestamp)
VALUES
  (
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/03053_00_multi/xml',
    'FLYWAY',
    NOW ()
  ) ON CONFLICT (source_url) DO NOTHING;