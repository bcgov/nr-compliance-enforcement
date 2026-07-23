-- Split exhibit.collected_utc_timestamp into separate date and time columns

ALTER TABLE exhibit
  ADD COLUMN collected_utc_date date,
  ADD COLUMN collected_utc_time time without time zone;

COMMENT ON COLUMN exhibit.collected_utc_date IS 'The UTC date on which the exhibit was collected.';
COMMENT ON COLUMN exhibit.collected_utc_time IS 'The UTC time at which the exhibit was collected.';

-- Backfill from the existing timestamp so no collection data is lost
UPDATE exhibit
SET collected_utc_date = collected_utc_timestamp::date,
    collected_utc_time = collected_utc_timestamp::time;

ALTER TABLE exhibit
  ALTER COLUMN collected_utc_date SET NOT NULL;

ALTER TABLE exhibit
  DROP COLUMN collected_utc_timestamp;