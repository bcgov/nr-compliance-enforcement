-- Records the shared party's update timestamp from when it was last updated

ALTER TABLE investigation_party
    ADD COLUMN party_update_utc_timestamp_ref timestamp without time zone;

COMMENT ON COLUMN investigation_party.party_update_utc_timestamp_ref IS
    'References shared.party.update_utc_timestamp as it stood when this local copy was last taken from, or pushed to, the shared party. Null indicates the party has no shared counterpart.';

-- For test we can use the investigation_party.update_utc_timestamp to populate
UPDATE investigation_party
SET party_update_utc_timestamp_ref = update_utc_timestamp
WHERE party_guid_ref IS NOT NULL;
