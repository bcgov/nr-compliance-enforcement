CREATE TABLE reported_by_code (
	reported_by_code varchar(10) NOT NULL,
	short_description varchar(50) NOT NULL,
	long_description varchar(250) NULL,
	display_order int4 NOT NULL,
	active_ind bool NOT NULL,
	create_user_id varchar(32) NOT NULL,
	create_utc_timestamp timestamp NOT NULL,
	update_user_id varchar(32) NOT NULL,
	update_utc_timestamp timestamp NOT NULL,
	CONSTRAINT "PK_reportedbycode" PRIMARY KEY (reported_by_code)
);

INSERT INTO
   reported_by_code (reported_by_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT '911', '911', '911', 1, 'Y', user, now(), user, now()
ON CONFLICT DO NOTHING;
INSERT INTO
   reported_by_code (reported_by_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT 'BCWF', 'BCWF', 'BC Wildlife Federation', 2, 'Y', user, now(), user, now()
ON CONFLICT DO NOTHING;
INSERT INTO
   reported_by_code (reported_by_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT 'BYLAW', 'Bylaw Enforcement', 'Bylaw Enforcement', 3, 'Y', user, now(), user, now()
ON CONFLICT DO NOTHING;
INSERT INTO
   reported_by_code (reported_by_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT 'CEB', 'FOR', 'Forestry Compliance and Enforcement Branch', 4, 'Y', user, now(), user, now()
ON CONFLICT DO NOTHING;
INSERT INTO
   reported_by_code (reported_by_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT 'COS', 'COS', 'Conservation Officer Service', 5, 'Y', user, now(), user, now()
ON CONFLICT DO NOTHING;
INSERT INTO
   reported_by_code (reported_by_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT 'DFO', 'DFO', 'Department of Fisheries and Oceans', 6, 'Y', user, now(), user, now()
ON CONFLICT DO NOTHING;
INSERT INTO
   reported_by_code (reported_by_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT 'EMAILRAPP', 'RAPP Email', 'RAPP Email', 7, 'Y', user, now(), user, now()
ON CONFLICT DO NOTHING;
INSERT INTO
   reported_by_code (reported_by_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT 'EPO', 'CEEB', 'Compliance and Environmental Enforcement Branch', 8, 'Y', user, now(), user, now()
ON CONFLICT DO NOTHING;
INSERT INTO
   reported_by_code (reported_by_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT 'LE', 'Police', 'RCMP', 9, 'Y', user, now(), user, now()
ON CONFLICT DO NOTHING;
INSERT INTO
   reported_by_code (reported_by_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT 'NRO', 'Natural Resource Officer', 'Natural Resource Officer', 10, 'Y', user, now(), user, now()
ON CONFLICT DO NOTHING;
INSERT INTO
   reported_by_code (reported_by_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT 'OTHER', 'Other', 'Other', 11, 'Y', user, now(), user, now()
ON CONFLICT DO NOTHING;
INSERT INTO
   reported_by_code (reported_by_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT 'SELF', 'Self', 'Self', 12, 'Y', user, now(), user, now()
ON CONFLICT DO NOTHING;

ALTER TABLE complaint DROP CONSTRAINT "FK_complaint_referred_by_agencycode";
ALTER TABLE complaint RENAME COLUMN referred_by_agency_code TO reported_by_code;
ALTER TABLE complaint RENAME COLUMN referred_by_agency_other_text TO reported_by_other_text;
ALTER TABLE complaint ADD CONSTRAINT "FK_complaint_reported_by_code" FOREIGN KEY (reported_by_code) REFERENCES reported_by_code(reported_by_code);

DELETE FROM agency_code WHERE agency_code in ('DFO', 'BCWF', 'BYLAW', 'CEB', 'LE', 'OTHER');