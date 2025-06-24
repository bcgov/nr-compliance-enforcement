-- CE-101 - WebEOC Staging Tables

CREATE TABLE staging_activity_code (
	staging_activity_code varchar(10) NOT NULL,
	short_description varchar(50) NOT NULL,
  long_description varchar(250) NULL,
  display_order int4 NOT NULL,
  active_ind bool NOT NULL,
  create_user_id varchar(32) NOT NULL,
  create_utc_timestamp timestamp NOT NULL,
  update_user_id varchar(32) NOT NULL,
  update_utc_timestamp timestamp NOT null,
  CONSTRAINT "PK_staging_activity_code" PRIMARY KEY (staging_activity_code)
);

CREATE TABLE staging_status_code (
	staging_status_code varchar(10) NOT NULL,
	short_description varchar(50) NOT NULL,
  long_description varchar(250) NULL,
  display_order int4 NOT NULL,
  active_ind bool NOT NULL,
  create_user_id varchar(32) NOT NULL,
  create_utc_timestamp timestamp NOT NULL,
  update_user_id varchar(32) NOT NULL,
  update_utc_timestamp timestamp NOT NULL,
  CONSTRAINT "PK_staging_status_code" PRIMARY KEY (staging_status_code)
);

CREATE TABLE entity_code (
	entity_code varchar(10) NOT NULL,
	short_description varchar(50) NOT NULL,
  long_description varchar(250) NULL,
  display_order int4 NOT NULL,
  active_ind bool NOT NULL,
  create_user_id varchar(32) NOT NULL,
  create_utc_timestamp timestamp NOT NULL,
  update_user_id varchar(32) NOT NULL,
  update_utc_timestamp timestamp NOT null,
  CONSTRAINT "PK_entity_code" PRIMARY KEY (entity_code)
);

create table staging_complaint (
	staging_complaint_guid uuid NOT NULL DEFAULT uuid_generate_v4(),
	staging_status_code varchar(10) NOT NULL,
	staging_activity_code varchar(10) NOT NULL,
	complaint_identifier varchar(20) NOT NULL,
	complaint_jsonb jsonb NOT NULL,
  create_user_id varchar(32) NOT NULL,
  create_utc_timestamp timestamp NOT NULL,
  update_user_id varchar(32) NOT NULL,
  update_utc_timestamp timestamp NOT null,
  CONSTRAINT "PK_staging_complaint" PRIMARY KEY (staging_complaint_guid),
  CONSTRAINT "staging_complaint_staging_status_code" FOREIGN KEY (staging_status_code) REFERENCES staging_status_code(staging_status_code),
  CONSTRAINT "staging_complaint_staging_staging_activity_code" FOREIGN KEY (staging_activity_code) REFERENCES staging_activity_code(staging_activity_code)
);

create table staging_metadata_mapping (
	staging_metadata_mapping_guid uuid NOT NULL DEFAULT uuid_generate_v4(),
	entity_code varchar(10) NOT NULL,
	staged_data_value varchar(120) NOT NULL,
	live_data_value varchar(10) NOT NULL,
  create_user_id varchar(32) NOT NULL,
  create_utc_timestamp timestamp NOT NULL,
  update_user_id varchar(32) NOT NULL,
  update_utc_timestamp timestamp NOT null,
  CONSTRAINT "PK_staging_metadata_mapping_guid" PRIMARY KEY (staging_metadata_mapping_guid),
  CONSTRAINT "staging_staging_metadata_mapping_entity_code" FOREIGN KEY (entity_code) REFERENCES entity_code(entity_code)
);