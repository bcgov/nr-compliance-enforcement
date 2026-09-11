-- Deactivate old contact methods for test that are now not surfaced in the UI
UPDATE contact_method cm
SET active_ind = false, update_user_id = 'FLYWAY', update_utc_timestamp = now()
FROM party p
WHERE p.party_guid = cm.party_guid
  AND p.party_type = 'ORG'
  AND cm.address_guid IS NULL
  AND cm.active_ind = true;
