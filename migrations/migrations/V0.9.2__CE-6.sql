CREATE TABLE complaint_type_code (
	complaint_type_code varchar(10) NOT NULL,
	short_description varchar(50) NOT NULL,
    long_description varchar(250) NULL,
    display_order int4 NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_user_guid uuid NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_user_guid uuid NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_complainttypecode" PRIMARY KEY (complaint_type_code)
);

insert into complaint_type_code (complaint_type_code, short_description, long_description, display_order, active_ind, create_user_id, create_user_guid, create_utc_timestamp, update_user_id, update_user_guid, update_utc_timestamp)
values('HWCR', 'HWCR', 'Human Wildlife Conflict', 1, true, user, null, now(), user, null, now()),
      ('ERS', 'ERS', 'Enforcement', 2, true, user, null, now(), user, null, now());