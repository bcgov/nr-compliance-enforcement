ALTER TABLE legislation_source
ADD COLUMN source_type VARCHAR(16) NOT NULL DEFAULT 'BCLAWS';

INSERT INTO legislation_source (
  legislation_source_guid, short_description, long_description,
  source_url, agency_code, source_type,
  active_ind, imported_ind, import_status,
  create_user_id, create_utc_timestamp
) VALUES (
  gen_random_uuid(),
  'Criminal Code',
  'Criminal Code (R.S.C., 1985, c. C-46)',
  'https://laws-lois.justice.gc.ca/eng/XML/C-46.xml',
  'COS',
  'FEDERAL',
  false,
  false,
  'PENDING',
  'system',
  CURRENT_TIMESTAMP
);
