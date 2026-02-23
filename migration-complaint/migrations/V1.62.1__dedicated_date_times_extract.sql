UPDATE complaint
SET
    incident_utc_date = incident_utc_datetime::DATE,
    incident_utc_time = incident_utc_datetime::TIME
WHERE incident_utc_datetime IS NOT NULL;
