CREATE TABLE case_management.equipment_h
(
  h_equipment_guid uuid NOT NULL  DEFAULT uuid_generate_v4(),
  target_row_id uuid NOT NULL,
  operation_type char(1) NOT NULL,
  operation_user_id varchar(32) NOT NULL DEFAULT current_user,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_equipment" PRIMARY KEY (h_equipment_guid)
);

COMMENT on table case_management.equipment_h is 'History table for equipment table';
COMMENT on column case_management.equipment_h.h_equipment_guid is 'System generated unique key for equipment history. This key should never be exposed to users via any system utilizing the tables.';
COMMENT on column case_management.equipment_h.target_row_id is 'The unique key for the equipment that has been created or modified.';
COMMENT on column case_management.equipment_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT on column case_management.equipment_h.operation_user_id is 'The id of the user that created or modified the data in the equipment table.  Defaults to the logged in user if not passed in by the application.';
COMMENT on column case_management.equipment_h.operation_executed_at is 'The timestamp when the data in the equipment table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT on column case_management.equipment_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

CREATE or REPLACE TRIGGER equipment_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON case_management.equipment
  FOR EACH ROW EXECUTE PROCEDURE audit_history('equipment_h', 'equipment_guid');