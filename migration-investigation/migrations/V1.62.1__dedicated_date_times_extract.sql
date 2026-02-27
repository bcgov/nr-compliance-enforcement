UPDATE activity_note
SET
    actioned_utc_date = actioned_utc_timestamp::DATE,
    actioned_utc_time = actioned_utc_timestamp::TIME
WHERE actioned_utc_timestamp IS NOT NULL;

UPDATE investigation
SET
    discovery_date_utc_date = discovery_date::DATE,
    discovery_date_utc_time = discovery_date::TIME
WHERE discovery_date IS NOT NULL;
