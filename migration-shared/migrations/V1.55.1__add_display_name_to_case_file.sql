ALTER TABLE case_file
ADD COLUMN name character varying(100) NOT NULL DEFAULT '';

-- Populate name for existing records
WITH
  numbered_cases AS (
    SELECT
      case_file_guid,
      ROW_NUMBER() OVER (
        ORDER BY
          create_utc_timestamp,
          case_file_guid
      ) as row_num
    FROM
      case_file
    WHERE
      name = ''
  )
UPDATE case_file
SET
  name = 'CASE' || numbered_cases.row_num
FROM
  numbered_cases
WHERE
  case_file.case_file_guid = numbered_cases.case_file_guid;

-- Add unique constraint scoped by lead agency
CREATE UNIQUE INDEX uq_case_file_name_agency ON case_file (name, lead_agency);

COMMENT ON COLUMN case_file.name IS 'Business-friendly identifier for the case file.';