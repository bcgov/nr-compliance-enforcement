-- Create investigation schema
CREATE SCHEMA IF NOT EXISTS investigation;
-- Create the investigation user if they do not exist
DO $$
BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_user WHERE usename = 'investigation') THEN
    CREATE USER investigation WITH PASSWORD '${INV_PASSWORD}';
END IF;
END $$;
 
-- Grant access to schema
GRANT USAGE, CREATE ON SCHEMA investigation TO investigation;

-- Create audit function
CREATE OR REPLACE FUNCTION investigation.audit_history() RETURNS trigger AS $BODY$
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
            'INSERT INTO investigation.%I (target_row_id, operation_type, operation_user_id, data_after_executed_operation) VALUES ($1.%I,  ''I'', $1.create_user_id, to_jsonb($1))',  target_history_table, target_pk
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
            'INSERT INTO investigation.%I (target_row_id, operation_type, operation_user_id, data_after_executed_operation) VALUES ($1.%I, ''U'', $1.update_user_id, to_jsonb($1))', target_history_table, target_pk
          )
        USING NEW;
      RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN

      EXECUTE
        format(
                'INSERT INTO investigation.%I (target_row_id, operation_type) VALUES ($1.%I, ''D'')', target_history_table, target_pk
        )
        USING OLD;
      RETURN OLD;

    END IF;
  END;
$BODY$
LANGUAGE plpgsql;

-- Create investigation status code table
CREATE TABLE investigation.investigation_status_code (
    investigation_status_code varchar(10) NOT NULL,
    short_description varchar(50) NOT NULL,
    long_description varchar(250) NULL,
    display_order int4 NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_ingestigation_status_code" PRIMARY KEY (investigation_status_code)
);

CREATE TABLE investigation.investigation_status_code_h
(
  h_investigation_status_code_guid uuid NOT NULL  DEFAULT uuid_generate_v4(),
  target_row_id varchar(20) NOT NULL,
  operation_type char(1) NOT NULL,
  operation_user_id varchar(32) NOT NULL DEFAULT current_user,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_investigation_status_code" PRIMARY KEY (h_investigation_status_code_guid)
);

CREATE or REPLACE TRIGGER investigation_status_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON investigation.investigation_status_code
  FOR EACH ROW EXECUTE PROCEDURE investigation.audit_history('investigation_status_code_h', 'investigation_status_code');

comment on column investigation.investigation_status_code.investigation_status_code is 'A human readable code used to identify an investigation status.';
comment on column investigation.investigation_status_code.short_description is 'The short description of the investigation status code.';
comment on column investigation.investigation_status_code.long_description is 'The long description of the investigation status code.';
comment on column investigation.investigation_status_code.display_order is 'The order in which the values of the investigation status code table should be displayed when presented to a user in a list.';
comment on column investigation.investigation_status_code.active_ind is 'A boolean indicator to determine if the investigation status code is active.';
comment on column investigation.investigation_status_code.create_user_id is 'The id of the user that created the investigation status code.';
comment on column investigation.investigation_status_code.create_utc_timestamp is 'The timestamp when the  investigation status code was created.  The timestamp is stored in UTC with no Offset.';
comment on column investigation.investigation_status_code.update_user_id is 'The id of the user that updated the investigation status code.';
comment on column investigation.investigation_status_code.update_utc_timestamp is 'The timestamp when the investigation status code was updated.  The timestamp is stored in UTC with no Offset.';

comment on table investigation.investigation_status_code_h is 'History table for investigation_status_code table';
comment on column investigation.investigation_status_code_h.h_investigation_status_code_guid is 'System generated unique key for investigation_status_code history. This key should never be exposed to users via any system utilizing the tables.';
comment on column investigation.investigation_status_code_h.target_row_id is 'The unique key for the investigation_status_code that has been created or modified.';
comment on column investigation.investigation_status_code_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
comment on column investigation.investigation_status_code_h.operation_user_id is 'The id of the user that created or modified the data in the investigation_status_code table.  Defaults to the logged in user if not passed in by the application.';
comment on column investigation.investigation_status_code_h.operation_executed_at is 'The timestamp when the data in the investigation_status_code table was created or modified.  The timestamp is stored in UTC with no Offset.';
comment on column investigation.investigation_status_code_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


-- Create investigation table
CREATE TABLE investigation.investigation (
    investigation_guid uuid NULL DEFAULT uuid_generate_v4(),
    investigation_description varchar(4000) NULL,
    owned_by_agency_ref varchar(10) NOT NULL,
    investigation_status varchar(10) NOT NULL,
    investigation_opened_utc_timestamp timestamp NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NULL,
    update_utc_timestamp timestamp NULL,
    constraint "PK_investigation_guid" PRIMARY KEY (investigation_guid),
    constraint "FK_investigation__investigation_status" FOREIGN KEY (investigation_status) REFERENCES investigation.investigation_status_code(investigation_status_code)
);

CREATE TABLE investigation.investigation_h
(
  h_investigation_guid uuid NOT NULL  DEFAULT uuid_generate_v4(),
  target_row_id uuid NOT NULL,
  operation_type char(1) NOT NULL,
  operation_user_id varchar(32) NOT NULL DEFAULT current_user,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_investigation" PRIMARY KEY (h_investigation_guid)
);

CREATE or REPLACE TRIGGER investigation_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON investigation.investigation
  FOR EACH ROW EXECUTE PROCEDURE investigation.audit_history('investigation_h', 'investigation_guid');

comment on table investigation.investigation is 'The central entity of the investigations system.';	
comment on column investigation.investigation.investigation_guid is 'System generated unique key for a case.  This key should never be exposed to users via any system utilizing the tables.';
comment on column investigation.investigation.investigation_description is 'A summary of the investigation as provided by users.';
comment on column investigation.investigation.owned_by_agency_ref is 'A reference to the human readable code used to identify the agency that owns this case, found in the shared schema.';
comment on column investigation.investigation.owned_by_agency_ref is 'A reference to the human readable code used to identify the agency that owns this case, found in the shared schema.';
comment on column investigation.investigation.investigation_opened_utc_timestamp is 'UTC timestamp of when the investigation was started.';
comment on column investigation.investigation.create_user_id is 'The id of the user that created the case.';
comment on column investigation.investigation.create_utc_timestamp is 'The timestamp when the case was created.  The timestamp is stored in UTC with no Offset.';
comment on column investigation.investigation.update_user_id is 'The id of the user that updated the case.';
comment on column investigation.investigation.update_utc_timestamp is 'The timestamp when the case was updated.  The timestamp is stored in UTC with no Offset.';

COMMENT on table investigation.investigation_h is 'History table for investigation table';
COMMENT on column investigation.investigation_h.h_investigation_guid is 'System generated unique key for investigation history. This key should never be exposed to users via any system utilizing the tables.';
COMMENT on column investigation.investigation_h.target_row_id is 'The unique key for the investigation that has been created or modified.';
COMMENT on column investigation.investigation_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT on column investigation.investigation_h.operation_user_id is 'The id of the user that created or modified the data in the investigation table.  Defaults to the logged in user if not passed in by the application.';
COMMENT on column investigation.investigation_h.operation_executed_at is 'The timestamp when the data in the investigation table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT on column investigation.investigation_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

-- Create tables for assignment of officers to investigations
CREATE TABLE investigation.officer_investigation_xref_code (
	officer_investigation_xref_code varchar(10) NOT NULL,
	short_description varchar(50) NOT NULL,
  long_description varchar(250) NULL,
  display_order int4 NOT NULL,
  active_ind bool NOT NULL DEFAULT true,
  create_user_id varchar(32) NOT NULL,
  create_utc_timestamp timestamp NOT NULL,
  update_user_id varchar(32) NOT NULL,
  update_utc_timestamp timestamp NOT NULL,
  CONSTRAINT "PK_officer_investigation_xref_code" PRIMARY KEY (officer_investigation_xref_code)
);

CREATE TABLE investigation.officer_investigation_xref_code_h
(
  h_officer_investigation_xref_code_guid uuid NOT NULL  DEFAULT uuid_generate_v4(),
  target_row_id varchar(20) NOT NULL,
  operation_type char(1) NOT NULL,
  operation_user_id varchar(32) NOT NULL DEFAULT current_user,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_officer_investigation_xref_code" PRIMARY KEY (h_officer_investigation_xref_code_guid)
);

CREATE or REPLACE TRIGGER officer_investigation_xref_code_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON investigation.officer_investigation_xref_code
  FOR EACH ROW EXECUTE PROCEDURE investigation.audit_history('officer_investigation_xref_code_h', 'officer_investigation_xref_code');

comment on table investigation.officer_investigation_xref_code is 'Used to track the relationship type between officer and investigation.  For example: ''ASSIGNEE'' = Assignee';
comment on column investigation.officer_investigation_xref_code.officer_investigation_xref_code is 'A human readable code used to identify a relationship type between an officer and a investigation.';
comment on column investigation.officer_investigation_xref_code.short_description is 'The short description of the relationship type between an officer and a investigation.';
comment on column investigation.officer_investigation_xref_code.long_description is 'The long description of the relationship type between an officer and a investigation.';
comment on column investigation.officer_investigation_xref_code.display_order is 'The order in which the values of the relationship type between an officer and a investigation code table should be displayed when presented to a user in a list.';
comment on column investigation.officer_investigation_xref_code.active_ind is 'Boolean flag indicating if the relationship is active.';
comment on column investigation.officer_investigation_xref_code.create_user_id is 'The id of the user that created the relationship type between an officer and a investigation.';
comment on column investigation.officer_investigation_xref_code.create_utc_timestamp is 'The timestamp when the relationship type between an officer and a investigation  was created.  The timestamp is stored in UTC with no Offset.';
comment on column investigation.officer_investigation_xref_code.update_user_id is 'The id of the user that updated the relationship type between an officer and a investigation .';
comment on column investigation.officer_investigation_xref_code.update_utc_timestamp is 'The timestamp when the relationship type between an officer and a investigation  was updated.  The timestamp is stored in UTC with no Offset.';


comment on table investigation.officer_investigation_xref_code_h is 'History table for officer_investigation_xref_code table';
comment on column investigation.officer_investigation_xref_code_h.h_officer_investigation_xref_code_guid is 'System generated unique key for officer_investigation_xref_code history. This key should never be exposed to users via any system utilizing the tables.';
comment on column investigation.officer_investigation_xref_code_h.target_row_id is 'The unique key for the officer_investigation_xref_code that has been created or modified.';
comment on column investigation.officer_investigation_xref_code_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
comment on column investigation.officer_investigation_xref_code_h.operation_user_id is 'The id of the user that created or modified the data in the officer_investigation_xref_code table.  Defaults to the logged in user if not passed in by the application.';
comment on column investigation.officer_investigation_xref_code_h.operation_executed_at is 'The timestamp when the data in the officer_investigation_xref_code table was created or modified.  The timestamp is stored in UTC with no Offset.';
comment on column investigation.officer_investigation_xref_code_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

CREATE TABLE investigation.officer_investigation_xref (
	officer_investigation_xref_guid uuid NOT NULL DEFAULT uuid_generate_v4(),
	officer_guid_ref uuid NOT NULL,
  investigation_guid uuid NOT NULL,
  officer_investigation_xref_code varchar(10) NOT NULL,
  create_user_id varchar(32) NOT NULL,
  create_utc_timestamp timestamp NOT NULL,
  update_user_id varchar(32) NOT NULL,
  update_utc_timestamp timestamp NOT NULL,
  active_ind bool NOT NULL,
  CONSTRAINT "PK_officer_investigation_xref_guid" PRIMARY KEY (officer_investigation_xref_guid),
  CONSTRAINT "FK_officer_investigation_xref__investigation_guid" FOREIGN KEY (investigation_guid) REFERENCES investigation.investigation(investigation_guid),
  CONSTRAINT "FK_officer_investigation_xref__officer_investigation_xref_code" FOREIGN KEY (officer_investigation_xref_code) REFERENCES investigation.officer_investigation_xref_code(officer_investigation_xref_code)
);

CREATE TABLE investigation.officer_investigation_xref_h
(
  h_officer_investigation_xref_guid uuid NOT NULL  DEFAULT uuid_generate_v4(),
  target_row_id uuid NOT NULL,
  operation_type char(1) NOT NULL,
  operation_user_id varchar(32) NOT NULL DEFAULT current_user,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_officer_investigation_xref" PRIMARY KEY (h_officer_investigation_xref_guid)
);

CREATE or REPLACE TRIGGER officer_investigation_xref_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON investigation.officer_investigation_xref
  FOR EACH ROW EXECUTE PROCEDURE investigation.audit_history('officer_investigation_xref_h', 'officer_investigation_xref_guid');

comment on table investigation.officer_investigation_xref is 'Used to create a relationship between an officer and a investigation. One officer can play many roles on a investigation, and many people could be involved in a single investigation.';
comment on column investigation.officer_investigation_xref.officer_investigation_xref_guid is 'System generated unique key for a relationship between an officer and a investigation. This key should never be exposed to users via any system utilizing the tables.';
comment on column investigation.officer_investigation_xref.officer_guid_ref is 'A reference to the system generated unique key for an officer found outside of this schema.';
comment on column investigation.officer_investigation_xref.investigation_guid is 'The GUID for the investigation.';
comment on column investigation.officer_investigation_xref.officer_investigation_xref_code is 'A human readable code used to identify a relationship type between an officer and a investigation.';
comment on column investigation.officer_investigation_xref.create_user_id is 'The id of the user that created the relationship between an officer and a investigation.';
comment on column investigation.officer_investigation_xref.create_utc_timestamp is 'The timestamp when the relationship between an officer and a investigation  was created.  The timestamp is stored in UTC with no Offset.';
comment on column investigation.officer_investigation_xref.update_user_id is 'The id of the user that updated the relationship between an officer and a investigation .';
comment on column investigation.officer_investigation_xref.update_utc_timestamp is 'The timestamp when the relationship between an officer and a investigation  was updated.  The timestamp is stored in UTC with no Offset.';
comment on column investigation.officer_investigation_xref.active_ind is 'A boolean indicator to determine if the relationship type between an officer and a investigation code is active.';

comment on table investigation.officer_investigation_xref_h is 'History table for officer_investigation_xref table';
comment on column investigation.officer_investigation_xref_h.h_officer_investigation_xref_guid is 'System generated unique key for officer_investigation_xref history. This key should never be exposed to users via any system utilizing the tables.';
comment on column investigation.officer_investigation_xref_h.target_row_id is 'The unique key for the officer_investigation_xref that has been created or modified.';
comment on column investigation.officer_investigation_xref_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
comment on column investigation.officer_investigation_xref_h.operation_user_id is 'The id of the user that created or modified the data in the officer_investigation_xref table.  Defaults to the logged in user if not passed in by the application.';
comment on column investigation.officer_investigation_xref_h.operation_executed_at is 'The timestamp when the data in the officer_investigation_xref table was created or modified.  The timestamp is stored in UTC with no Offset.';
comment on column investigation.officer_investigation_xref_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';
