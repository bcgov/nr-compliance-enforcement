CREATE OR REPLACE FUNCTION audit_history() RETURNS trigger AS $BODY$
  DECLARE
	target_history_table TEXT;
	target_pk TEXT;
   BEGIN
          target_history_table := TG_ARGV[0];
          target_pk := TG_ARGV[1];

     IF TG_OP ='INSERT' THEN 
          
	-- Don't trust the caller not to manipulate any of these fields
          NEW.create_timestamp := current_timestamp; -- create timestamp must be the current time
          NEW.update_timestamp := current_timestamp; -- update timestamp must be the current time
          NEW.update_user_id := NEW.create_user_id;  -- the update user must be the same as the create user
	
          EXECUTE
             format( 
                  'INSERT INTO %I (target_row_id, operation_type, data_after_executed_operation) VALUES ($1.%I,  ''I'', to_jsonb($1))',  target_history_table, target_pk
              )
             USING NEW;
          RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN 

       -- Don't trust the caller not to manipulate any of these fields
       NEW.update_timestamp := current_timestamp;  -- update timestamp must be the current time
       NEW.create_user_id := OLD.create_user_id; -- create userId can't be altered
       NEW.create_timestamp := OLD.create_timestamp; -- update timestamp can't be altered

       EXECUTE
            format(
                'INSERT INTO %I (target_row_id, operation_type, data_after_executed_operation) VALUES ($1.%I, ''U'', to_jsonb($1))', target_history_table, target_pk
             )
            USING NEW;
      RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN

        EXECUTE
             format(
                    'INSERT INTO %I (target_row_id, operation_type) VALUES ($1.%I, ''D'')', target_history_table, target_pk
             )
            USING OLD;
      RETURN OLD;

    END IF;
  END;
$BODY$
LANGUAGE plpgsql;

CREATE TABLE allegation_complaint_h
(
  h_allegation_complaint_guid uuid NOT NULL  DEFAULT uuid_generate_v4(),
  target_row_id uuid NOT NULL,
  operation_type char(1) NOT NULL,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_algtncmplt" PRIMARY KEY (h_allegation_complaint_guid)
);


CREATE or REPLACE TRIGGER algtncmplt_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON allegation_complaint
  FOR EACH ROW EXECUTE PROCEDURE audit_history('allegation_complaint_h', 'allegation_complaint_guid');
