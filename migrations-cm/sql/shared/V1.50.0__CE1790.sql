ALTER TABLE shared.case_file
RENAME COLUMN case_status TO status;

ALTER TABLE shared.case_file
RENAME COLUMN case_opened_utc_timestamp TO opened_utc_timestamp;

ALTER TABLE shared.case_file
RENAME COLUMN owned_by_agency TO lead_agency;

ALTER TABLE shared.case_activity
RENAME COLUMN case_activity_type TO activity_type;

ALTER TABLE shared.case_activity
RENAME COLUMN case_activity_identifier_ref TO activity_identifier_ref;