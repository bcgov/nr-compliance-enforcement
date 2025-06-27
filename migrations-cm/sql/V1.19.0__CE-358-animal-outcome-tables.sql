--
-- CREATE TABLE wildlife
--
CREATE TABLE
  case_management.wildlife (
    wildlife_guid uuid NOT NULL DEFAULT uuid_generate_v4 (),
    case_file_guid uuid NOT NULL,
    threat_level_code varchar(10),
    conflict_history_code varchar(10),
    sex_code varchar(10),
    age_code varchar(10),
    hwcr_outcome_code varchar(10),
    species_code varchar(10) NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_wildlife_guid" PRIMARY KEY (wildlife_guid)
  );

-- foreign keys
ALTER TABLE case_management.wildlife ADD CONSTRAINT FK_wildlife__case_file_guid FOREIGN KEY (case_file_guid) REFERENCES case_management.case_file (case_file_guid);

ALTER TABLE case_management.wildlife ADD CONSTRAINT FK_wildlife__threat_level_code FOREIGN KEY (threat_level_code) REFERENCES case_management.threat_level_code (threat_level_code);

ALTER TABLE case_management.wildlife ADD CONSTRAINT FK_wildlife__conflict_history_code FOREIGN KEY (conflict_history_code) REFERENCES case_management.conflict_history_code (conflict_history_code);

ALTER TABLE case_management.wildlife ADD CONSTRAINT FK_wildlife__sex_code FOREIGN KEY (sex_code) REFERENCES case_management.sex_code (sex_code);

ALTER TABLE case_management.wildlife ADD CONSTRAINT FK_wildlife__age_code FOREIGN KEY (age_code) REFERENCES case_management.age_code (age_code);

ALTER TABLE case_management.wildlife ADD CONSTRAINT FK_wildlife__hwcr_outcome_code FOREIGN KEY (hwcr_outcome_code) REFERENCES case_management.hwcr_outcome_code (hwcr_outcome_code);

-- create new action reference
ALTER TABLE action
ADD COLUMN wildlife_guid uuid;

ALTER TABLE case_management.action ADD CONSTRAINT FK_action__wildlife_guid FOREIGN KEY (wildlife_guid) REFERENCES case_management.wildlife (wildlife_guid);

-- table comments
comment on table case_management.wildlife is 'WILDLIFE can be a participant on a CASE_FILE, specifically for CASE_FILE with a CASE_CODE of "HWCR" (Human / Wildlife Conflict)';

comment on column case_management.wildlife.wildlife_guid is 'System generated unique key for an animal.  This key should never be exposed to users via any system utilizing the tables.';

comment on column case_management.wildlife.case_file_guid is 'System generated unique key for a case.  This key should never be exposed to users via any system utilizing the tables.';

comment on column case_management.wildlife.threat_level_code is 'A human readable code used to identify a threat level type.';

comment on column case_management.wildlife.conflict_history_code is 'A human readable code used to identify a conflict history type.';

comment on column case_management.wildlife.sex_code is 'A human readable code used to identify a sex type.';

comment on column case_management.wildlife.age_code is 'A human readable code used to identify an age type.';

comment on column case_management.wildlife.hwcr_outcome_code is 'A human readable code used to identify an HWCR outcome type.';

comment on column case_management.wildlife.species_code is 'A human readable code used to identify a species.   The COS Complaint Management is the authorative source for the screen labels and descriptions of the codes.';

comment on column case_management.wildlife.create_user_id is 'The id of the user that created the wildlife record.';

comment on column case_management.wildlife.create_utc_timestamp is 'The timestamp when the wildlife record was created.  The timestamp is stored in UTC with no Offset.';

comment on column case_management.wildlife.update_user_id is 'The id of the user that updated the wildlife record.';

comment on column case_management.wildlife.update_utc_timestamp is 'The timestamp when the wildlife record was updated.  The timestamp is stored in UTC with no Offset.';

--
-- CREATE TABLE ear_tag
--
CREATE TABLE
  case_management.ear_tag (
    ear_tag_guid uuid NOT NULL DEFAULT uuid_generate_v4 (),
    wildlife_guid uuid NOT NULL,
    ear_code varchar(10) NOT NULL,
    ear_tag_identifier varchar(10) NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_ear_tag_guid" PRIMARY KEY (ear_tag_guid)
  );

-- foreign keys
ALTER TABLE case_management.ear_tag ADD CONSTRAINT FK_ear_tag__wildlife_guid FOREIGN KEY (wildlife_guid) REFERENCES case_management.wildlife (wildlife_guid);

ALTER TABLE case_management.ear_tag ADD CONSTRAINT FK_ear_tag__ear_code FOREIGN KEY (ear_code) REFERENCES case_management.ear_code (ear_code);

-- table comments
comment on table case_management.ear_tag is 'an EAR_TAG is used to identify a specific WILDLIFE allowing the animal to be tracked over time.';

comment on column case_management.ear_tag.ear_tag_guid is 'System generated unique key for an ear tag.  This key should never be exposed to users via any system utilizing the tables.';

comment on column case_management.ear_tag.wildlife_guid is 'System generated unique key for an animal.  This key should never be exposed to users via any system utilizing the tables.';

comment on column case_management.ear_tag.ear_code is 'A human readable code used to identify an ear type.';

comment on column case_management.ear_tag.ear_tag_identifier is 'An identifier used to label an animal, not used as a natural key as they are not guaranteed to be unique';

comment on column case_management.ear_tag.create_user_id is 'The id of the user that created the ear_tag record.';

comment on column case_management.ear_tag.create_utc_timestamp is 'The timestamp when the ear_tag record was created.  The timestamp is stored in UTC with no Offset.';

comment on column case_management.ear_tag.update_user_id is 'The id of the user that updated the ear_tag record.';

comment on column case_management.ear_tag.update_utc_timestamp is 'The timestamp when the ear_tag record was updated.  The timestamp is stored in UTC with no Offset.';

--
-- CREATE TABLE drug_administered
--
CREATE TABLE
  case_management.drug_administered (
    drug_administered_guid uuid NOT NULL DEFAULT uuid_generate_v4 (),
    wildlife_guid uuid NOT NULL,
    drug_code varchar(10) NOT NULL,
    drug_method_code varchar(10) NOT NULL,
    drug_remaining_outcome_code varchar(10) NOT NULL,
    vial_number varchar(50) NOT NULL,
    drug_used_amount varchar(50) NOT NULL,
    drug_discarded_amount varchar(50),
    discard_method_text varchar(250),
    adverse_reaction_text varchar(250),
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_drug_administered_guid" PRIMARY KEY (drug_administered_guid)
  );

-- foreign keys
ALTER TABLE case_management.drug_administered ADD CONSTRAINT FK_drug_administered__wildlife_guid FOREIGN KEY (wildlife_guid) REFERENCES case_management.wildlife (wildlife_guid);

ALTER TABLE case_management.drug_administered ADD CONSTRAINT FK_drug_administered__drug_code FOREIGN KEY (drug_code) REFERENCES case_management.drug_code (drug_code);

ALTER TABLE case_management.drug_administered ADD CONSTRAINT FK_drug_administered__drug_method_code FOREIGN KEY (drug_method_code) REFERENCES case_management.drug_method_code (drug_method_code);

ALTER TABLE case_management.drug_administered ADD CONSTRAINT FK_drug_administered__drug_remaining_outcome_code FOREIGN KEY (drug_remaining_outcome_code) REFERENCES case_management.drug_remaining_outcome_code (drug_remaining_outcome_code);

-- table comments
comment on table case_management.drug_administered is 'While an officer is responding to a LEAD they may need to record that a WILDLIFE had a DRUG_ADMINISTERED.  This table keeps track of the type and amount of drugs administered, along with what happened to any remaining drug that was not used.';

comment on column case_management.drug_administered.drug_administered_guid is 'System generated unique key for an drug that was administered to an animal.  This key should never be exposed to users via any system utilizing the tables.';

comment on column case_management.drug_administered.wildlife_guid is 'System generated unique key for an animal.  This key should never be exposed to users via any system utilizing the tables.';

comment on column case_management.drug_administered.drug_code is 'A human readable code used to identify a drug type.';

comment on column case_management.drug_administered.drug_method_code is 'A human readable code used to identify a drug injection method type.';

comment on column case_management.drug_administered.drug_remaining_outcome_code is 'A human readable code used to identify a remaining drug outcome type.';

comment on column case_management.drug_administered.vial_number is 'A vial number that relates to a seperate drug inventory system.';

comment on column case_management.drug_administered.drug_used_amount is 'The amount of drug used';

comment on column case_management.drug_administered.drug_discarded_amount is 'The amount of drug that was discarded';

comment on column case_management.drug_administered.discard_method_text is 'Brief narrative explaining how the drug was discared';

comment on column case_management.drug_administered.adverse_reaction_text is 'Brief narrative documenting any adverse reactions observed';

comment on column case_management.drug_administered.create_user_id is 'The id of the user that created the drug_administered record.';

comment on column case_management.drug_administered.create_utc_timestamp is 'The timestamp when the drug_administered record was created.  The timestamp is stored in UTC with no Offset.';

comment on column case_management.drug_administered.update_user_id is 'The id of the user that updated the drug_administered record.';

comment on column case_management.drug_administered.update_utc_timestamp is 'The timestamp when the drug_administered record was updated.  The timestamp is stored in UTC with no Offset.';

--
-- CREATE TABLE wildlife_h
--
CREATE TABLE
  case_management.wildlife_h (
    h_wildlife_guid uuid NOT NULL DEFAULT uuid_generate_v4 (),
    target_row_id uuid NOT NULL,
    operation_type char(1) NOT NULL,
    operation_user_id varchar(32) NOT NULL DEFAULT current_user,
    operation_executed_at timestamp NOT NULL DEFAULT now (),
    data_after_executed_operation jsonb,
    CONSTRAINT "PK_h_wildlife" PRIMARY KEY (h_wildlife_guid)
  );

CREATE
or REPLACE TRIGGER wildlife_history_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON case_management.wildlife FOR EACH ROW EXECUTE PROCEDURE audit_history ('wildlife_h', 'wildlife_guid');

COMMENT on table case_management.wildlife_h is 'History table for case_file table';

COMMENT on column case_management.wildlife_h.h_wildlife_guid is 'System generated unique key for case history. This key should never be exposed to users via any system utilizing the tables.';

COMMENT on column case_management.wildlife_h.target_row_id is 'The unique key for the case that has been created or modified.';

COMMENT on column case_management.wildlife_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT on column case_management.wildlife_h.operation_user_id is 'The id of the user that created or modified the data in the case table.  Defaults to the logged in user if not passed in by the application.';

COMMENT on column case_management.wildlife_h.operation_executed_at is 'The timestamp when the data in the case table was created or modified.  The timestamp is stored in UTC with no Offset.';

COMMENT on column case_management.wildlife_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

--
-- CREATE TABLE ear_tag_h
--
CREATE TABLE
  case_management.ear_tag_h (
    h_ear_tag_guid uuid NOT NULL DEFAULT uuid_generate_v4 (),
    target_row_id uuid NOT NULL,
    operation_type char(1) NOT NULL,
    operation_user_id varchar(32) NOT NULL DEFAULT current_user,
    operation_executed_at timestamp NOT NULL DEFAULT now (),
    data_after_executed_operation jsonb,
    CONSTRAINT "PK_h_ear_tag" PRIMARY KEY (h_ear_tag_guid)
  );

CREATE
or REPLACE TRIGGER ear_tag_history_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON case_management.ear_tag FOR EACH ROW EXECUTE PROCEDURE audit_history ('ear_tag_h', 'ear_tag_guid');

COMMENT on table case_management.ear_tag_h is 'History table for case_file table';

COMMENT on column case_management.ear_tag_h.h_ear_tag_guid is 'System generated unique key for case history. This key should never be exposed to users via any system utilizing the tables.';

COMMENT on column case_management.ear_tag_h.target_row_id is 'The unique key for the case that has been created or modified.';

COMMENT on column case_management.ear_tag_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT on column case_management.ear_tag_h.operation_user_id is 'The id of the user that created or modified the data in the case table.  Defaults to the logged in user if not passed in by the application.';

COMMENT on column case_management.ear_tag_h.operation_executed_at is 'The timestamp when the data in the case table was created or modified.  The timestamp is stored in UTC with no Offset.';

COMMENT on column case_management.ear_tag_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

--
-- CREATE TABLE drug_administered_h
--
CREATE TABLE
  case_management.drug_administered_h (
    h_drug_administered_guid uuid NOT NULL DEFAULT uuid_generate_v4 (),
    target_row_id uuid NOT NULL,
    operation_type char(1) NOT NULL,
    operation_user_id varchar(32) NOT NULL DEFAULT current_user,
    operation_executed_at timestamp NOT NULL DEFAULT now (),
    data_after_executed_operation jsonb,
    CONSTRAINT "PK_h_drug_administered" PRIMARY KEY (h_drug_administered_guid)
  );

CREATE
or REPLACE TRIGGER drug_administered_history_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON case_management.drug_administered FOR EACH ROW EXECUTE PROCEDURE audit_history ('drug_administered_h', 'drug_administered_guid');

COMMENT on table case_management.drug_administered_h is 'History table for case_file table';

COMMENT on column case_management.drug_administered_h.h_drug_administered_guid is 'System generated unique key for case history. This key should never be exposed to users via any system utilizing the tables.';

COMMENT on column case_management.drug_administered_h.target_row_id is 'The unique key for the case that has been created or modified.';

COMMENT on column case_management.drug_administered_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT on column case_management.drug_administered_h.operation_user_id is 'The id of the user that created or modified the data in the case table.  Defaults to the logged in user if not passed in by the application.';

COMMENT on column case_management.drug_administered_h.operation_executed_at is 'The timestamp when the data in the case table was created or modified.  The timestamp is stored in UTC with no Offset.';

COMMENT on column case_management.drug_administered_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';