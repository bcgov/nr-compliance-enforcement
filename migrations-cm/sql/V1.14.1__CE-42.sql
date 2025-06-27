--
-- CREATE TABLE equipment_code
--

CREATE TABLE
  case_management.equipment_code (
    equipment_code varchar(10) NOT NULL,
    short_description varchar(50) NOT NULL,
    long_description varchar(250) NULL,
    display_order int4 NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_equipmntcd" PRIMARY KEY (equipment_code)
  );


--
-- INSERT INTO equipment_code
--

insert into equipment_code (equipment_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
values('BRSNR', 'Bear snare', 'Bear snare', 1, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('BRLTR', 'Bear live trap', 'Bear live trap', 2, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('CRFTR', 'Cougar foothold trap', 'Cougar foothold trap', 3, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('CRLTR', 'Cougar live trap', 'Cougar live trap', 4, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('NKSNR', 'Neck snare', 'Neck snare', 5, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('SIGNG', 'Signage', 'Signage', 6, true, 'FLYWAY', now(), 'FLYWAY', now()), 
      ('TRCAM', 'Trail camera', 'Trail camera', 7, true, 'FLYWAY', now(), 'FLYWAY', now()); 