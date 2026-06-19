-- Re-sequence existing investigations with an "OLD" pattern (e.g. INV26-OLD001). 
-- New inspections are numbered from the case so they can't collide
UPDATE investigation.investigation
SET name = '__reseq__' || investigation_guid::text;

WITH numbered AS (
  SELECT
    investigation_guid,
    investigation_opened_utc_timestamp,
    ROW_NUMBER() OVER (ORDER BY investigation_opened_utc_timestamp ASC, investigation_guid ASC) AS rn
  FROM investigation.investigation
)
UPDATE investigation.investigation i
SET name =
  'INV'
    || to_char((numbered.investigation_opened_utc_timestamp AT TIME ZONE 'UTC') AT TIME ZONE 'America/Vancouver', 'YY')
    || '-'
    || left('OLD', GREATEST(0, 6 - GREATEST(3, length(numbered.rn::text))))
    || lpad(numbered.rn::text, GREATEST(3, length(numbered.rn::text)), '0')
FROM numbered
WHERE i.investigation_guid = numbered.investigation_guid;
