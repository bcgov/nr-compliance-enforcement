CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--
-- creates new tables to support CEEB decisions
--
--
-- CREATE TABLE decision
--
CREATE TABLE
  case_management.decision (
    decision_guid uuid NOT NULL DEFAULT uuid_generate_v4 (),
    case_file_guid uuid NOT NULL,
    schedule_sector_xref_guid uuid NOT NULL,
    discharge_code varchar(10) NOT NULL,
    rationale_code varchar(10),
    inspection_number int4,
    lead_agency varchar(10),
    non_compliance_decision_matrix_code varchar(10) NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_decision_guid" PRIMARY KEY (decision_guid)
  );

comment on table case_management.decision is 'As a CEEB Compliance Coordinator or Officer, I need to be able to capture decision information to ensure that all information necessary in the decision making process can be captured in the complaint.';

comment on column case_management.decision.decision_guid is 'Unique identifier for the decision';

comment on column case_management.decision.case_file_guid is 'Assoiciates the decision record to an existing case file';

comment on column case_management.decision.schedule_sector_xref_guid is 'Defines the combination of a WDR_SCHEDULE_CODE and a SECTOR_CATEGORY_CODE';

comment on column case_management.decision.discharge_code is 'The discharge code related to a decision';

comment on column case_management.decision.rationale_code is 'The rationale code related to a CEEB decision';

comment on column case_management.decision.inspection_number is 'The NRIS inspection number for a CEEB decision';

comment on column case_management.decision.non_compliance_decision_matrix_code is '';

comment on column case_management.decision.active_ind is 'A boolean indicator to determine if the case management action is active.';

comment on column case_management.decision.create_user_id is 'The id of the user that created the case management action.';

comment on column case_management.decision.create_utc_timestamp is 'The timestamp when the case management action was created.  The timestamp is stored in UTC with no Offset.';

comment on column case_management.decision.update_user_id is 'The id of the user that updated the case management action.';

comment on column case_management.decision.update_utc_timestamp is 'The timestamp when the case management action was updated.  The timestamp is stored in UTC with no Offset.';

--
-- CREATE TABLE discharge_code
--
CREATE TABLE
  case_management.discharge_code (
    discharge_code varchar(10) NOT NULL,
    short_description varchar(50) NOT NULL,
    long_description varchar(250) NULL,
    display_order int4 NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_discharge_code" PRIMARY KEY (discharge_code)
  );

comment on table case_management.discharge_code is 'Contains a list of all possible discharge codes for a CEEB decision';

comment on column case_management.discharge_code.discharge_code is 'A human readable code used to identify a discharge code.';

comment on column case_management.discharge_code.short_description is 'The short description of a case management discharge_code.';

comment on column case_management.discharge_code.long_description is 'The long description of a case management discharge_code.';

comment on column case_management.discharge_code.active_ind is 'A boolean indicator to determine if the case management discharge_code is active.';

comment on column case_management.discharge_code.create_user_id is 'The id of the user that created the case management discharge_code.';

comment on column case_management.discharge_code.create_utc_timestamp is 'The timestamp when the case management discharge_code was created.  The timestamp is stored in UTC with no Offset.';

comment on column case_management.discharge_code.update_user_id is 'The id of the user that updated the case management discharge_code.';

comment on column case_management.discharge_code.update_utc_timestamp is 'The timestamp when the case management discharge_code was updated.  The timestamp is stored in UTC with no Offset.';

--
-- CREATE TABLE non_compliance_decision_matrix_code
--
CREATE TABLE
  case_management.non_compliance_decision_matrix_code (
    non_compliance_decision_matrix_code varchar(10) NOT NULL,
    short_description varchar(50) NOT NULL,
    long_description varchar(250) NULL,
    display_order int4 NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_non_compliance_decision_matrix_code" PRIMARY KEY (non_compliance_decision_matrix_code)
  );

comment on table case_management.non_compliance_decision_matrix_code is 'Contains a list of all possible non_compliance_decision_matrix_code codes for a CEEB decision';

comment on column case_management.non_compliance_decision_matrix_code.non_compliance_decision_matrix_code is 'A human readable code used to identify a non_compliance_decision_matrix_code code.';

comment on column case_management.non_compliance_decision_matrix_code.short_description is 'The short description of a case management non_compliance_decision_matrix_code.';

comment on column case_management.non_compliance_decision_matrix_code.long_description is 'The long description of a case management non_compliance_decision_matrix_code.';

comment on column case_management.non_compliance_decision_matrix_code.active_ind is 'A boolean indicator to determine if the case management non_compliance_decision_matrix_code is active.';

comment on column case_management.non_compliance_decision_matrix_code.create_user_id is 'The id of the user that created the case management non_compliance_decision_matrix_code.';

comment on column case_management.non_compliance_decision_matrix_code.create_utc_timestamp is 'The timestamp when the case management non_compliance_decision_matrix_code was created.  The timestamp is stored in UTC with no Offset.';

comment on column case_management.non_compliance_decision_matrix_code.update_user_id is 'The id of the user that updated the case management non_compliance_decision_matrix_code.';

comment on column case_management.non_compliance_decision_matrix_code.update_utc_timestamp is 'The timestamp when the case management non_compliance_decision_matrix_code was updated.  The timestamp is stored in UTC with no Offset.';

--
-- CREATE TABLE sector_code
--
CREATE TABLE
  case_management.sector_code (
    sector_code varchar(10) NOT NULL,
    short_description varchar(50) NOT NULL,
    long_description varchar(250) NULL,
    display_order int4 NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_sector_code" PRIMARY KEY (sector_code)
  );

comment on table case_management.sector_code is 'Contains a list of all possible sector_code codes for a CEEB decision';

comment on column case_management.sector_code.sector_code is 'A human readable code used to identify a ipm_secord_code';

comment on column case_management.sector_code.short_description is 'The short description of a case management sector_code.';

comment on column case_management.sector_code.long_description is 'The long description of a case management sector_code.';

comment on column case_management.sector_code.active_ind is 'A boolean indicator to determine if the case management sector_code is active.';

comment on column case_management.sector_code.create_user_id is 'The id of the user that created the case management sector_code.';

comment on column case_management.sector_code.create_utc_timestamp is 'The timestamp when the case management sector_code was created.  The timestamp is stored in UTC with no Offset.';

comment on column case_management.sector_code.update_user_id is 'The id of the user that updated the case management sector_code.';

comment on column case_management.sector_code.update_utc_timestamp is 'The timestamp when the case management sector_code was updated.  The timestamp is stored in UTC with no Offset.';

--
-- CREATE TABLE rational_code
--
CREATE TABLE
  case_management.rationale_code (
    rationale_code varchar(10) NOT NULL,
    short_description varchar(50) NOT NULL,
    long_description varchar(250) NULL,
    display_order int4 NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_rationale_code" PRIMARY KEY (rationale_code)
  );

comment on table case_management.rationale_code is 'Contains a list of all possible rationale_code codes for a CEEB decision';

comment on column case_management.rationale_code.rationale_code is 'A human readable code used to identify a rationale code.';

comment on column case_management.rationale_code.short_description is 'The short description of a case management rationale_code.';

comment on column case_management.rationale_code.long_description is 'The long description of a case management rationale_code.';

comment on column case_management.rationale_code.active_ind is 'A boolean indicator to determine if the case management rationale_code is active.';

comment on column case_management.rationale_code.create_user_id is 'The id of the user that created the case management rationale_code.';

comment on column case_management.rationale_code.create_utc_timestamp is 'The timestamp when the case management rationale_code was created.  The timestamp is stored in UTC with no Offset.';

comment on column case_management.rationale_code.update_user_id is 'The id of the user that updated the case management rationale_code.';

comment on column case_management.rationale_code.update_utc_timestamp is 'The timestamp when the case management rationale_code was updated.  The timestamp is stored in UTC with no Offset.';

--
-- CREATE TABLE schedule_code
--
CREATE TABLE
  case_management.schedule_code (
    schedule_code varchar(10) NOT NULL,
    short_description varchar(50) NOT NULL,
    long_description varchar(250) NULL,
    display_order int4 NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_schedule_code" PRIMARY KEY (schedule_code)
  );

comment on table case_management.schedule_code is 'Contains a list of all possible schedule_code codes for a CEEB decision';

comment on column case_management.schedule_code.schedule_code is 'A human readable code used to identify a wdr schedule code';

comment on column case_management.schedule_code.short_description is 'The short description of a case management schedule_code.';

comment on column case_management.schedule_code.long_description is 'The long description of a case management schedule_code.';

comment on column case_management.schedule_code.active_ind is 'A boolean indicator to determine if the case management schedule_code is active.';

comment on column case_management.schedule_code.create_user_id is 'The id of the user that created the case management schedule_code.';

comment on column case_management.schedule_code.create_utc_timestamp is 'The timestamp when the case management schedule_code was created.  The timestamp is stored in UTC with no Offset.';

comment on column case_management.schedule_code.update_user_id is 'The id of the user that updated the case management schedule_code.';

comment on column case_management.schedule_code.update_utc_timestamp is 'The timestamp when the case management schedule_code was updated.  The timestamp is stored in UTC with no Offset.';

--
-- CREATE TABLE schedule_sector_xref
--
-- CREATE TABLE
--   case_management.schedule_sector_xref (
--     schedule_sector_xref_guid uuid NOT NULL DEFAULT uuid_generate_v4 (),
--     schedule_code varchar(10) NOT NULL,
--     sector_code varchar(10) NOT NULL,
--     active_ind bool NOT NULL,
--     create_user_id varchar(32) NOT NULL,
--     create_utc_timestamp timestamp NOT NULL,
--     update_user_id varchar(32) NOT NULL,
--     update_utc_timestamp timestamp NOT NULL,
--     CONSTRAINT "PK_schedule_sector_xref_guid" PRIMARY KEY (schedule_sector_xref_guid)
--   );
CREATE TABLE
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid uuid NULL DEFAULT uuid_generate_v4 (),
    schedule_code varchar(10) NOT NULL,
    sector_code varchar(10) NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_schedule_sector_xref_guid" PRIMARY KEY (schedule_sector_xref_guid)
  );

--
-- create table relationships
--
ALTER TABLE case_management.schedule_sector_xref ADD CONSTRAINT FK_schedule_sector_xref__schedule_code FOREIGN KEY (schedule_code) REFERENCES case_management.schedule_code (schedule_code);

ALTER TABLE case_management.schedule_sector_xref ADD CONSTRAINT FK_schedule_sector_xref__sector_code FOREIGN KEY (sector_code) REFERENCES case_management.sector_code (sector_code);

ALTER TABLE case_management.decision ADD CONSTRAINT FK_decision__schedule_sector_xref_guid FOREIGN KEY (schedule_sector_xref_guid) REFERENCES case_management.schedule_sector_xref (schedule_sector_xref_guid);

ALTER TABLE case_management.decision ADD CONSTRAINT FK_decision__case_file_guid FOREIGN KEY (case_file_guid) REFERENCES case_management.case_file (case_file_guid);

ALTER TABLE case_management.decision ADD CONSTRAINT FK_decision__discharge_code FOREIGN KEY (discharge_code) REFERENCES case_management.discharge_code (discharge_code);

ALTER TABLE case_management.decision ADD CONSTRAINT FK_decision__rationale_code FOREIGN KEY (rationale_code) REFERENCES case_management.rationale_code (rationale_code);