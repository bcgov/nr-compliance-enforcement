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
            'INSERT INTO %I (target_row_id, operation_type, operation_user_id, data_after_executed_operation) VALUES ($1.%I,  ''I'', $1.create_user_id, to_jsonb($1))',  target_history_table, target_pk
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
            'INSERT INTO %I (target_row_id, operation_type, operation_user_id, data_after_executed_operation) VALUES ($1.%I, ''U'', $1.update_user_id, to_jsonb($1))', target_history_table, target_pk
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
  h_algtncmplt_guid uuid NOT NULL  DEFAULT uuid_generate_v4(),
  target_row_id uuid NOT NULL,
  operation_type char(1) NOT NULL,
  operation_user_id varchar(32) NOT NULL DEFAULT current_user,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_algtncmplt" PRIMARY KEY (h_algtncmplt_guid)
);

CREATE TABLE attractant_hwcr_xref_h
(
  h_attrhwcrx_guid uuid NOT NULL  DEFAULT uuid_generate_v4(),
  target_row_id uuid NOT NULL,
  operation_type char(1) NOT NULL,
  operation_user_id varchar(32) NOT NULL DEFAULT current_user,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_attrhwcrx" PRIMARY KEY (h_attrhwcrx_guid)
);

CREATE TABLE complaint_h
(
  h_complaint_guid uuid NOT NULL  DEFAULT uuid_generate_v4(),
  target_row_id varchar(20) NOT NULL,
  operation_type char(1) NOT NULL,
  operation_user_id varchar(32) NOT NULL DEFAULT current_user,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_complaint" PRIMARY KEY (h_complaint_guid)
);

CREATE TABLE geo_org_unit_structure_h
(
  h_gorgustrct_guid uuid NOT NULL  DEFAULT uuid_generate_v4(),
  target_row_id uuid NOT NULL,
  operation_type char(1) NOT NULL,
  operation_user_id varchar(32) NOT NULL DEFAULT current_user,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_gorgustrct" PRIMARY KEY (h_gorgustrct_guid)
);

CREATE TABLE hwcr_complaint_h
(
  h_hwcrcmplt_guid uuid NOT NULL  DEFAULT uuid_generate_v4(),
  target_row_id uuid NOT NULL,
  operation_type char(1) NOT NULL,
  operation_user_id varchar(32) NOT NULL DEFAULT current_user,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_hwcrcmplt" PRIMARY KEY (h_hwcrcmplt_guid)
);

CREATE TABLE office_h
(
  h_office_guid uuid NOT NULL  DEFAULT uuid_generate_v4(),
  target_row_id uuid NOT NULL,
  operation_type char(1) NOT NULL,
  operation_user_id varchar(32) NOT NULL DEFAULT current_user,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_office" PRIMARY KEY (h_office_guid)
);

CREATE TABLE officer_h
(
  h_officer_guid uuid NOT NULL  DEFAULT uuid_generate_v4(),
  target_row_id uuid NOT NULL,
  operation_type char(1) NOT NULL,
  operation_user_id varchar(32) NOT NULL DEFAULT current_user,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_officer" PRIMARY KEY (h_officer_guid)
);

CREATE TABLE person_h
(
  h_person_guid uuid NOT NULL  DEFAULT uuid_generate_v4(),
  target_row_id uuid NOT NULL,
  operation_type char(1) NOT NULL,
  operation_user_id varchar(32) NOT NULL DEFAULT current_user,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_person" PRIMARY KEY (h_person_guid)
);



CREATE or REPLACE TRIGGER algtncmplt_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON allegation_complaint
  FOR EACH ROW EXECUTE PROCEDURE audit_history('allegation_complaint_h', 'allegation_complaint_guid');

CREATE or REPLACE TRIGGER attrhwcrx_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON attractant_hwcr_xref
  FOR EACH ROW EXECUTE PROCEDURE audit_history('attractant_hwcr_xref_h', 'attractant_hwcr_xref_guid');

CREATE or REPLACE TRIGGER complaint_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON complaint
  FOR EACH ROW EXECUTE PROCEDURE audit_history('complaint_h', 'complaint_identifier');

CREATE or REPLACE TRIGGER gorgustrct_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON geo_org_unit_structure
  FOR EACH ROW EXECUTE PROCEDURE audit_history('geo_org_unit_structure_h', 'geo_org_unit_structure_guid');

CREATE or REPLACE TRIGGER hwcrcmplt_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON hwcr_complaint
  FOR EACH ROW EXECUTE PROCEDURE audit_history('hwcr_complaint_h', 'hwcr_complaint_guid');

CREATE or REPLACE TRIGGER office_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON office
  FOR EACH ROW EXECUTE PROCEDURE audit_history('office_h', 'office_guid');

CREATE or REPLACE TRIGGER officer_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON officer
  FOR EACH ROW EXECUTE PROCEDURE audit_history('officer_h', 'officer_guid');

CREATE or REPLACE TRIGGER person_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON person
  FOR EACH ROW EXECUTE PROCEDURE audit_history('person_h', 'person_guid');

COMMENT on table allegation_complaint_h is 'History table for allegation_complaint table';
COMMENT on column allegation_complaint_h.h_algtncmplt_guid is 'System generated unique key for allegation complaint history. This key should never be exposed to users via any system utilizing the tables.';
COMMENT on column allegation_complaint_h.target_row_id is 'The unique key for the allegation complaint that has been created or modified.';
COMMENT on column allegation_complaint_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT on column allegation_complaint_h.operation_user_id is 'The id of the user that created or modified the data in the allegation complaint table.  Defaults to the logged in user if not passed in by the application.';
COMMENT on column allegation_complaint_h.operation_executed_at is 'The timestamp when the data in the allegation complaint table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT on column allegation_complaint_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

COMMENT on table attractant_hwcr_xref_h is 'History table for attractant_hwcr_xref table';
COMMENT on column attractant_hwcr_xref_h.h_attrhwcrx_guid is 'System generated unique key for attractant hwcr xref history. This key should never be exposed to users via any system utilizing the tables.';
COMMENT on column attractant_hwcr_xref_h.target_row_id is 'The unique key for the attractant hwcr xref that has been created or modified.';
COMMENT on column attractant_hwcr_xref_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT on column attractant_hwcr_xref_h.operation_user_id is 'The id of the user that created or modified the data in the attractant hwcr xref table.  Defaults to the logged in user if not passed in by the application.';
COMMENT on column attractant_hwcr_xref_h.operation_executed_at is 'The timestamp when the data in the attractant hwcr xref table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT on column attractant_hwcr_xref_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

COMMENT on table complaint_h is 'History table for complaint table';
COMMENT on column complaint_h.h_complaint_guid is 'System generated unique key for complaint history. This key should never be exposed to users via any system utilizing the tables.';
COMMENT on column complaint_h.target_row_id is 'The unique key for the complaint that has been created or modified.';
COMMENT on column complaint_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT on column complaint_h.operation_user_id is 'The id of the user that created or modified the data in the complaint table.  Defaults to the logged in user if not passed in by the application.';
COMMENT on column complaint_h.operation_executed_at is 'The timestamp when the data in the complaint table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT on column complaint_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

COMMENT on table geo_org_unit_structure_h is 'History table for geo_org_unit_structure table';
COMMENT on column geo_org_unit_structure_h.h_gorgustrct_guid is 'System generated unique key for geographic organization unit structure history. This key should never be exposed to users via any system utilizing the tables.';
COMMENT on column geo_org_unit_structure_h.target_row_id is 'The unique key for the geographic organization unit structure that has been created or modified.';
COMMENT on column geo_org_unit_structure_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT on column geo_org_unit_structure_h.operation_user_id is 'The id of the user that created or modified the data in the geographic organization unit structure table.  Defaults to the logged in user if not passed in by the application.';
COMMENT on column geo_org_unit_structure_h.operation_executed_at is 'The timestamp when the data in the geographic organization unit structure table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT on column geo_org_unit_structure_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

COMMENT on table hwcr_complaint_h is 'History table for hwcr_complaint table';
COMMENT on column hwcr_complaint_h.h_hwcrcmplt_guid is 'System generated unique key for HWCR complaint history. This key should never be exposed to users via any system utilizing the tables.';
COMMENT on column hwcr_complaint_h.target_row_id is 'The unique key for the HWCR complaint that has been created or modified.';
COMMENT on column hwcr_complaint_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT on column hwcr_complaint_h.operation_user_id is 'The id of the user that created or modified the data in the HWCR complaint table.  Defaults to the logged in user if not passed in by the application.';
COMMENT on column hwcr_complaint_h.operation_executed_at is 'The timestamp when the data in the HWCR complaint table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT on column hwcr_complaint_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

COMMENT on table office_h is 'History table for office table';
COMMENT on column office_h.h_office_guid is 'System generated unique key for office history. This key should never be exposed to users via any system utilizing the tables.';
COMMENT on column office_h.target_row_id is 'The unique key for the office that has been created or modified.';
COMMENT on column office_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT on column office_h.operation_user_id is 'The id of the user that created or modified the data in the office table.  Defaults to the logged in user if not passed in by the application.';
COMMENT on column office_h.operation_executed_at is 'The timestamp when the data in the office table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT on column office_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

COMMENT on table officer_h is 'History table for officer table';
COMMENT on column officer_h.h_officer_guid is 'System generated unique key for officer history. This key should never be exposed to users via any system utilizing the tables.';
COMMENT on column officer_h.target_row_id is 'The unique key for the officer that has been created or modified.';
COMMENT on column officer_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT on column officer_h.operation_user_id is 'The id of the user that created or modified the data in the officer table.  Defaults to the logged in user if not passed in by the application.';
COMMENT on column officer_h.operation_executed_at is 'The timestamp when the data in the officer table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT on column officer_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

COMMENT on table person_h is 'History table for person table';
COMMENT on column person_h.h_person_guid is 'System generated unique key for person history. This key should never be exposed to users via any system utilizing the tables.';
COMMENT on column person_h.target_row_id is 'The unique key for the person that has been created or modified.';
COMMENT on column person_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT on column person_h.operation_user_id is 'The id of the user that created or modified the data in the person table.  Defaults to the logged in user if not passed in by the application.';
COMMENT on column person_h.operation_executed_at is 'The timestamp when the data in the person table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT on column person_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

