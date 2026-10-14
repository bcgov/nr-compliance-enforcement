-- Inactivate the business numbers of inactive parties
UPDATE business_identifier bi
SET active_ind = false, update_user_id = 'FLYWAY', update_utc_timestamp = now()
FROM business b
JOIN party p ON p.party_guid = b.party_guid
WHERE bi.business_guid = b.business_guid
  AND p.active_ind = false
  AND bi.active_ind = true;
