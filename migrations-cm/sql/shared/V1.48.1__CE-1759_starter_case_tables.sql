-- Create CASE_STATUS_CODE table
CREATE TABLE shared.case_status_code (
    case_status_code VARCHAR(10) PRIMARY KEY,
    short_description VARCHAR(64) NOT NULL,
    long_description VARCHAR(256),
    display_order INT,
    active_ind BOOLEAN NOT NULL DEFAULT TRUE,
    create_user_id VARCHAR(32) NOT NULL,
    create_utc_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    update_user_id VARCHAR(32),
    update_utc_timestamp TIMESTAMP
);

-- Comments for CASE_STATUS_CODE
COMMENT ON TABLE shared.case_status_code IS 'Represents the status of case (e.g. OPEN=Open; CLOSED=Closed).';
COMMENT ON COLUMN shared.case_status_code.case_status_code IS 'Primary key: Human readable code representing a case status.';
COMMENT ON COLUMN shared.case_status_code.short_description IS 'The short description of the case status code.  Used to store shorter versions of the long description when applicable.';
COMMENT ON COLUMN shared.case_status_code.long_description IS 'The long description of the case status code.  May contain additional detail not typically displayed in the application.';
COMMENT ON COLUMN shared.case_status_code.display_order IS 'The order in which the values of the case status code should be displayed when presented to a user in a list.  Originally incremented by 10s to allow for new values to be easily added.';
COMMENT ON COLUMN shared.case_status_code.active_ind IS 'A boolean indicator to determine if the case status code is active.  Inactive values are still retained in the system for legacy data integrity but are not valid choices for new data being added.';
COMMENT ON COLUMN shared.case_status_code.create_user_id IS 'The id of the user that created the case status code.';
COMMENT ON COLUMN shared.case_status_code.create_utc_timestamp IS 'The timestamp when the case status code was created. The timestamp is stored in UTC with no offset.';
COMMENT ON COLUMN shared.case_status_code.update_user_id IS 'The id of the user that updated the case status code.';
COMMENT ON COLUMN shared.case_status_code.update_utc_timestamp IS 'The timestamp when the case status code was updated. The timestamp is stored in UTC with no offset.';

-- Create AGENCY_CODE table
CREATE TABLE shared.agency_code (
    agency_code VARCHAR(10) PRIMARY KEY,
    short_description VARCHAR(64) NOT NULL,
    long_description VARCHAR(256),
    display_order INT,
    active_ind BOOLEAN NOT NULL DEFAULT TRUE,
    external_agency_ind BOOLEAN NOT NULL DEFAULT FALSE,
    create_user_id VARCHAR(32) NOT NULL,
    create_utc_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    update_user_id VARCHAR(32),
    update_utc_timestamp TIMESTAMP
);

-- Comments for AGENCY_CODE
COMMENT ON TABLE shared.agency_code IS 'An agency is an organized and named grouping of people that interacts in some way with the NatSuite application.';
COMMENT ON COLUMN shared.agency_code.agency_code IS 'Primary key: Human readable code representing an agency.';
COMMENT ON COLUMN shared.agency_code.short_description IS 'The short description of the agency.  Used to store shorter versions of the long description when applicable.';
COMMENT ON COLUMN shared.agency_code.long_description IS 'The long description of the agency.  May contain additional detail not typically displayed in the application.';
COMMENT ON COLUMN shared.agency_code.display_order IS 'The order in which the values of the agency should be displayed when presented to a user in a list.  Originally incremented by 10s to allow for new values to be easily added.';
COMMENT ON COLUMN shared.agency_code.active_ind IS 'A boolean indicator to determine if the agency is active.  Inactive values are still retained in the system for legacy data integrity but are not valid choices for new data being added.';
COMMENT ON COLUMN shared.agency_code.external_agency_ind IS 'A boolean indicator to determine if the agency is a direct NatSuite user or a partner agency.  A partner agency is an agency that might have a case activity referred to it, but would not complete the activity within the NatSuite.';
COMMENT ON COLUMN shared.agency_code.create_user_id IS 'The id of the user that created the agency.';
COMMENT ON COLUMN shared.agency_code.create_utc_timestamp IS 'The timestamp when the agency was created. The timestamp is stored in UTC with no offset.';
COMMENT ON COLUMN shared.agency_code.update_user_id IS 'The id of the user that updated the agency.';
COMMENT ON COLUMN shared.agency_code.update_utc_timestamp IS 'The timestamp when the agency was updated. The timestamp is stored in UTC with no offset.';

-- Create CASE_ACTIVITY_TYPE_CODE table
CREATE TABLE shared.case_activity_type_code (
    case_activity_type_code VARCHAR(10) PRIMARY KEY,
    short_description VARCHAR(64) NOT NULL,
    long_description VARCHAR(256),
    display_order INT,
    active_ind BOOLEAN NOT NULL DEFAULT TRUE,
    create_user_id VARCHAR(32) NOT NULL,
    create_utc_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    update_user_id VARCHAR(32),
    update_utc_timestamp TIMESTAMP
);

-- Comments for CASE_ACTIVITY_TYPE_CODE
COMMENT ON TABLE shared.case_activity_type_code IS 'A case file is made up of many case activities.  Examples of case activities include: COMP = "Complaint", INV = "Investigation';
COMMENT ON COLUMN shared.case_activity_type_code.case_activity_type_code IS 'Primary key: Human readable code representing a case activity.';
COMMENT ON COLUMN shared.case_activity_type_code.short_description IS 'The short description of the case activity.  Used to store shorter versions of the long description when applicable.';
COMMENT ON COLUMN shared.case_activity_type_code.long_description IS 'The long description of the case activity.  May contain additional detail not typically displayed in the application.';
COMMENT ON COLUMN shared.case_activity_type_code.display_order IS 'The order in which the values of the case activity should be displayed when presented to a user in a list.  Originally incremented by 10s to allow for new values to be easily added.';
COMMENT ON COLUMN shared.case_activity_type_code.active_ind IS 'A boolean indicator to determine if the case activity is active.  Inactive values are still retained in the system for legacy data integrity but are not valid choices for new data being added.';
COMMENT ON COLUMN shared.case_activity_type_code.create_user_id IS 'The id of the user that created the case activity.';
COMMENT ON COLUMN shared.case_activity_type_code.create_utc_timestamp IS 'The timestamp when the case activity was created. The timestamp is stored in UTC with no offset.';
COMMENT ON COLUMN shared.case_activity_type_code.update_user_id IS 'The id of the user that updated the case activity.';
COMMENT ON COLUMN shared.case_activity_type_code.update_utc_timestamp IS 'The timestamp when the case activity was updated. The timestamp is stored in UTC with no offset.';

-- Create CASE_FILE table
CREATE TABLE shared.case_file (
    case_file_guid UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    owned_by_agency VARCHAR(10) NOT NULL,
    case_status VARCHAR(10) NOT NULL,
    case_opened_utc_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    create_user_id VARCHAR(32) NOT NULL,
    create_utc_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    update_user_id VARCHAR(32),
    update_utc_timestamp TIMESTAMP,
    CONSTRAINT fk_case_file__agency_code FOREIGN KEY (owned_by_agency) REFERENCES shared.agency_code(agency_code),
    CONSTRAINT fk_case_file__case_status_code FOREIGN KEY (case_status) REFERENCES shared.case_status_code(case_status_code)
);

-- Comments for CASE_FILE
COMMENT ON TABLE shared.case_file IS 'A case file is the top level entity of the case management system and encapsulates all activities and records within it';
COMMENT ON COLUMN shared.case_file.case_file_guid IS 'Primary Key: System generated unique key for a case.  This key should never be exposed to users via any system utilizing the tables.';
COMMENT ON COLUMN shared.case_file.owned_by_agency IS 'Foreign key: Human readable code representing an agency.';
COMMENT ON COLUMN shared.case_file.case_status IS 'Foreign key: Human readable code representing a case status.';
COMMENT ON COLUMN shared.case_file.case_opened_utc_timestamp IS 'The time the case file was created.  The timestamp is stored in UTC with no offset.';
COMMENT ON COLUMN shared.case_file.create_user_id IS 'The id of the user that created the case file.';
COMMENT ON COLUMN shared.case_file.create_utc_timestamp IS 'The timestamp when the case file was created. The timestamp is stored in UTC with no offset.';
COMMENT ON COLUMN shared.case_file.update_user_id IS 'The id of the user that updated the case file.';
COMMENT ON COLUMN shared.case_file.update_utc_timestamp IS 'The timestamp when the case file was updated. The timestamp is stored in UTC with no offset.';

-- CASE_FILE HISTORY
CREATE TABLE
  shared.case_file_h (
    h_case_file_guid uuid NOT NULL DEFAULT uuid_generate_v4 () PRIMARY KEY,
    target_row_id uuid NOT NULL,
    operation_type char(1) NOT NULL,
    operation_user_id varchar(32) NOT NULL DEFAULT current_user,
    operation_executed_at timestamp NOT NULL DEFAULT now (),
    data_after_executed_operation jsonb
  );

CREATE
or REPLACE TRIGGER case_file_h_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON shared.case_file FOR EACH ROW EXECUTE PROCEDURE shared.audit_history ('case_file_h', 'case_file_guid');

COMMENT on table shared.case_file_h is 'History table for case file table';
COMMENT on column shared.case_file_h.h_case_file_guid is 'System generated unique key for case file history. This key should never be exposed to users via any system utilizing the tables.';
COMMENT on column shared.case_file_h.target_row_id is 'The unique key for the case file that has been created or modified.';
COMMENT on column shared.case_file_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT on column shared.case_file_h.operation_user_id is 'The id of the user that created or modified the data in the case file table.  Defaults to the logged in user if not passed in by the application.';
COMMENT on column shared.case_file_h.operation_executed_at is 'The timestamp when the data in the case file table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT on column shared.case_file_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


-- Create CASE_ACTIVITY table
CREATE TABLE shared.case_activity (
    case_activity_guid UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    case_file_guid UUID NOT NULL,
    case_activity_type VARCHAR(10) NOT NULL,
    case_activity_identifier_ref VARCHAR(20) NOT NULL,
    effective_utc_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    expiry_utc_timestamp TIMESTAMP,
    create_user_id VARCHAR(32) NOT NULL,
    create_utc_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    update_user_id VARCHAR(32),
    update_utc_timestamp TIMESTAMP,
    CONSTRAINT fk_case_activity__case_file FOREIGN KEY (case_file_guid) REFERENCES shared.case_file(case_file_guid),
    CONSTRAINT fk_case_activity__case_activity_type_code FOREIGN KEY (case_activity_type) REFERENCES shared.case_activity_type_code(case_activity_type_code)
);

-- Comments for CASE_ACTIVITY
COMMENT ON TABLE shared.case_activity IS 'A case activity is a distinct business process within the compliance and enforcement domain such as a complaint, inspection or an investigation.';
COMMENT ON COLUMN shared.case_activity.case_activity_guid IS 'Primary Key: System generated unique key for a case activity.  This key should never be exposed to users via any system utilizing the tables.';
COMMENT ON COLUMN shared.case_activity.case_file_guid IS 'Foreign Key: System generated unique key for a case.  This key should never be exposed to users via any system utilizing the tables.';
COMMENT ON COLUMN shared.case_activity.case_activity_type IS 'Foreign Key: Human readable code representing a case activity.';
COMMENT ON COLUMN shared.case_activity.case_activity_identifier_ref IS 'Business key representing a case activity stored in a another system or schema.   A case activity identifier can be a complaint: complaint.complaint.complaint_identifier, an inspection, or an investigation (physical implementation TBD)';
COMMENT ON COLUMN shared.case_activity.effective_utc_timestamp IS 'The date and time the case activity was added to the case file. The timestamp is stored in UTC with no offset.';
COMMENT ON COLUMN shared.case_activity.expiry_utc_timestamp IS 'The date and time the case activity was removed from the case file. The timestamp is stored in UTC with no offset.';
COMMENT ON COLUMN shared.case_activity.create_user_id IS 'The id of the user that created the case activity record.';
COMMENT ON COLUMN shared.case_activity.create_utc_timestamp IS 'The timestamp when the case activity record was created. The timestamp is stored in UTC with no offset.';
COMMENT ON COLUMN shared.case_activity.update_user_id IS 'The id of the user that updated the case activity record.';
COMMENT ON COLUMN shared.case_activity.update_utc_timestamp IS 'The timestamp when the case activity record was updated. The timestamp is stored in UTC with no offset.';

-- CASE_ACTIVITY HISTORY
CREATE TABLE
  shared.case_activity_h (
    h_case_activity_guid uuid NOT NULL DEFAULT uuid_generate_v4 () PRIMARY KEY,
    target_row_id uuid NOT NULL,
    operation_type char(1) NOT NULL,
    operation_user_id varchar(32) NOT NULL DEFAULT current_user,
    operation_executed_at timestamp NOT NULL DEFAULT now (),
    data_after_executed_operation jsonb
  );

CREATE
or REPLACE TRIGGER case_activity_h_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON shared.case_activity FOR EACH ROW EXECUTE PROCEDURE shared.audit_history ('case_activity_h', 'case_activity_guid');

COMMENT on table shared.case_activity_h is 'History table for case activity table';
COMMENT on column shared.case_activity_h.h_case_activity_guid is 'System generated unique key for case activity history. This key should never be exposed to users via any system utilizing the tables.';
COMMENT on column shared.case_activity_h.target_row_id is 'The unique key for the case activity that has been created or modified.';
COMMENT on column shared.case_activity_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT on column shared.case_activity_h.operation_user_id is 'The id of the user that created or modified the data in the case activity table.  Defaults to the logged in user if not passed in by the application.';
COMMENT on column shared.case_activity_h.operation_executed_at is 'The timestamp when the data in the case activity table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT on column shared.case_activity_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

----------------------------------------------------------
-- Ensure code table data is present before the script runs
----------------------------------------------------------
INSERT INTO shared.agency_code (
    agency_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, external_agency_ind
) VALUES
    ('PARKS', 'BC Parks', 'BC Parks', 10, TRUE, 'FLYWAY', NOW(), false),
    ('COS', 'COS', 'Conservation Officer Service', 20, TRUE, 'FLYWAY', NOW(), false),
    ('EPO', 'CEEB', 'Compliance and Environmental Enforcement Branch', 30, TRUE, 'FLYWAY', NOW(), false),
    ('ECCC', 'Environment and Climate Change Canada', 'Environment and Climate Change Canada', 40, TRUE, 'FLYWAY', NOW(), true),
    ('DFO', 'Fisheries and Oceans Canada', 'Fisheries and Oceans Canada', 50, TRUE, 'FLYWAY', NOW(), true),
    ('NROS', 'Natural Resource Officer Service', 'Natural Resource Officer Service', 60, TRUE, 'FLYWAY', NOW(), true),
    ('NRS', 'Natural Resource Sector', 'Natural Resource Sector', 70, TRUE, 'FLYWAY', NOW(), false),
    ('OTH', 'Other', 'Other', 80, TRUE, 'FLYWAY', NOW(), true),
    ('POL', 'Police', 'Police', 90, TRUE, 'FLYWAY', NOW(), true)
ON CONFLICT (agency_code) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    display_order = EXCLUDED.display_order,
    active_ind = EXCLUDED.active_ind,
    external_agency_ind = EXCLUDED.external_agency_ind,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = NOW();
    
INSERT INTO shared.case_status_code (
    case_status_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp
) VALUES
    ('OPEN', 'Open', 'Open', 10, TRUE, 'FLYWAY', NOW()),
    ('CLOSED', 'Closed', 'Closed', 20, TRUE, 'FLYWAY', NOW())
ON CONFLICT (case_status_code) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    display_order = EXCLUDED.display_order,
    active_ind = EXCLUDED.active_ind,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = NOW();

INSERT INTO shared.case_activity_type_code (
    case_activity_type_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp
) VALUES
    ('COMP', 'Complaint', 'Complaint', 10, TRUE, 'FLYWAY', NOW())
ON CONFLICT (case_activity_type_code) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    display_order = EXCLUDED.display_order,
    active_ind = EXCLUDED.active_ind,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = NOW();
    
-- Clean up old objects
DROP TABLE IF EXISTS shared.temp_poc;
DROP SEQUENCE IF EXISTS shared.TEMP_POC_SEQ;

ALTER TABLE shared.contact_method RENAME COLUMN contact_method_type_code TO contact_method_type;

