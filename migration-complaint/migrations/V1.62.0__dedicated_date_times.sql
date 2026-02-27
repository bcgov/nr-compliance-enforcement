ALTER TABLE complaint
    ADD COLUMN incident_utc_date DATE default null;
ALTER TABLE complaint
    ADD COLUMN incident_utc_time TIME default null;

COMMENT ON COLUMN complaint.incident_utc_date IS 'The date of the incident the complaint was filed about.';
COMMENT ON COLUMN complaint.incident_utc_time IS 'The time of the incident the complaint was filed about.';
