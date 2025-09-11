-- Create inspection schema
CREATE SCHEMA IF NOT EXISTS inspection;
-- Create the inspection user if they do not exist
DO $$
BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_user WHERE usename = 'inspection') THEN
    CREATE USER inspection WITH PASSWORD '${INS_PASSWORD}';
END IF;
END $$;
 
-- Grant access to schema
GRANT USAGE, CREATE ON SCHEMA inspection TO inspection;

-- Create audit function
CREATE OR REPLACE FUNCTION inspection.audit_history() RETURNS trigger AS $BODY$
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
            'INSERT INTO inspection.%I (target_row_id, operation_type, operation_user_id, data_after_executed_operation) VALUES ($1.%I,  ''I'', $1.create_user_id, to_jsonb($1))',  target_history_table, target_pk
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
            'INSERT INTO inspection.%I (target_row_id, operation_type, operation_user_id, data_after_executed_operation) VALUES ($1.%I, ''U'', $1.update_user_id, to_jsonb($1))', target_history_table, target_pk
          )
        USING NEW;
      RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN

      EXECUTE
        format(
                'INSERT INTO inspection.%I (target_row_id, operation_type) VALUES ($1.%I, ''D'')', target_history_table, target_pk
        )
        USING OLD;
      RETURN OLD;

    END IF;
  END;
$BODY$
LANGUAGE plpgsql;

-- Create inspection status code table
CREATE TABLE inspection.inspection_status_code (
    inspection_status_code varchar(10) NOT NULL,
    short_description varchar(50) NOT NULL,
    long_description varchar(250) NULL,
    display_order int4 NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_ingestigation_status_code" PRIMARY KEY (inspection_status_code)
);

CREATE TABLE inspection.inspection_status_code_h
(
  h_inspection_status_code_guid uuid NOT NULL  DEFAULT uuid_generate_v4(),
  target_row_id varchar(20) NOT NULL,
  operation_type char(1) NOT NULL,
  operation_user_id varchar(32) NOT NULL DEFAULT current_user,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_inspection_status_code" PRIMARY KEY (h_inspection_status_code_guid)
);

CREATE or REPLACE TRIGGER inspection_status_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON inspection.inspection_status_code
  FOR EACH ROW EXECUTE PROCEDURE inspection.audit_history('inspection_status_code_h', 'inspection_status_code');

comment on column inspection.inspection_status_code.inspection_status_code is 'A human readable code used to identify an inspection status.';
comment on column inspection.inspection_status_code.short_description is 'The short description of the inspection status code.';
comment on column inspection.inspection_status_code.long_description is 'The long description of the inspection status code.';
comment on column inspection.inspection_status_code.display_order is 'The order in which the values of the inspection status code table should be displayed when presented to a user in a list.';
comment on column inspection.inspection_status_code.active_ind is 'A boolean indicator to determine if the inspection status code is active.';
comment on column inspection.inspection_status_code.create_user_id is 'The id of the user that created the inspection status code.';
comment on column inspection.inspection_status_code.create_utc_timestamp is 'The timestamp when the  inspection status code was created.  The timestamp is stored in UTC with no Offset.';
comment on column inspection.inspection_status_code.update_user_id is 'The id of the user that updated the inspection status code.';
comment on column inspection.inspection_status_code.update_utc_timestamp is 'The timestamp when the inspection status code was updated.  The timestamp is stored in UTC with no Offset.';

comment on table inspection.inspection_status_code_h is 'History table for inspection_status_code table';
comment on column inspection.inspection_status_code_h.h_inspection_status_code_guid is 'System generated unique key for inspection_status_code history. This key should never be exposed to users via any system utilizing the tables.';
comment on column inspection.inspection_status_code_h.target_row_id is 'The unique key for the inspection_status_code that has been created or modified.';
comment on column inspection.inspection_status_code_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
comment on column inspection.inspection_status_code_h.operation_user_id is 'The id of the user that created or modified the data in the inspection_status_code table.  Defaults to the logged in user if not passed in by the application.';
comment on column inspection.inspection_status_code_h.operation_executed_at is 'The timestamp when the data in the inspection_status_code table was created or modified.  The timestamp is stored in UTC with no Offset.';
comment on column inspection.inspection_status_code_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


-- Create inspection table
CREATE TABLE inspection.inspection (
    inspection_guid uuid NULL DEFAULT uuid_generate_v4(),
    inspection_description varchar(4000) NULL,
    owned_by_agency_ref varchar(10) NOT NULL,
    inspection_status varchar(10) NOT NULL,
    inspection_opened_utc_timestamp timestamp NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NULL,
    update_utc_timestamp timestamp NULL,
    constraint "PK_inspection_guid" PRIMARY KEY (inspection_guid),
    constraint "FK_inspection__inspection_status" FOREIGN KEY (inspection_status) REFERENCES inspection.inspection_status_code(inspection_status_code)
);

CREATE TABLE inspection.inspection_h
(
  h_inspection_guid uuid NOT NULL  DEFAULT uuid_generate_v4(),
  target_row_id uuid NOT NULL,
  operation_type char(1) NOT NULL,
  operation_user_id varchar(32) NOT NULL DEFAULT current_user,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_inspection" PRIMARY KEY (h_inspection_guid)
);

CREATE or REPLACE TRIGGER inspection_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON inspection.inspection
  FOR EACH ROW EXECUTE PROCEDURE inspection.audit_history('inspection_h', 'inspection_guid');

comment on table inspection.inspection is 'The central entity of the inspections system.';	
comment on column inspection.inspection.inspection_guid is 'System generated unique key for a case.  This key should never be exposed to users via any system utilizing the tables.';
comment on column inspection.inspection.inspection_description is 'A summary of the inspection as provided by users.';
comment on column inspection.inspection.owned_by_agency_ref is 'A reference to the human readable code used to identify the agency that owns this case, found in the shared schema.';
comment on column inspection.inspection.owned_by_agency_ref is 'A reference to the human readable code used to identify the agency that owns this case, found in the shared schema.';
comment on column inspection.inspection.inspection_opened_utc_timestamp is 'UTC timestamp of when the inspection was started.';
comment on column inspection.inspection.create_user_id is 'The id of the user that created the case.';
comment on column inspection.inspection.create_utc_timestamp is 'The timestamp when the case was created.  The timestamp is stored in UTC with no Offset.';
comment on column inspection.inspection.update_user_id is 'The id of the user that updated the case.';
comment on column inspection.inspection.update_utc_timestamp is 'The timestamp when the case was updated.  The timestamp is stored in UTC with no Offset.';

COMMENT on table inspection.inspection_h is 'History table for inspection table';
COMMENT on column inspection.inspection_h.h_inspection_guid is 'System generated unique key for inspection history. This key should never be exposed to users via any system utilizing the tables.';
COMMENT on column inspection.inspection_h.target_row_id is 'The unique key for the inspection that has been created or modified.';
COMMENT on column inspection.inspection_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT on column inspection.inspection_h.operation_user_id is 'The id of the user that created or modified the data in the inspection table.  Defaults to the logged in user if not passed in by the application.';
COMMENT on column inspection.inspection_h.operation_executed_at is 'The timestamp when the data in the inspection table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT on column inspection.inspection_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

-- Create tables for assignment of officers to inspections
CREATE TABLE inspection.officer_inspection_xref_code (
	officer_inspection_xref_code varchar(10) NOT NULL,
	short_description varchar(50) NOT NULL,
  long_description varchar(250) NULL,
  display_order int4 NOT NULL,
  active_ind bool NOT NULL DEFAULT true,
  create_user_id varchar(32) NOT NULL,
  create_utc_timestamp timestamp NOT NULL,
  update_user_id varchar(32) NOT NULL,
  update_utc_timestamp timestamp NOT NULL,
  CONSTRAINT "PK_officer_inspection_xref_code" PRIMARY KEY (officer_inspection_xref_code)
);

CREATE TABLE inspection.officer_inspection_xref_code_h
(
  h_officer_inspection_xref_code_guid uuid NOT NULL  DEFAULT uuid_generate_v4(),
  target_row_id varchar(20) NOT NULL,
  operation_type char(1) NOT NULL,
  operation_user_id varchar(32) NOT NULL DEFAULT current_user,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_officer_inspection_xref_code" PRIMARY KEY (h_officer_inspection_xref_code_guid)
);

CREATE or REPLACE TRIGGER officer_inspection_xref_code_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON inspection.officer_inspection_xref_code
  FOR EACH ROW EXECUTE PROCEDURE inspection.audit_history('officer_inspection_xref_code_h', 'officer_inspection_xref_code');

comment on table inspection.officer_inspection_xref_code is 'Used to track the relationship type between officer and inspection.  For example: ''ASSIGNEE'' = Assignee';
comment on column inspection.officer_inspection_xref_code.officer_inspection_xref_code is 'A human readable code used to identify a relationship type between an officer and a inspection.';
comment on column inspection.officer_inspection_xref_code.short_description is 'The short description of the relationship type between an officer and a inspection.';
comment on column inspection.officer_inspection_xref_code.long_description is 'The long description of the relationship type between an officer and a inspection.';
comment on column inspection.officer_inspection_xref_code.display_order is 'The order in which the values of the relationship type between an officer and a inspection code table should be displayed when presented to a user in a list.';
comment on column inspection.officer_inspection_xref_code.active_ind is 'Boolean flag indicating if the relationship is active.';
comment on column inspection.officer_inspection_xref_code.create_user_id is 'The id of the user that created the relationship type between an officer and a inspection.';
comment on column inspection.officer_inspection_xref_code.create_utc_timestamp is 'The timestamp when the relationship type between an officer and a inspection  was created.  The timestamp is stored in UTC with no Offset.';
comment on column inspection.officer_inspection_xref_code.update_user_id is 'The id of the user that updated the relationship type between an officer and a inspection .';
comment on column inspection.officer_inspection_xref_code.update_utc_timestamp is 'The timestamp when the relationship type between an officer and a inspection  was updated.  The timestamp is stored in UTC with no Offset.';


comment on table inspection.officer_inspection_xref_code_h is 'History table for officer_inspection_xref_code table';
comment on column inspection.officer_inspection_xref_code_h.h_officer_inspection_xref_code_guid is 'System generated unique key for officer_inspection_xref_code history. This key should never be exposed to users via any system utilizing the tables.';
comment on column inspection.officer_inspection_xref_code_h.target_row_id is 'The unique key for the officer_inspection_xref_code that has been created or modified.';
comment on column inspection.officer_inspection_xref_code_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
comment on column inspection.officer_inspection_xref_code_h.operation_user_id is 'The id of the user that created or modified the data in the officer_inspection_xref_code table.  Defaults to the logged in user if not passed in by the application.';
comment on column inspection.officer_inspection_xref_code_h.operation_executed_at is 'The timestamp when the data in the officer_inspection_xref_code table was created or modified.  The timestamp is stored in UTC with no Offset.';
comment on column inspection.officer_inspection_xref_code_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

CREATE TABLE inspection.officer_inspection_xref (
	officer_inspection_xref_guid uuid NOT NULL DEFAULT uuid_generate_v4(),
	officer_guid_ref uuid NOT NULL,
  inspection_guid uuid NOT NULL,
  officer_inspection_xref_code varchar(10) NOT NULL,
  create_user_id varchar(32) NOT NULL,
  create_utc_timestamp timestamp NOT NULL,
  update_user_id varchar(32) NOT NULL,
  update_utc_timestamp timestamp NOT NULL,
  active_ind bool NOT NULL,
  CONSTRAINT "PK_officer_inspection_xref_guid" PRIMARY KEY (officer_inspection_xref_guid),
  CONSTRAINT "FK_officer_inspection_xref__inspection_guid" FOREIGN KEY (inspection_guid) REFERENCES inspection.inspection(inspection_guid),
  CONSTRAINT "FK_officer_inspection_xref__officer_inspection_xref_code" FOREIGN KEY (officer_inspection_xref_code) REFERENCES inspection.officer_inspection_xref_code(officer_inspection_xref_code)
);

CREATE TABLE inspection.officer_inspection_xref_h
(
  h_officer_inspection_xref_guid uuid NOT NULL  DEFAULT uuid_generate_v4(),
  target_row_id uuid NOT NULL,
  operation_type char(1) NOT NULL,
  operation_user_id varchar(32) NOT NULL DEFAULT current_user,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_officer_inspection_xref" PRIMARY KEY (h_officer_inspection_xref_guid)
);

CREATE or REPLACE TRIGGER officer_inspection_xref_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON inspection.officer_inspection_xref
  FOR EACH ROW EXECUTE PROCEDURE inspection.audit_history('officer_inspection_xref_h', 'officer_inspection_xref_guid');

comment on table inspection.officer_inspection_xref is 'Used to create a relationship between an officer and a inspection. One officer can play many roles on a inspection, and many people could be involved in a single inspection.';
comment on column inspection.officer_inspection_xref.officer_inspection_xref_guid is 'System generated unique key for a relationship between an officer and a inspection. This key should never be exposed to users via any system utilizing the tables.';
comment on column inspection.officer_inspection_xref.officer_guid_ref is 'A reference to the system generated unique key for an officer found outside of this schema.';
comment on column inspection.officer_inspection_xref.inspection_guid is 'The GUID for the inspection.';
comment on column inspection.officer_inspection_xref.officer_inspection_xref_code is 'A human readable code used to identify a relationship type between an officer and a inspection.';
comment on column inspection.officer_inspection_xref.create_user_id is 'The id of the user that created the relationship between an officer and a inspection.';
comment on column inspection.officer_inspection_xref.create_utc_timestamp is 'The timestamp when the relationship between an officer and a inspection  was created.  The timestamp is stored in UTC with no Offset.';
comment on column inspection.officer_inspection_xref.update_user_id is 'The id of the user that updated the relationship between an officer and a inspection .';
comment on column inspection.officer_inspection_xref.update_utc_timestamp is 'The timestamp when the relationship between an officer and a inspection  was updated.  The timestamp is stored in UTC with no Offset.';
comment on column inspection.officer_inspection_xref.active_ind is 'A boolean indicator to determine if the relationship type between an officer and a inspection code is active.';

comment on table inspection.officer_inspection_xref_h is 'History table for officer_inspection_xref table';
comment on column inspection.officer_inspection_xref_h.h_officer_inspection_xref_guid is 'System generated unique key for officer_inspection_xref history. This key should never be exposed to users via any system utilizing the tables.';
comment on column inspection.officer_inspection_xref_h.target_row_id is 'The unique key for the officer_inspection_xref that has been created or modified.';
comment on column inspection.officer_inspection_xref_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
comment on column inspection.officer_inspection_xref_h.operation_user_id is 'The id of the user that created or modified the data in the officer_inspection_xref table.  Defaults to the logged in user if not passed in by the application.';
comment on column inspection.officer_inspection_xref_h.operation_executed_at is 'The timestamp when the data in the officer_inspection_xref table was created or modified.  The timestamp is stored in UTC with no Offset.';
comment on column inspection.officer_inspection_xref_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';
