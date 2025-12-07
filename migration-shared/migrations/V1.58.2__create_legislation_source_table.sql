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

COMMENT ON COLUMN legislation_source.source_url IS 'Full URL to the BC Laws XML document (e.g., https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/03053_00_multi/xml)';

COMMENT ON COLUMN legislation_source.agency_code IS 'Agency code to associate imported legislation with via legislation_agency_xref';

COMMENT ON COLUMN legislation_source.last_import_timestamp IS 'Timestamp of the last successful import';

COMMENT ON COLUMN legislation_source.imported_ind IS 'Whether this source has been imported. If true, the import job will skip it.';

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
    TRUE,
    'FLYWAY'
  );