-- Create PARTY_TYPE_CODE table
CREATE TABLE shared.party_type_code (
    party_type_code VARCHAR(16) PRIMARY KEY,
    short_description VARCHAR(64) NOT NULL,
    long_description VARCHAR(256),
    display_order INT,
    active_ind BOOLEAN NOT NULL DEFAULT TRUE,
    create_user_id VARCHAR(32) NOT NULL,
    create_utc_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    update_user_id VARCHAR(32),
    update_utc_timestamp TIMESTAMP
);

CREATE TRIGGER ptytpcde_set_default_audit_values
BEFORE update on shared.party_type_code
FOR EACH ROW
EXECUTE FUNCTION shared.update_audit_columns();  

-- Create PARTY table
CREATE TABLE shared.party (
    party_guid UUID NOT NULL DEFAULT uuid_generate_v4 () PRIMARY KEY,
    party_type VARCHAR(16),
    create_user_id VARCHAR(32) NOT NULL,
    create_utc_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    update_user_id VARCHAR(32),
    update_utc_timestamp TIMESTAMP,
    CONSTRAINT fk_party__party_type FOREIGN KEY (party_type) REFERENCES shared.party_type_code(party_type_code)
);

-- Create PARTY history table
CREATE TABLE shared.party_h (
    h_party_guid uuid NOT NULL DEFAULT uuid_generate_v4 (),
    target_row_id uuid NOT NULL,
    operation_type char(1) NOT NULL,
    operation_user_id varchar(32) NOT NULL DEFAULT current_user,
    operation_executed_at timestamp NOT NULL DEFAULT now(),
    data_after_executed_operation jsonb,
    CONSTRAINT "PK_h_party" PRIMARY KEY (h_party_guid)
);

-- Create BUSINESS table
CREATE TABLE shared.business (
    business_guid UUID NOT NULL DEFAULT uuid_generate_v4 () PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    create_user_id VARCHAR(32) NOT NULL,
    create_utc_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    update_user_id VARCHAR(32),
    update_utc_timestamp TIMESTAMP,
    party_guid UUID,
    CONSTRAINT "UQ_business_party_guid" UNIQUE (party_guid),
    CONSTRAINT "FK_business_party" FOREIGN KEY (party_guid) REFERENCES shared.party (party_guid)
);

-- Create BUSINESS history table
CREATE TABLE shared.business_h (
    h_business_guid uuid NOT NULL DEFAULT uuid_generate_v4 (),
    target_row_id uuid NOT NULL,
    operation_type char(1) NOT NULL,
    operation_user_id varchar(32) NOT NULL DEFAULT current_user,
    operation_executed_at timestamp NOT NULL DEFAULT now(),
    data_after_executed_operation jsonb,
    CONSTRAINT "PK_h_business" PRIMARY KEY (h_business_guid)
);

-- Trigger for BUSINESS history 
CREATE or REPLACE TRIGGER business_history_trigger
BEFORE INSERT OR DELETE OR UPDATE ON shared.business
FOR EACH ROW EXECUTE PROCEDURE shared.audit_history('business_h', 'business_guid');

ALTER TABLE shared.person ADD COLUMN party_guid UUID;
ALTER TABLE shared.person ADD CONSTRAINT "UQ_person_party_guid" UNIQUE (party_guid);
ALTER TABLE shared.person ADD CONSTRAINT "FK_person_party" FOREIGN KEY (party_guid) REFERENCES shared.party(party_guid);

-- Trigger for PARTY history 
CREATE or REPLACE TRIGGER party_history_trigger
BEFORE INSERT OR DELETE OR UPDATE ON shared.party
FOR EACH ROW EXECUTE PROCEDURE shared.audit_history('party_h', 'party_guid');

-- Column comments for BUSINESS
COMMENT ON COLUMN shared.business.business_guid IS 'Primary key: System generated unique identifier for a business.';
COMMENT ON COLUMN shared.business.name IS 'Name of the business.';
COMMENT ON COLUMN shared.business.create_user_id IS 'The id of the user that created the business.';
COMMENT ON COLUMN shared.business.create_utc_timestamp IS 'The timestamp when the business was created. The timestamp is stored in UTC with no offset.';
COMMENT ON COLUMN shared.business.update_user_id IS 'The id of the user that updated the business.';
COMMENT ON COLUMN shared.business.update_utc_timestamp IS 'The timestamp when the business was updated. The timestamp is stored in UTC with no offset.';

-- Column comments for BUSINESS_H
COMMENT on column shared.business_h.h_business_guid is 'Primary key: System generated unique identifier for a business history record.';
COMMENT on column shared.business_h.target_row_id is 'The unique key for the business that has been created or modified.';
COMMENT on column shared.business_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT on column shared.business_h.operation_user_id is 'The id of the user that created or modified the data in the business table.  Defaults to the logged in user if not passed in by the application.';
COMMENT on column shared.business_h.operation_executed_at is 'The timestamp when the data in the business table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT on column shared.business_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.'; 

-- Comments for PARTY_TYPE_CODE
COMMENT ON TABLE shared.party_type_code IS 'A table that holds party types.  Examples of party types include: CMP = "Company", PRS = "Person';
COMMENT ON COLUMN shared.party_type_code.party_type_code IS 'Primary key: Human readable code representing a party type.';
COMMENT ON COLUMN shared.party_type_code.short_description IS 'The short description of the party type.  Used to store shorter versions of the long description when applicable.';
COMMENT ON COLUMN shared.party_type_code.long_description IS 'The long description of the party type.  May contain additional detail not typically displayed in the application.';
COMMENT ON COLUMN shared.party_type_code.display_order IS 'The order in which the values of the party type should be displayed when presented to a user in a list.  Originally incremented by 10s to allow for new values to be easily added.';
COMMENT ON COLUMN shared.party_type_code.active_ind IS 'A boolean indicator to determine if the party type is active.  Inactive values are still retained in the system for legacy data integrity but are not valid choices for new data being added.';
COMMENT ON COLUMN shared.party_type_code.create_user_id IS 'The id of the user that created the party type.';
COMMENT ON COLUMN shared.party_type_code.create_utc_timestamp IS 'The timestamp when the party type was created. The timestamp is stored in UTC with no offset.';
COMMENT ON COLUMN shared.party_type_code.update_user_id IS 'The id of the user that updated the party type.';
COMMENT ON COLUMN shared.party_type_code.update_utc_timestamp IS 'The timestamp when the party type was updated. The timestamp is stored in UTC with no offset.';

-- Comments for PARTY
COMMENT ON TABLE shared.party IS 'A table that holds parties of interest';
COMMENT ON COLUMN shared.party.party_guid IS 'Primary key: System generated unique identifier for a party.';
COMMENT ON COLUMN shared.party.party_type IS 'Human readable code representing a party type.';
COMMENT ON COLUMN shared.party.create_user_id IS 'The id of the user that created the party.';
COMMENT ON COLUMN shared.party.create_utc_timestamp IS 'The timestamp when the party was created. The timestamp is stored in UTC with no offset.';
COMMENT ON COLUMN shared.party.update_user_id IS 'The id of the user that updated the party.';
COMMENT ON COLUMN shared.party.update_utc_timestamp IS 'The timestamp when the party was updated. The timestamp is stored in UTC with no offset.';

-- Column comments for PARTY_H
COMMENT on column shared.party_h.h_party_guid is 'Primary key: System generated unique identifier for a party history record.';
COMMENT on column shared.party_h.target_row_id is 'The unique key for the party that has been created or modified.';
COMMENT on column shared.party_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT on column shared.party_h.operation_user_id is 'The id of the user that created or modified the data in the party table.  Defaults to the logged in user if not passed in by the application.';
COMMENT on column shared.party_h.operation_executed_at is 'The timestamp when the data in the party table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT on column shared.party_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.';
