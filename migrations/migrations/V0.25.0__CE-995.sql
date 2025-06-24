-- team_code definition
-- Drop table
-- DROP TABLE team_code;
CREATE TABLE
  team_code (
    team_code varchar(10) NOT NULL, -- A human readable code used to identify a team.
    short_description varchar(50) NOT NULL, -- The short description of the team code.
    long_description varchar(250) NULL, -- The long description of the team code.
    display_order int4 NOT NULL, -- The order in which the values of the team code table should be displayed when presented to a user in a list.
    active_ind bool NOT NULL, -- A boolean indicator to determine if the team code is active.
    create_user_id varchar(32) NOT NULL, -- The id of the user that created the team code.
    create_utc_timestamp timestamp NOT NULL, -- The timestamp when the team was created.  The timestamp is stored in UTC with no Offset.
    update_user_id varchar(32) NOT NULL, -- The id of the user that updated the team code.
    update_utc_timestamp timestamp NOT NULL, -- The timestamp when the team was updated.  The timestamp is stored in UTC with no Offset.
    CONSTRAINT "PK_teamcode" PRIMARY KEY (team_code)
  );

COMMENT ON TABLE team_code IS 'An team is an organized and named grouping of people that interacts in some way with the Ministry.';

-- Column comments
COMMENT ON COLUMN team_code.team_code IS 'A human readable code used to identify an team.';

COMMENT ON COLUMN team_code.short_description IS 'The short description of the team code.';

COMMENT ON COLUMN team_code.long_description IS 'The long description of the team code.';

COMMENT ON COLUMN team_code.display_order IS 'The order in which the values of the team code table should be displayed when presented to a user in a list.';

COMMENT ON COLUMN team_code.active_ind IS 'A boolean indicator to determine if the team code is active.';

COMMENT ON COLUMN team_code.create_user_id IS 'The id of the user that created the team code.';

COMMENT ON COLUMN team_code.create_utc_timestamp IS 'The timestamp when the team was created.  The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN team_code.update_user_id IS 'The id of the user that updated the team code.';

COMMENT ON COLUMN team_code.update_utc_timestamp IS 'The timestamp when the team was updated.  The timestamp is stored in UTC with no Offset.';

CREATE TABLE
  team (
    team_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    team_code varchar(15) NOT NULL,
    agency_code varchar(6) NOT NULL,
    active_ind bool NOT NULL DEFAULT true,
    create_user_id varchar(32) NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT team_pk PRIMARY KEY (team_guid),
    CONSTRAINT team_un UNIQUE (team_code, agency_code),
    CONSTRAINT team_team_code_fk FOREIGN KEY (team_code) REFERENCES team_code (team_code),
    CONSTRAINT team_agency_code_fk FOREIGN KEY (agency_code) REFERENCES agency_code (agency_code)
  );

comment on table team is 'Contains a list of TEAM types';

comment on column team.team_guid is 'A system generated guid to uniquely identify a TEAM';

comment on column team.team_code is 'A human readable code used to identify a TEAM';

comment on column team.active_ind is 'A boolean indicator to determine if the TEAM is active.';

comment on column team.create_user_id is 'The id of the user that created the TEAM.';

comment on column team.create_utc_timestamp is 'The timestamp when the TEAM was created.  The timestamp is stored in UTC with no Offset.';

comment on column team.update_user_id is 'The id of the user that updated the TEAM';

comment on column team.update_utc_timestamp is 'The timestamp when the TEAM was updated.  The timestamp is stored in UTC with no Offset.';

-- officer_team_xref definition
-- Drop table
-- DROP TABLE officer_team_xref;
CREATE TABLE
  officer_team_xref (
    officer_team_xref_guid uuid NOT NULL DEFAULT uuid_generate_v4 (), -- System generated unique key for a OFFICER_TEAM_XREF record.  This key should never be exposed to users via any system utilizing the tables.
    officer_guid uuid NOT NULL, -- Unique key for an officer. This key should never be exposed to users via any system utilizing the tables.
    team_guid uuid NOT NULL, -- Unique key for a TEAM
    active_ind bool NOT NULL, -- Used to indicate if the users in the OFFICER_TEAM_XREF recrodis active.
    create_user_id varchar(32) NULL, -- The id of the user that created the OFFICER_TEAM_XREF.
    create_utc_timestamp timestamp NOT NULL, -- The timestamp when the OFFICER_TEAM_XREF was created.  The timestamp is stored in UTC with no Offset.
    update_user_id varchar(32) NULL, -- The id of the user that updated the OFFICER_TEAM_XREF
    update_utc_timestamp timestamp NOT NULL, -- The timestamp when the OFFICER_TEAM_XREF was updated.  The timestamp is stored in UTC with no Offset.
    CONSTRAINT officer_team_xref_pk PRIMARY KEY (officer_team_xref_guid),
    CONSTRAINT officer_team_xref_officer_fk FOREIGN KEY (officer_guid) REFERENCES officer (officer_guid),
    CONSTRAINT officer_team_xref_team_fk FOREIGN KEY (team_guid) REFERENCES team (team_guid)
  );

COMMENT ON TABLE officer_team_xref IS 'Defines the teams an officer may be on';

COMMENT ON COLUMN officer_team_xref.officer_team_xref_guid IS 'System generated unique key for a OFFICER_TEAM_XREF record.  This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN officer_team_xref.officer_guid IS 'Unique key for an officer. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN officer_team_xref.team_guid IS 'Unique key for a team. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN officer_team_xref.active_ind IS 'Used to indicate if the users in the OFFICER_TEAM_XREF recrodis active.';

COMMENT ON COLUMN officer_team_xref.create_user_id IS 'The id of the user that created the OFFICER_TEAM_XREF.';

COMMENT ON COLUMN officer_team_xref.create_utc_timestamp IS 'The timestamp when the OFFICER_TEAM_XREF was created.  The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN officer_team_xref.update_user_id IS 'The id of the user that updated the OFFICER_TEAM_XREF';

COMMENT ON COLUMN officer_team_xref.update_utc_timestamp IS 'The timestamp when the OFFICER_TEAM_XREF was updated.  The timestamp is stored in UTC with no Offset.';

-- Audit table
CREATE TABLE
  team_h (
    h_team_guid uuid NOT NULL DEFAULT uuid_generate_v4 (),
    target_row_id uuid NOT NULL,
    operation_type char(1) NOT NULL,
    operation_user_id varchar(32) NOT NULL DEFAULT current_user,
    operation_executed_at timestamp NOT NULL DEFAULT now (),
    data_after_executed_operation jsonb,
    CONSTRAINT "PK_h_team" PRIMARY KEY (h_team_guid)
  );

COMMENT on table team_h is 'History table for team table';

COMMENT on column team_h.h_team_guid is 'System generated unique key for team history. This key should never be exposed to users via any system utilizing the tables.';

COMMENT on column team_h.target_row_id is 'The unique key for the team that has been created or modified.';

COMMENT on column team_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT on column team_h.operation_user_id is 'The id of the user that created or modified the data in the team table.  Defaults to the logged in user if not passed in by the application.';

COMMENT on column team_h.operation_executed_at is 'The timestamp when the data in the team table was created or modified.  The timestamp is stored in UTC with no Offset.';

COMMENT on column team_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

CREATE
or REPLACE TRIGGER team_history_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON team FOR EACH ROW EXECUTE PROCEDURE audit_history ('team_h', 'team_guid');

CREATE TABLE
  officer_team_xref_h (
    h_officer_team_xref_guid uuid NOT NULL DEFAULT uuid_generate_v4 (),
    target_row_id uuid NOT NULL,
    operation_type char(1) NOT NULL,
    operation_user_id varchar(32) NOT NULL DEFAULT current_user,
    operation_executed_at timestamp NOT NULL DEFAULT now (),
    data_after_executed_operation jsonb,
    CONSTRAINT "PK_h_officer_team_xref" PRIMARY KEY (h_officer_team_xref_guid)
  );

COMMENT on table officer_team_xref_h is 'History table for officer_team_xref table';

COMMENT on column officer_team_xref_h.h_officer_team_xref_guid is 'System generated unique key for officer_team_xref history. This key should never be exposed to users via any system utilizing the tables.';

COMMENT on column officer_team_xref_h.target_row_id is 'The unique key for the officer_team_xref that has been created or modified.';

COMMENT on column officer_team_xref_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT on column officer_team_xref_h.operation_user_id is 'The id of the user that created or modified the data in the officer_team_xref table.  Defaults to the logged in user if not passed in by the application.';

COMMENT on column officer_team_xref_h.operation_executed_at is 'The timestamp when the data in the officer_team_xref table was created or modified.  The timestamp is stored in UTC with no Offset.';

COMMENT on column officer_team_xref_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

CREATE
or REPLACE TRIGGER officer_team_xref_history_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON officer_team_xref FOR EACH ROW EXECUTE PROCEDURE audit_history ('officer_team_xref_h', 'officer_team_xref_guid');