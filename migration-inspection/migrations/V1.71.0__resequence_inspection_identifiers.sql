-- Re-sequence existing inspections with an "OLD" pattern (e.g. INSP26-OLD001). 
-- New inspections are numbered from the case so they can't collide
UPDATE inspection.inspection
SET name = '__reseq__' || inspection_guid::text;

WITH numbered AS (
  SELECT
    inspection_guid,
    inspection_opened_utc_timestamp,
    ROW_NUMBER() OVER (ORDER BY inspection_opened_utc_timestamp ASC, inspection_guid ASC) AS rn
  FROM inspection.inspection
)
UPDATE inspection.inspection i
SET name =
  'INSP'
    || to_char((numbered.inspection_opened_utc_timestamp AT TIME ZONE 'UTC') AT TIME ZONE 'America/Vancouver', 'YY')
    || '-'
    || left('OLD', GREATEST(0, 6 - GREATEST(3, length(numbered.rn::text))))
    || lpad(numbered.rn::text, GREATEST(3, length(numbered.rn::text)), '0')
FROM numbered
WHERE i.inspection_guid = numbered.inspection_guid;
