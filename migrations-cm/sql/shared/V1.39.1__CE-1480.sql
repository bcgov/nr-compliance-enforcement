-- Rename investigation schema to shared
ALTER SCHEMA investigation RENAME TO shared;

-- Create account for accessing shared schema
DO $$
BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_user WHERE usename = 'proxy_js_shared') THEN
    CREATE USER proxy_js_shared WITH PASSWORD '${SHARED_PASSWORD}';
END IF;
END $$;
 
-- Grant access to schema to new account
GRANT USAGE, CREATE ON SCHEMA shared TO proxy_js_shared;

-- Create PERSON table
CREATE TABLE shared.person (
    person_guid UUID NOT NULL DEFAULT uuid_generate_v4 () PRIMARY KEY,
    first_name VARCHAR(128) NOT NULL,
    middle_name VARCHAR(128),
    middle_name_2 VARCHAR(128),
    last_name VARCHAR(128) NOT NULL,
    create_user_id VARCHAR(32) NOT NULL,
    create_utc_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    update_user_id VARCHAR(32),
    update_utc_timestamp TIMESTAMP
);

-- Create CONTACT_METHOD_TYPE_CODE table
CREATE TABLE shared.contact_method_type_code (
    contact_method_type_code VARCHAR(16) PRIMARY KEY,
    short_description VARCHAR(64) NOT NULL,
    long_description VARCHAR(256),
    display_order INT,
    active_ind BOOLEAN NOT NULL DEFAULT TRUE,
    create_user_id VARCHAR(32) NOT NULL,
    create_utc_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    update_user_id VARCHAR(32),
    update_utc_timestamp TIMESTAMP
);

-- Create CONTACT_METHOD table
CREATE TABLE shared.contact_method (
    contact_method_guid UUID NOT NULL DEFAULT uuid_generate_v4 () PRIMARY KEY,
    person_guid UUID NOT NULL,
    contact_method_type_code VARCHAR(10) NOT NULL,
    contact_value VARCHAR(512),
    create_user_id VARCHAR(32) NOT NULL,
    create_utc_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    update_user_id VARCHAR(32),
    update_utc_timestamp TIMESTAMP,
    CONSTRAINT fk_contact_method_person FOREIGN KEY (person_guid) REFERENCES shared.person(person_guid) ON DELETE CASCADE,
    CONSTRAINT fk_contact_method_type FOREIGN KEY (contact_method_type_code) REFERENCES shared.contact_method_type_code(contact_method_type_code)
);

-- Create PERSON history table
CREATE TABLE shared.person_h (
    h_person_guid uuid NOT NULL DEFAULT uuid_generate_v4 (),
    target_row_id uuid NOT NULL,
    operation_type char(1) NOT NULL,
    operation_user_id varchar(32) NOT NULL DEFAULT current_user,
    operation_executed_at timestamp NOT NULL DEFAULT now(),
    data_after_executed_operation jsonb,
    CONSTRAINT "PK_h_person" PRIMARY KEY (h_person_guid)
);

-- Create CONTACT METHOD history table
CREATE TABLE shared.contact_method_h (
    h_contact_method_guid uuid NOT NULL DEFAULT uuid_generate_v4 (),
    target_row_id uuid NOT NULL,
    operation_type char(1) NOT NULL,
    operation_user_id varchar(32) NOT NULL DEFAULT current_user,
    operation_executed_at timestamp NOT NULL DEFAULT now(),
    data_after_executed_operation jsonb,
    CONSTRAINT "PK_h_contact_method" PRIMARY KEY (h_contact_method_guid)
);

CREATE OR REPLACE FUNCTION shared.audit_history() RETURNS trigger AS $BODY$
  DECLARE

	target_history_table TEXT;
	target_pk TEXT;

  BEGIN
    target_history_table := TG_ARGV[0];
    target_pk := TG_ARGV[1];

    IF TG_OP ='INSERT' THEN 
        
      -- Don't trust the caller not to manipulate any of these fields
      NEW.create_utc_timestamp := current_timestamp; -- create timestamp must be the current time
      NEW.update_utc_timestamp := current_timestamp; -- update timestamp must be the current time
      NEW.update_user_id := NEW.create_user_id;  -- the update user must be the same as the create user

      EXECUTE
        format( 
            'INSERT INTO shared.%I (target_row_id, operation_type, operation_user_id, data_after_executed_operation) VALUES ($1.%I,  ''I'', $1.create_user_id, to_jsonb($1))',  target_history_table, target_pk
        )
        USING NEW;
      RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN 

      -- Don't trust the caller not to manipulate any of these fields
      NEW.update_utc_timestamp := current_timestamp;  -- update timestamp must be the current time
      NEW.create_user_id := OLD.create_user_id; -- create userId can't be altered
      NEW.create_utc_timestamp := OLD.create_utc_timestamp; -- update timestamp can't be altered

      EXECUTE
        format(
            'INSERT INTO shared.%I (target_row_id, operation_type, operation_user_id, data_after_executed_operation) VALUES ($1.%I, ''U'', $1.update_user_id, to_jsonb($1))', target_history_table, target_pk
          )
        USING NEW;
      RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN

      EXECUTE
        format(
                'INSERT INTO shared.%I (target_row_id, operation_type) VALUES ($1.%I, ''D'')', target_history_table, target_pk
        )
        USING OLD;
      RETURN OLD;

    END IF;
  END;
$BODY$
LANGUAGE plpgsql;

-- Add triggers for history
CREATE or REPLACE TRIGGER person_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON shared.person
  FOR EACH ROW EXECUTE PROCEDURE shared.audit_history('person_h', 'person_guid');

CREATE or REPLACE TRIGGER contact_method_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON shared.contact_method
  FOR EACH ROW EXECUTE PROCEDURE shared.audit_history('contact_method_h', 'contact_method_guid');

-- Table comments
COMMENT ON TABLE shared.person IS 'Stores personal information for individuals, including names and in the future other attributes.';
COMMENT ON TABLE shared.contact_method IS 'Stores contact details for individuals, linking each contact method to a person and a type (e.g., email, phone).';
COMMENT ON TABLE shared.contact_method_type_code IS 'Defines types of contact methods (e.g., email, primary phone, alternate phone) with descriptions and display ordering.';
COMMENT ON TABLE shared.person_h is 'History table for person table';
COMMENT ON TABLE shared.contact_method_h is 'History table for contact method table';

-- Column comments for PERSON
COMMENT ON COLUMN shared.person.person_guid IS 'Primary key: System generated unique identifier for a person.';
COMMENT ON COLUMN shared.person.first_name IS 'First or given name of the person.';
COMMENT ON COLUMN shared.person.middle_name IS 'Second or middle name of the person.';
COMMENT ON COLUMN shared.person.middle_name_2 IS 'Additional Second or middle name of the person.';
COMMENT ON COLUMN shared.person.last_name IS 'Last name or surname of the person.';
COMMENT ON COLUMN shared.person.create_user_id IS 'The id of the user that created the person.';
COMMENT ON COLUMN shared.person.create_utc_timestamp IS 'The timestamp when the person was created. The timestamp is stored in UTC with no offset.';
COMMENT ON COLUMN shared.person.update_user_id IS 'The id of the user that updated the person.';
COMMENT ON COLUMN shared.person.update_utc_timestamp IS 'The timestamp when the person was updated. The timestamp is stored in UTC with no offset.';

-- Column comments for CONTACT_METHOD
COMMENT ON COLUMN shared.contact_method.contact_method_guid IS 'Primary key: System generated unique identifier for a contact method.';
COMMENT ON COLUMN shared.contact_method.person_guid IS 'Foreign key: References person.person_guid.';
COMMENT ON COLUMN shared.contact_method.contact_method_type_code IS 'Foreign key: References contact_method_type_code.contact_method_type_code.';
COMMENT ON COLUMN shared.contact_method.contact_value IS 'A contact method (e.g., phone number, email address) for a person.';
COMMENT ON COLUMN shared.contact_method.create_user_id IS 'The id of the user that created the contact method.';
COMMENT ON COLUMN shared.contact_method.create_utc_timestamp IS 'The timestamp when the contact method was created. The timestamp is stored in UTC with no offset.';
COMMENT ON COLUMN shared.contact_method.update_user_id IS 'The id of the user that updated the contact method.';
COMMENT ON COLUMN shared.contact_method.update_utc_timestamp IS 'The timestamp when the contact method was updated. The timestamp is stored in UTC with no offset.';

-- Column comments for CONTACT_METHOD_TYPE_CODE
COMMENT ON COLUMN shared.contact_method_type_code.contact_method_type_code IS 'Primary key: Human readable code representing a contact method type.';
COMMENT ON COLUMN shared.contact_method_type_code.short_description IS 'The short description of the contact method type code.  Used to store shorter versions of the long description when applicable.';
COMMENT ON COLUMN shared.contact_method_type_code.long_description IS 'The long description of the contact method type code.  May contain additional detail not typically displayed in the application.';
COMMENT ON COLUMN shared.contact_method_type_code.display_order IS 'The order in which the values of the contact method type code should be displayed when presented to a user in a list.  Originally incremented by 10s to allow for new values to be easily added.';
COMMENT ON COLUMN shared.contact_method_type_code.active_ind IS 'A boolean indicator to determine if the contact method type code is active.  Inactive values are still retained in the system for legacy data integrity but are not valid choices for new data being added.';
COMMENT ON COLUMN shared.contact_method_type_code.create_user_id IS 'The id of the user that created the contact method type code.';
COMMENT ON COLUMN shared.contact_method_type_code.create_utc_timestamp IS 'The timestamp when the contact method type code was created. The timestamp is stored in UTC with no offset.';
COMMENT ON COLUMN shared.contact_method_type_code.update_user_id IS 'The id of the user that updated the contact method type code.';
COMMENT ON COLUMN shared.contact_method_type_code.update_utc_timestamp IS 'The timestamp when the contact method type code was updated. The timestamp is stored in UTC with no offset.';

-- Column comments for PERSON_H
COMMENT on column shared.person_h.h_person_guid is 'Primary key: System generated unique identifier for a person history record.';
COMMENT on column shared.person_h.target_row_id is 'The unique key for the person that has been created or modified.';
COMMENT on column shared.person_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT on column shared.person_h.operation_user_id is 'The id of the user that created or modified the data in the person table.  Defaults to the logged in user if not passed in by the application.';
COMMENT on column shared.person_h.operation_executed_at is 'The timestamp when the data in the person table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT on column shared.person_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

-- Column comments for CONTACT_METHOD_H
COMMENT on column shared.contact_method_h.h_contact_method_guid is 'Primary key: System generated unique identifier for a contact method history record.';
COMMENT on column shared.contact_method_h.target_row_id is 'The unique key for the contact method that has been created or modified.';
COMMENT on column shared.contact_method_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT on column shared.contact_method_h.operation_user_id is 'The id of the user that created or modified the data in the contact method table.  Defaults to the logged in user if not passed in by the application.';
COMMENT on column shared.contact_method_h.operation_executed_at is 'The timestamp when the data in the contact method table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT on column shared.contact_method_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

