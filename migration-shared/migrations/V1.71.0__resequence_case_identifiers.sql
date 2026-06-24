-- Re-sequence existing case identifiers to the new pattern

UPDATE shared.case_file
SET name = '__reseq__' || case_file_guid::text;

WITH ordered AS (
  SELECT
    case_file_guid,
    'CASE'
      || to_char((opened_utc_timestamp AT TIME ZONE 'UTC') AT TIME ZONE 'America/Vancouver', 'YY')
      || '-'
      || lpad(
           (ROW_NUMBER() OVER (ORDER BY opened_utc_timestamp ASC, case_file_guid ASC))::text,
           6,
           '0'
         ) AS new_name
  FROM shared.case_file
)
UPDATE shared.case_file cf
SET name = ordered.new_name
FROM ordered
WHERE cf.case_file_guid = ordered.case_file_guid;

-- Increment by 1 to avoid collision
SELECT setval(
  'shared.case_sequence',
  GREATEST((SELECT COUNT(*) FROM shared.case_file), 1),
  (SELECT COUNT(*) FROM shared.case_file) > 0
);
