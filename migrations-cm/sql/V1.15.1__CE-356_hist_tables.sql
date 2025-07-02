CREATE OR REPLACE FUNCTION case_management.audit_history() RETURNS trigger AS $BODY$
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
            'INSERT INTO case_management.%I (target_row_id, operation_type, operation_user_id, data_after_executed_operation) VALUES ($1.%I,  ''I'', $1.create_user_id, to_jsonb($1))',  target_history_table, target_pk
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
            'INSERT INTO case_management.%I (target_row_id, operation_type, operation_user_id, data_after_executed_operation) VALUES ($1.%I, ''U'', $1.update_user_id, to_jsonb($1))', target_history_table, target_pk
          )
        USING NEW;
      RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN

      EXECUTE
        format(
                'INSERT INTO case_management.%I (target_row_id, operation_type) VALUES ($1.%I, ''D'')', target_history_table, target_pk
        )
        USING OLD;
      RETURN OLD;

    END IF;
  END;
$BODY$
LANGUAGE plpgsql;

CREATE TABLE case_management.case_file_h
(
  h_case_file_guid uuid NOT NULL  DEFAULT uuid_generate_v4(),
  target_row_id uuid NOT NULL,
  operation_type char(1) NOT NULL,
  operation_user_id varchar(32) NOT NULL DEFAULT current_user,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_case_file" PRIMARY KEY (h_case_file_guid)
);

CREATE TABLE case_management.action_h
(
  h_action_guid uuid NOT NULL  DEFAULT uuid_generate_v4(),
  target_row_id uuid NOT NULL,
  operation_type char(1) NOT NULL,
  operation_user_id varchar(32) NOT NULL DEFAULT current_user,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_action" PRIMARY KEY (h_action_guid)
);

CREATE TABLE case_management.lead_h
(
  h_lead_guid uuid NOT NULL  DEFAULT uuid_generate_v4(),
  target_row_id varchar(20) NOT NULL,
  operation_type char(1) NOT NULL,
  operation_user_id varchar(32) NOT NULL DEFAULT current_user,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_lead" PRIMARY KEY (h_lead_guid)
);

CREATE or REPLACE TRIGGER case_file_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON case_management.case_file
  FOR EACH ROW EXECUTE PROCEDURE audit_history('case_file_h', 'case_file_guid');

CREATE or REPLACE TRIGGER action_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON case_management.action
  FOR EACH ROW EXECUTE PROCEDURE audit_history('action_h', 'action_guid');

CREATE or REPLACE TRIGGER lead_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON case_management.lead
  FOR EACH ROW EXECUTE PROCEDURE audit_history('lead_h', 'lead_identifier');


COMMENT on table case_management.case_file_h is 'History table for case_file table';
COMMENT on column case_management.case_file_h.h_case_file_guid is 'System generated unique key for case history. This key should never be exposed to users via any system utilizing the tables.';
COMMENT on column case_management.case_file_h.target_row_id is 'The unique key for the case that has been created or modified.';
COMMENT on column case_management.case_file_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT on column case_management.case_file_h.operation_user_id is 'The id of the user that created or modified the data in the case table.  Defaults to the logged in user if not passed in by the application.';
COMMENT on column case_management.case_file_h.operation_executed_at is 'The timestamp when the data in the case table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT on column case_management.case_file_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

COMMENT on table case_management.action_h is 'History table for action table';
COMMENT on column case_management.action_h.h_action_guid is 'System generated unique key for action history. This key should never be exposed to users via any system utilizing the tables.';
COMMENT on column case_management.action_h.target_row_id is 'The unique key for the action that has been created or modified.';
COMMENT on column case_management.action_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT on column case_management.action_h.operation_user_id is 'The id of the user that created or modified the data in the action table.  Defaults to the logged in user if not passed in by the application.';
COMMENT on column case_management.action_h.operation_executed_at is 'The timestamp when the data in the action table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT on column case_management.action_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

COMMENT on table case_management.lead_h is 'History table for lead table';
COMMENT on column case_management.lead_h.h_lead_guid is 'System generated unique key for lead history. This key should never be exposed to users via any system utilizing the tables.';
COMMENT on column case_management.lead_h.target_row_id is 'The unique key for the lead that has been created or modified.';
COMMENT on column case_management.lead_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT on column case_management.lead_h.operation_user_id is 'The id of the user that created or modified the data in the lead table.  Defaults to the logged in user if not passed in by the application.';
COMMENT on column case_management.lead_h.operation_executed_at is 'The timestamp when the data in the lead table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT on column case_management.lead_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


