ALTER TABLE inspection
ADD COLUMN name character varying(100) NOT NULL DEFAULT '';

-- Populate name for existing records
WITH
  numbered_inspections AS (
    SELECT
      inspection_guid,
      ROW_NUMBER() OVER (
        ORDER BY
          create_utc_timestamp,
          inspection_guid
      ) as row_num
    FROM
      inspection
    WHERE
      name = ''
  )
UPDATE inspection
SET
  name = 'INSPECTION' || numbered_inspections.row_num
FROM
  numbered_inspections
WHERE
  inspection.inspection_guid = numbered_inspections.inspection_guid;

-- Add unique constraint scoped by owned agency
CREATE UNIQUE INDEX uq_inspection_name_agency ON inspection (name, owned_by_agency_ref);

COMMENT ON COLUMN inspection.name IS 'Business-friendly identifier for the inspection.';