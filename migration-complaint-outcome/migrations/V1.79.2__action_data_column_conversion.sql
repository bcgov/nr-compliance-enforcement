-- action.action_date holds a calendar date, not a point in time.
-- Convert it from timestamp (stored as UTC) to date.
--
-- Existing values fall into two groups:
--   1. Local midnight stored as UTC (exactly 06:00, 07:00 or 08:00 UTC).
--      The UTC date is the date the user picked, in both Pacific and Mountain time.
--   2. The moment the action was saved, in UTC.
--      These are converted to Pacific time before taking the date.
--
-- There is a special case with the second group.   Actions that are saved between 11 PM
-- and midnight Pacific time could be belong to either the current calendar date for Pacific
-- users, or the next calendar date for Mountain users.   4 complaints were found in production
-- that fell into this window that were created by a user with a Home office in Mountain time.
-- For these complaints the timezone of the users home office is used in the conversion.
--
-- Further complicating this is the fact that for case notes we need to preserve the time so 
-- a new action_time column has been created for these.   Moving forward only actions of this type
-- will have a time.

ALTER TABLE complaint_outcome.action
  ADD COLUMN action_time time;

-- The update below is a data conversion, not a user change, so keep it out of the history table.
ALTER TABLE complaint_outcome.action DISABLE TRIGGER action_history_trigger;

UPDATE complaint_outcome.action
SET action_time = action_date::time
WHERE case_note_guid IS NOT NULL;

ALTER TABLE complaint_outcome.action ENABLE TRIGGER action_history_trigger;

ALTER TABLE complaint_outcome.action
  ALTER COLUMN action_date TYPE date
  USING (
    CASE
      WHEN case_note_guid IS NOT NULL THEN action_date::date
      WHEN action_date::time IN ('06:00:00', '07:00:00', '08:00:00') THEN action_date::date
      WHEN complaint_outcome_guid IN (
        'e5ae2da3-39b8-4986-8ca1-9f097566fffb', -- 25-036180 (Fort St. John)
        'f1eb728f-f076-4e0d-a96f-fe3e3b93dca8', -- 25-900778 (Fort St. John)
        '6b04c984-00fb-4493-96a4-b44339cad398'  -- 26-030550 (Chetwynd)
      ) THEN (action_date AT TIME ZONE 'UTC' AT TIME ZONE 'America/Dawson_Creek')::date
      WHEN complaint_outcome_guid = '3c84542a-6cd3-4a0d-b6c7-9bb5dbb03a28' -- 26-010457 (Golden)
        THEN (action_date AT TIME ZONE 'UTC' AT TIME ZONE 'America/Edmonton')::date
      ELSE (action_date AT TIME ZONE 'UTC' AT TIME ZONE 'America/Vancouver')::date
    END
  );