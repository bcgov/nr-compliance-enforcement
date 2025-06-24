-- configuration definition

-- Drop table

-- DROP TABLE configuration;

CREATE TABLE configuration (
	configuration_code varchar(10) NOT NULL, -- A human readable code used to identify an configuration entry.
	configuration_value varchar(250) NOT NULL, -- The value of the configuration entry.
	long_description varchar(250) NOT NULL, -- The long description of the configuration entry.
	active_ind bool NOT NULL, -- A boolean indicator to determine if the configuration_entry is active.
	create_user_id varchar(32) NOT NULL, -- The id of the user that created the configuration entry.
	create_timestamp timestamp NOT NULL, -- The timestamp when the configuration entry was created.  The timestamp is stored in UTC with no Offset.
	update_user_id varchar(32) NOT NULL, -- The id of the user that updated the configuration entry.
	update_timestamp timestamp NULL, -- The timestamp when the configuration entry was updated.  The timestamp is stored in UTC with no Offset.
	CONSTRAINT configuration_pk PRIMARY KEY (configuration_code)
);
COMMENT ON TABLE configuration IS 'The configuration table is used to store constants which are expected to change over the lifecycle of the application, or have different values in different environments.   By making changes to in the database the behaviour of the application can be altered without requiring a full deployment.';

-- Column comments

COMMENT ON COLUMN configuration.configuration_code IS 'A human readable code used to identify an configuration entry.';
COMMENT ON COLUMN configuration.configuration_value IS 'The value of the configuration entry.';
COMMENT ON COLUMN configuration.long_description IS 'The long description of the configuration entry.';
COMMENT ON COLUMN configuration.active_ind IS 'A boolean indicator to determine if the configuration_entry is active.';
COMMENT ON COLUMN configuration.create_user_id IS 'The id of the user that created the configuration entry.';
COMMENT ON COLUMN configuration.create_timestamp IS 'The timestamp when the configuration entry was created.  The timestamp is stored in UTC with no Offset.';
COMMENT ON COLUMN configuration.update_user_id IS 'The id of the user that updated the configuration entry.';
COMMENT ON COLUMN configuration.update_timestamp IS 'The timestamp when the configuration entry was updated.  The timestamp is stored in UTC with no Offset.';

-- Table Triggers

create trigger configuration_history_trigger before
insert
    or
delete
    or
update
    on
    configuration for each row execute function audit_history('configuration_h',
    'configuration_code');

-- Audit table
CREATE TABLE configuration_h
(
  h_configuration_guid uuid NOT NULL  DEFAULT uuid_generate_v4(),
  target_row_id varchar(10) NOT NULL,
  operation_type char(1) NOT NULL,
  operation_user_id varchar(32) NOT NULL DEFAULT current_user,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_configuration" PRIMARY KEY (h_configuration_guid)
);


COMMENT on table configuration_h is 'History table for configuration table';
COMMENT on column configuration_h.h_configuration_guid is 'System generated unique key for configuration history. This key should never be exposed to users via any system utilizing the tables.';
COMMENT on column configuration_h.target_row_id is 'The unique key for the configuration that has been created or modified.';
COMMENT on column configuration_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT on column configuration_h.operation_user_id is 'The id of the user that created or modified the data in the configuration table.  Defaults to the logged in user if not passed in by the application.';
COMMENT on column configuration_h.operation_executed_at is 'The timestamp when the data in the configuration table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT on column configuration_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

CREATE or REPLACE TRIGGER configuration_history_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON configuration
  FOR EACH ROW EXECUTE PROCEDURE audit_history('configuration_h', 'configuration_code');