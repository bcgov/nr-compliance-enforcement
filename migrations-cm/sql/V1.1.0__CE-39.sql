--
-- Drop PoC Table
--

DROP TABLE
  case_management.users;

--
-- CREATE TABLE sex_code
--
CREATE TABLE
  case_management.sex_code (
    sex_code varchar(10) NOT NULL,
    short_description varchar(50) NOT NULL,
    long_description varchar(250) NULL,
    display_order int4 NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_sexcode" PRIMARY KEY (sex_code)
  );

--
-- CREATE TABLE age_code
--
CREATE TABLE
  case_management.age_code (
    age_code varchar(10) NOT NULL,
    short_description varchar(50) NOT NULL,
    long_description varchar(250) NULL,
    display_order int4 NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_agecode" PRIMARY KEY (age_code)
  );

--
-- CREATE TABLE threat_level_code
--
CREATE TABLE
  case_management.threat_level_code (
    threat_level_code varchar(10) NOT NULL,
    short_description varchar(50) NOT NULL,
    long_description varchar(250) NULL,
    display_order int4 NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_thrtlvlcd" PRIMARY KEY (threat_level_code)
  );

--
-- CREATE TABLE conflict_history_code
--
CREATE TABLE
  case_management.conflict_history_code (
    conflict_history_code varchar(10) NOT NULL,
    short_description varchar(50) NOT NULL,
    long_description varchar(250) NULL,
    display_order int4 NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_cnfthistcd" PRIMARY KEY (conflict_history_code)
  );

--
-- CREATE TABLE ear_code
--
CREATE TABLE
  case_management.ear_code (
    ear_code varchar(10) NOT NULL,
    short_description varchar(50) NOT NULL,
    long_description varchar(250) NULL,
    display_order int4 NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_earcode" PRIMARY KEY (ear_code)
  );

--
-- CREATE TABLE drug_code
--
CREATE TABLE
  case_management.drug_code (
    drug_code varchar(10) NOT NULL,
    short_description varchar(50) NOT NULL,
    long_description varchar(250) NULL,
    display_order int4 NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_drugcode" PRIMARY KEY (drug_code)
  );

--
-- CREATE TABLE drug_method_code
--
CREATE TABLE
  case_management.drug_method_code (
    drug_method_code varchar(10) NOT NULL,
    short_description varchar(50) NOT NULL,
    long_description varchar(250) NULL,
    display_order int4 NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_drgmethdcd" PRIMARY KEY (drug_method_code)
  );

--
-- CREATE TABLE drug_remaining_outcome_code
--
CREATE TABLE
  case_management.drug_remaining_outcome_code (
    drug_remaining_outcome_code varchar(10) NOT NULL,
    short_description varchar(50) NOT NULL,
    long_description varchar(250) NULL,
    display_order int4 NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_drgrmotccd" PRIMARY KEY (drug_remaining_outcome_code)
  );

--
-- CREATE TABLE hwcr_outcome_code
--
CREATE TABLE
  case_management.hwcr_outcome_code (
    hwcr_outcome_code varchar(10) NOT NULL,
    short_description varchar(50) NOT NULL,
    long_description varchar(250) NULL,
    display_order int4 NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_hwcrotcmcd" PRIMARY KEY (hwcr_outcome_code)
  );

--
-- INSERT INTO sex_code
--
insert into sex_code (sex_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
values('M', 'Male', 'Male', 1, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('F', 'Female', 'Female', 2, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('U', 'Unknown', 'Unknown', 3, true, 'FLYWAY', now(), 'FLYWAY', now());
   

--
-- INSERT INTO age_code
--
insert into age_code (age_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
values('ADLT', 'Adult', 'Adult', 1, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('YRLN', 'Yearling', 'Yearling', 2, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('YOFY', 'Young of the year', 'Young of the year', 3, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('UNKN', 'Unknown', 'Unknown', 4, true, 'FLYWAY', now(), 'FLYWAY', now()); 

--
-- INSERT INTO threat_level_code
--
insert into threat_level_code (threat_level_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
values('1', 'Category 1', 'Category 1', 1, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('2', 'Category 2', 'Category 2', 2, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('3', 'Category 3', 'Category 3', 3, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('U', 'Unknown', 'Unknown', 4, true, 'FLYWAY', now(), 'FLYWAY', now());

--
-- INSERT INTO conflict_history_code
--
insert into conflict_history_code (conflict_history_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
values('L', 'Low', 'Low', 1, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('M', 'Medium', 'Medium', 2, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('H', 'High', 'High', 3, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('U', 'Unknown', 'Unknown', 4, true, 'FLYWAY', now(), 'FLYWAY', now());

--
-- INSERT INTO ear_code
--
insert into ear_code (ear_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
values('L', 'Left', 'Left', 1, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('R', 'Right', 'Right', 2, true, 'FLYWAY', now(), 'FLYWAY', now());

--
-- INSERT INTO drug_code
--
insert into drug_code (drug_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
values('ATPMZ', 'Atipamezole', 'Atipamezole', 1, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('BAMII', 'BAM II', 'Butorphanol Azaperone Medetomidine', 2, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('MDTMD', 'Medetomidine', 'Medetomidine', 3, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('NLTRX', 'Naltrexone', 'Naltrexone', 4, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('ZLTIL', 'Zoletil', 'Zoletil', 5, true, 'FLYWAY', now(), 'FLYWAY', now());

--
-- INSERT INTO drug_method_code
--
insert into drug_method_code (drug_method_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
values('DART', 'Dart', 'Dart', 1, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('HINJ', 'Hand injection', 'Hand injection', 2, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('PSRG', 'Pole syringe', 'Pole syringe', 3, true, 'FLYWAY', now(), 'FLYWAY', now());

--
-- INSERT INTO drug_remaining_outcome_code
--
insert into drug_remaining_outcome_code (drug_remaining_outcome_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
values('DISC', 'Discarded', 'Discarded', 1, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('STOR', 'Storage', 'Storage', 2, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('RDIS', 'Reverse distribution', 'Reverse distribution', 3, true, 'FLYWAY', now(), 'FLYWAY', now());


--
-- INSERT INTO hwcr_outcome_code
--
insert into hwcr_outcome_code (hwcr_outcome_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
values('DEADONARR', 'Dead on arrival', 'Dead on arrival', 1, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('DESTRYCOS', 'Destroyed by COS', 'Destroyed by COS', 2, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('DESTRYOTH', 'Destroyed by other', 'Destroyed by other', 3, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('GONEONARR', 'Gone on arrival', 'Gone on arrival', 4, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('REFRTOBIO', 'Referred to biologist', 'Referred to biologist', 5, true, 'FLYWAY', now(), 'FLYWAY', now()),      
      ('SHRTRELOC', 'Short-distance relocation', 'Short-distance relocation', 6, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('TRANSLCTD', 'Translocated', 'Translocated', 7, true, 'FLYWAY', now(), 'FLYWAY', now()),
      ('TRANSREHB', 'Transfer to rehab', 'Transfer to rehab', 8, true, 'FLYWAY', now(), 'FLYWAY', now());