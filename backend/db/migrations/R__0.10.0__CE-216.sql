--
-- insert new BCPARK agency
--
INSERT INTO
   agency_code (agency_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT 'PARKS', 'BC Parks', 'BC Parks', 1, 'Y', user, now(), user, now()
WHERE NOT EXISTS
        (SELECT agency_code
         FROM agency_code
         WHERE agency_code = 'PARKS');