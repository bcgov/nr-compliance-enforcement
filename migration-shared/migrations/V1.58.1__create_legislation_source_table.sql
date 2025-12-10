CREATE TABLE
  IF NOT EXISTS legislation_source (
    legislation_source_guid UUID PRIMARY KEY DEFAULT public.uuid_generate_v4 (),
    short_description VARCHAR(64) NOT NULL,
    long_description VARCHAR(256),
    source_url VARCHAR(512) NOT NULL,
    agency_code VARCHAR(10) NOT NULL,
    active_ind BOOLEAN NOT NULL DEFAULT TRUE,
    imported_ind BOOLEAN NOT NULL DEFAULT FALSE,
    last_import_timestamp TIMESTAMP,
    create_user_id VARCHAR(32) NOT NULL,
    create_utc_timestamp TIMESTAMP NOT NULL DEFAULT NOW (),
    update_user_id VARCHAR(32),
    update_utc_timestamp TIMESTAMP,
    CONSTRAINT fk_legislation_source_agency FOREIGN KEY (agency_code) REFERENCES agency_code (agency_code)
  );

COMMENT ON TABLE legislation_source IS 'Defines BC Laws XML documents to be imported into the legislation table';

COMMENT ON COLUMN legislation_source.legislation_source_guid IS 'Primary key. Unique identifier for this legislation source record.';

COMMENT ON COLUMN legislation_source.short_description IS 'Short name or title for this legislation source (e.g., Environmental Management Act).';

COMMENT ON COLUMN legislation_source.long_description IS 'Optional longer description with additional context about this legislation source.';

COMMENT ON COLUMN legislation_source.source_url IS 'Full URL to the BC Laws XML document (e.g., https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/03053_00_multi/xml).';

COMMENT ON COLUMN legislation_source.agency_code IS 'Foreign key to agency_code. Defines which agency this legislation source belongs to.';

COMMENT ON COLUMN legislation_source.active_ind IS 'Whether this source is active. Inactive sources will not be imported.';

COMMENT ON COLUMN legislation_source.imported_ind IS 'Whether this source has been imported. If true, the import job will skip it.';

COMMENT ON COLUMN legislation_source.last_import_timestamp IS 'Timestamp of the last successful import. NULL if never imported.';

COMMENT ON COLUMN legislation_source.create_user_id IS 'The id of the user that created this record.';

COMMENT ON COLUMN legislation_source.create_utc_timestamp IS 'The timestamp when this record was created. Stored in UTC with no offset.';

COMMENT ON COLUMN legislation_source.update_user_id IS 'The id of the user that last updated this record.';

COMMENT ON COLUMN legislation_source.update_utc_timestamp IS 'The timestamp when this record was last updated. Stored in UTC with no offset.';

ALTER TABLE legislation
ADD COLUMN IF NOT EXISTS legislation_source_guid UUID;

ALTER TABLE legislation ADD CONSTRAINT fk_legislation_source FOREIGN KEY (legislation_source_guid) REFERENCES legislation_source (legislation_source_guid) ON DELETE SET NULL;

COMMENT ON COLUMN legislation.legislation_source_guid IS 'Reference to the legislation_source that this legislation was imported from. Only set on top-level (root) records.';

INSERT INTO
  legislation_source (
    short_description,
    long_description,
    source_url,
    agency_code,
    active_ind,
    create_user_id
  )
VALUES
  (
    'Environmental Management Act',
    'British Columbia Environmental Management Act - SBC 2003 Chapter 53',
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/03053_00_multi/xml',
    'COS',
    FALSE,
    'FLYWAY'
  );

INSERT INTO
  legislation_source (
    short_description,
    long_description,
    source_url,
    agency_code,
    active_ind,
    create_user_id
  )
VALUES
  (
    'Park Act',
    'British Columbia Park Act - [RSBC 1996] CHAPTER 344',
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96344_01/xml',
    'PARKS',
    FALSE,
    'FLYWAY'
  );