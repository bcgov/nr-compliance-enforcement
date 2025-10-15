ALTER TABLE investigation
ADD COLUMN name character varying(100) NOT NULL DEFAULT '';

-- Populate name for existing records
WITH
  numbered_investigations AS (
    SELECT
      investigation_guid,
      ROW_NUMBER() OVER (
        ORDER BY
          create_utc_timestamp,
          investigation_guid
      ) as row_num
    FROM
      investigation
    WHERE
      name = ''
  )
UPDATE investigation
SET
  name = 'INVESTIGATION' || numbered_investigations.row_num
FROM
  numbered_investigations
WHERE
  investigation.investigation_guid = numbered_investigations.investigation_guid;

-- Add unique constraint scoped by owned agency
CREATE UNIQUE INDEX uq_investigation_name_agency ON investigation (name, owned_by_agency_ref);

COMMENT ON COLUMN investigation.name IS 'Business-friendly identifier for the investigation.';