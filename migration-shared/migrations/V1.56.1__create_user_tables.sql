-- ============================================================================
-- APP_USER and APP_USER_H
-- ============================================================================
CREATE TABLE
  app_user (
    app_user_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    auth_user_guid uuid UNIQUE,
    user_id character varying(32),
    first_name character varying(32),
    last_name character varying(32),
    coms_enrolled_ind boolean DEFAULT false,
    deactivate_ind boolean DEFAULT false,
    agency_code_ref character varying(6),
    office_guid uuid,
    park_area_guid uuid,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL
  );

COMMENT ON TABLE app_user IS 'A user table for the NatSuite system with user details and other meta';

COMMENT ON COLUMN app_user.app_user_guid IS 'System generated unique key for a user. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN app_user.auth_user_guid IS 'The SiteMinder guid returned to the application from KeyCloak. Used to uniquely identify a user over the course of their lifecycle.';

COMMENT ON COLUMN app_user.user_id IS 'The IDIR ID issued to the user by the Government of British Columbia as part of their employment. Null for non-officers.';

COMMENT ON COLUMN app_user.first_name IS 'The first name of the user.';

COMMENT ON COLUMN app_user.last_name IS 'The last name of the user.';

COMMENT ON COLUMN app_user.coms_enrolled_ind IS 'A boolean indicator representing if a user is enrolled in COMS. Applicable for officers only.';

COMMENT ON COLUMN app_user.deactivate_ind IS 'A boolean indicator representing if a user has been deactivated.';

COMMENT ON COLUMN app_user.agency_code_ref IS 'Key representing an agency stored in the agency_code table of the shared schema. The agency that employs the user.';

COMMENT ON COLUMN app_user.office_guid IS 'System generated unique key for an office. The primary office a user is assigned to. Applicable for officers only.';

COMMENT ON COLUMN app_user.park_area_guid IS 'System generated unique key for a park area associated with the user.';

COMMENT ON COLUMN app_user.create_user_id IS 'The id of the user that created this user record.';

COMMENT ON COLUMN app_user.create_utc_timestamp IS 'The timestamp when this user record was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN app_user.update_user_id IS 'The id of the user that updated this user record.';

COMMENT ON COLUMN app_user.update_utc_timestamp IS 'The timestamp when this user record was updated. The timestamp is stored in UTC with no Offset.';

ALTER TABLE app_user ADD CONSTRAINT "PK_app_user" PRIMARY KEY (app_user_guid);

CREATE TABLE
  app_user_h (
    h_app_user_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

COMMENT ON TABLE app_user_h IS 'History table for app_user table';

COMMENT ON COLUMN app_user_h.h_app_user_guid IS 'System generated unique key for user history. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN app_user_h.target_row_id IS 'The unique key for the user that has been created or modified.';

COMMENT ON COLUMN app_user_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT ON COLUMN app_user_h.operation_user_id IS 'The id of the user that created or modified the data in the app_user table. Defaults to the logged in user if not passed in by the application.';

COMMENT ON COLUMN app_user_h.operation_executed_at IS 'The timestamp when the data in the app_user table was created or modified. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN app_user_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully. This implies that the latest row in the audit table will always match with the current row in the live table.';

ALTER TABLE app_user_h ADD CONSTRAINT "PK_h_app_user" PRIMARY KEY (h_app_user_guid);

-- ============================================================================
-- OFFICE and OFFICE_H
-- ============================================================================
CREATE TABLE
  office (
    office_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL,
    geo_organization_unit_code character varying(10),
    agency_code_ref character varying(6)
  );

COMMENT ON TABLE office IS 'An office is a physical location that serves as a central organization point for groups of users of the system.';

COMMENT ON COLUMN office.office_guid IS 'System generated unique key for an office. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN office.geo_organization_unit_code IS 'A human readable unique key that represents a geo organization unit.';

COMMENT ON COLUMN office.agency_code_ref IS 'Key representing an agency stored in the agency_code table of the shared schema.';

COMMENT ON COLUMN office.create_user_id IS 'The id of the user that created the office.';

COMMENT ON COLUMN office.create_utc_timestamp IS 'The timestamp when the office was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN office.update_user_id IS 'The id of the user that updated the office.';

COMMENT ON COLUMN office.update_utc_timestamp IS 'The timestamp when the office was updated. The timestamp is stored in UTC with no Offset.';

ALTER TABLE office ADD CONSTRAINT "PK_office" PRIMARY KEY (office_guid);

CREATE TABLE
  office_h (
    h_office_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

COMMENT ON TABLE office_h IS 'History table for office table';

COMMENT ON COLUMN office_h.h_office_guid IS 'System generated unique key for office history. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN office_h.target_row_id IS 'The unique key for the office that has been created or modified.';

COMMENT ON COLUMN office_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT ON COLUMN office_h.operation_user_id IS 'The id of the user that created or modified the data in the office table. Defaults to the logged in user if not passed in by the application.';

COMMENT ON COLUMN office_h.operation_executed_at IS 'The timestamp when the data in the office table was created or modified. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN office_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully. This implies that the latest row in the audit table will always match with the current row in the live table.';

ALTER TABLE office_h ADD CONSTRAINT "PK_h_office" PRIMARY KEY (h_office_guid);

-- ============================================================================
-- TEAM, TEAM_CODE, and TEAM_H
-- ============================================================================
CREATE TABLE
  team_code (
    team_code character varying(10) NOT NULL,
    short_description character varying(50) NOT NULL,
    long_description character varying(250),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL
  );

COMMENT ON TABLE team_code IS 'Contains code values for team types.';

COMMENT ON COLUMN team_code.team_code IS 'A human readable unique key representing a team type.';

COMMENT ON COLUMN team_code.short_description IS 'The display label for a team type.';

COMMENT ON COLUMN team_code.long_description IS 'A detailed description for a team type.';

COMMENT ON COLUMN team_code.display_order IS 'The default order in which team types are displayed.';

COMMENT ON COLUMN team_code.active_ind IS 'A boolean indicator representing if a team type is active.';

COMMENT ON COLUMN team_code.create_user_id IS 'The id of the user that created the team type.';

COMMENT ON COLUMN team_code.create_utc_timestamp IS 'The timestamp when the team type was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN team_code.update_user_id IS 'The id of the user that updated the team type.';

COMMENT ON COLUMN team_code.update_utc_timestamp IS 'The timestamp when the team type was updated. The timestamp is stored in UTC with no Offset.';

ALTER TABLE team_code ADD CONSTRAINT "PK_teamcode" PRIMARY KEY (team_code);

CREATE TABLE
  team (
    team_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    team_code character varying(15) NOT NULL,
    agency_code_ref character varying(6) NOT NULL,
    active_ind boolean DEFAULT true NOT NULL,
    create_user_id character varying(32),
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone NOT NULL
  );

COMMENT ON TABLE team IS 'Contains information about teams within the system.';

COMMENT ON COLUMN team.team_guid IS 'System generated unique key for a team. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN team.team_code IS 'A human readable unique key representing a team type.';

COMMENT ON COLUMN team.agency_code_ref IS 'Key representing an agency stored in the agency_code table of the shared schema.';

COMMENT ON COLUMN team.active_ind IS 'A boolean indicator representing if a team is active.';

COMMENT ON COLUMN team.create_user_id IS 'The id of the user that created the team.';

COMMENT ON COLUMN team.create_utc_timestamp IS 'The timestamp when the team was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN team.update_user_id IS 'The id of the user that updated the team.';

COMMENT ON COLUMN team.update_utc_timestamp IS 'The timestamp when the team was updated. The timestamp is stored in UTC with no Offset.';

ALTER TABLE team ADD CONSTRAINT team_pk PRIMARY KEY (team_guid);

ALTER TABLE team ADD CONSTRAINT team_un UNIQUE (team_code, agency_code_ref);

CREATE TABLE
  team_h (
    h_team_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

COMMENT ON TABLE team_h IS 'History table for team table';

COMMENT ON COLUMN team_h.h_team_guid IS 'System generated unique key for team history. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN team_h.target_row_id IS 'The unique key for the team that has been created or modified.';

COMMENT ON COLUMN team_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT ON COLUMN team_h.operation_user_id IS 'The id of the user that created or modified the data in the team table. Defaults to the logged in user if not passed in by the application.';

COMMENT ON COLUMN team_h.operation_executed_at IS 'The timestamp when the data in the team table was created or modified. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN team_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully. This implies that the latest row in the audit table will always match with the current row in the live table.';

ALTER TABLE team_h ADD CONSTRAINT "PK_h_team" PRIMARY KEY (h_team_guid);

-- ============================================================================
-- APP_USER_TEAM_XREF and APP_USER_TEAM_XREF_H
-- ============================================================================
CREATE TABLE
  app_user_team_xref (
    app_user_team_xref_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    app_user_guid uuid NOT NULL,
    team_guid uuid NOT NULL,
    active_ind boolean NOT NULL,
    create_user_id character varying(32),
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone NOT NULL
  );

COMMENT ON TABLE app_user_team_xref IS 'Defines the teams a user may be on';

COMMENT ON COLUMN app_user_team_xref.app_user_team_xref_guid IS 'System generated unique key for a user team cross-reference. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN app_user_team_xref.app_user_guid IS 'System generated unique key for a user.';

COMMENT ON COLUMN app_user_team_xref.team_guid IS 'System generated unique key for a team.';

COMMENT ON COLUMN app_user_team_xref.active_ind IS 'Indicates if the user is currently active on the team.';

COMMENT ON COLUMN app_user_team_xref.create_user_id IS 'The id of the user that created this record.';

COMMENT ON COLUMN app_user_team_xref.create_utc_timestamp IS 'The timestamp when this record was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN app_user_team_xref.update_user_id IS 'The id of the user that updated this record.';

COMMENT ON COLUMN app_user_team_xref.update_utc_timestamp IS 'The timestamp when this record was updated. The timestamp is stored in UTC with no Offset.';

ALTER TABLE app_user_team_xref ADD CONSTRAINT app_user_team_xref_pk PRIMARY KEY (app_user_team_xref_guid);

CREATE TABLE
  app_user_team_xref_h (
    h_app_user_team_xref_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

COMMENT ON TABLE app_user_team_xref_h IS 'History table for app_user_team_xref table';

COMMENT ON COLUMN app_user_team_xref_h.h_app_user_team_xref_guid IS 'System generated unique key for user team cross-reference history. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN app_user_team_xref_h.target_row_id IS 'The unique key for the user team cross-reference that has been created or modified.';

COMMENT ON COLUMN app_user_team_xref_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT ON COLUMN app_user_team_xref_h.operation_user_id IS 'The id of the user that created or modified the data in the app_user_team_xref table. Defaults to the logged in user if not passed in by the application.';

COMMENT ON COLUMN app_user_team_xref_h.operation_executed_at IS 'The timestamp when the data in the app_user_team_xref table was created or modified. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN app_user_team_xref_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully. This implies that the latest row in the audit table will always match with the current row in the live table.';

ALTER TABLE app_user_team_xref_h ADD CONSTRAINT "PK_h_app_user_team_xref" PRIMARY KEY (h_app_user_team_xref_guid);

-- ============================================================================
-- GEO ORGANIZATION UNIT TABLES
-- ============================================================================
CREATE TABLE
  geo_org_unit_type_code (
    geo_org_unit_type_code character varying(10) NOT NULL,
    short_description character varying(50) NOT NULL,
    long_description character varying(250),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL
  );

COMMENT ON TABLE geo_org_unit_type_code IS 'Contains the code values for the various types of geographical organizational units.';

COMMENT ON COLUMN geo_org_unit_type_code.geo_org_unit_type_code IS 'A human readable unique key representing the type of geographical organizational unit.';

COMMENT ON COLUMN geo_org_unit_type_code.short_description IS 'The display label for the geographical organization unit type code.';

COMMENT ON COLUMN geo_org_unit_type_code.long_description IS 'A detailed description for the geographical organization unit type code.';

COMMENT ON COLUMN geo_org_unit_type_code.display_order IS 'The order in which these geographical organization unit types are displayed when presented to users.';

COMMENT ON COLUMN geo_org_unit_type_code.active_ind IS 'A boolean indicator representing if the geographical organization unit type code is currently active for use.';

COMMENT ON COLUMN geo_org_unit_type_code.create_user_id IS 'The id of the user that created the geographical organization unit type code.';

COMMENT ON COLUMN geo_org_unit_type_code.create_utc_timestamp IS 'The timestamp when the geographical organization unit type code was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN geo_org_unit_type_code.update_user_id IS 'The id of the user that updated the geographical organization unit type code.';

COMMENT ON COLUMN geo_org_unit_type_code.update_utc_timestamp IS 'The timestamp when the geographical organization unit type code was updated. The timestamp is stored in UTC with no Offset.';

ALTER TABLE geo_org_unit_type_code ADD CONSTRAINT "PK_geoorguttypcd" PRIMARY KEY (geo_org_unit_type_code);

CREATE TABLE
  geo_organization_unit_code (
    geo_organization_unit_code character varying(10) NOT NULL,
    short_description character varying(50),
    long_description character varying(250),
    effective_date timestamp without time zone NOT NULL,
    expiry_date timestamp without time zone,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL,
    geo_org_unit_type_code character varying(10),
    administrative_office_ind boolean DEFAULT false NOT NULL
  );

COMMENT ON TABLE geo_organization_unit_code IS 'Contains the code values for the various geographical organizational units.';

COMMENT ON COLUMN geo_organization_unit_code.geo_organization_unit_code IS 'A human readable unique key that represents a geo organization unit.';

COMMENT ON COLUMN geo_organization_unit_code.short_description IS 'The display label for the geographical organization unit code.';

COMMENT ON COLUMN geo_organization_unit_code.long_description IS 'A detailed description for the geographical organization unit code.';

COMMENT ON COLUMN geo_organization_unit_code.effective_date IS 'The date and time the geographical organization unit code became valid. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN geo_organization_unit_code.expiry_date IS 'The date and time the geographical organization unit code is no longer valid. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN geo_organization_unit_code.geo_org_unit_type_code IS 'A human readable unique key representing the type of geographical organizational unit.';

COMMENT ON COLUMN geo_organization_unit_code.administrative_office_ind IS 'A boolean indicator representing if the geographical organizational unit is an administrative office.';

COMMENT ON COLUMN geo_organization_unit_code.create_user_id IS 'The id of the user that created the geographical organization unit code.';

COMMENT ON COLUMN geo_organization_unit_code.create_utc_timestamp IS 'The timestamp when the geographical organization unit code was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN geo_organization_unit_code.update_user_id IS 'The id of the user that updated the geographical organization unit code.';

COMMENT ON COLUMN geo_organization_unit_code.update_utc_timestamp IS 'The timestamp when the geographical organization unit code was updated. The timestamp is stored in UTC with no Offset.';

ALTER TABLE geo_organization_unit_code ADD CONSTRAINT "PK_geoorgutnd" PRIMARY KEY (geo_organization_unit_code);

CREATE TABLE
  geo_org_unit_structure (
    geo_org_unit_structure_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    effective_date timestamp without time zone NOT NULL,
    expiry_date timestamp without time zone,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL,
    agency_code_ref character varying(10),
    parent_geo_org_unit_code character varying(10),
    child_geo_org_unit_code character varying(10)
  );

COMMENT ON TABLE geo_org_unit_structure IS 'Defines the hierarchical relationships between various geographical organizational unit codes.';

COMMENT ON COLUMN geo_org_unit_structure.geo_org_unit_structure_guid IS 'System generated unique key for the geographical organizational unit structure. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN geo_org_unit_structure.effective_date IS 'The date and time the geographical organizational unit structure became valid. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN geo_org_unit_structure.expiry_date IS 'The date and time the geographical organizational unit structure is no longer valid. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN geo_org_unit_structure.agency_code_ref IS 'Key representing an agency stored in the agency_code table of the shared schema.';

COMMENT ON COLUMN geo_org_unit_structure.parent_geo_org_unit_code IS 'The geographical organization unit code that is the parent in the hierarchy.';

COMMENT ON COLUMN geo_org_unit_structure.child_geo_org_unit_code IS 'The geographical organization unit code that is the child in the hierarchy.';

COMMENT ON COLUMN geo_org_unit_structure.create_user_id IS 'The id of the user that created the geographical organizational unit structure.';

COMMENT ON COLUMN geo_org_unit_structure.create_utc_timestamp IS 'The timestamp when the geographical organizational unit structure was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN geo_org_unit_structure.update_user_id IS 'The id of the user that updated the geographical organizational unit structure.';

COMMENT ON COLUMN geo_org_unit_structure.update_utc_timestamp IS 'The timestamp when the geographical organizational unit structure was updated. The timestamp is stored in UTC with no Offset.';

ALTER TABLE geo_org_unit_structure ADD CONSTRAINT "PK_gorgustrct" PRIMARY KEY (geo_org_unit_structure_guid);

CREATE TABLE
  geo_org_unit_structure_h (
    h_gorgustrct_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

COMMENT ON TABLE geo_org_unit_structure_h IS 'History table for geo_org_unit_structure table';

COMMENT ON COLUMN geo_org_unit_structure_h.h_gorgustrct_guid IS 'System generated unique key for geographical organizational unit structure history. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN geo_org_unit_structure_h.target_row_id IS 'The unique key for the geographical organizational unit structure that has been created or modified.';

COMMENT ON COLUMN geo_org_unit_structure_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT ON COLUMN geo_org_unit_structure_h.operation_user_id IS 'The id of the user that created or modified the data in the geo_org_unit_structure table. Defaults to the logged in user if not passed in by the application.';

COMMENT ON COLUMN geo_org_unit_structure_h.operation_executed_at IS 'The timestamp when the data in the geo_org_unit_structure table was created or modified. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN geo_org_unit_structure_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully. This implies that the latest row in the audit table will always match with the current row in the live table.';

ALTER TABLE geo_org_unit_structure_h ADD CONSTRAINT "PK_h_gorgustrct" PRIMARY KEY (h_gorgustrct_guid);

-- ============================================================================
-- FOREIGN KEYS
-- ============================================================================
ALTER TABLE team ADD CONSTRAINT team_team_code_fk FOREIGN KEY (team_code) REFERENCES team_code (team_code);

ALTER TABLE team ADD CONSTRAINT team_agency_code_fk FOREIGN KEY (agency_code_ref) REFERENCES agency_code (agency_code);

ALTER TABLE app_user_team_xref ADD CONSTRAINT app_user_team_xref_user_fk FOREIGN KEY (app_user_guid) REFERENCES app_user (app_user_guid);

ALTER TABLE app_user_team_xref ADD CONSTRAINT app_user_team_xref_team_fk FOREIGN KEY (team_guid) REFERENCES team (team_guid);

ALTER TABLE app_user ADD CONSTRAINT app_user_office_fk FOREIGN KEY (office_guid) REFERENCES office (office_guid);

ALTER TABLE app_user ADD CONSTRAINT app_user_agency_code_fk FOREIGN KEY (agency_code_ref) REFERENCES agency_code (agency_code);

ALTER TABLE office ADD CONSTRAINT office_geo_org_unit_fk FOREIGN KEY (geo_organization_unit_code) REFERENCES geo_organization_unit_code (geo_organization_unit_code);

ALTER TABLE office ADD CONSTRAINT office_agency_code_fk FOREIGN KEY (agency_code_ref) REFERENCES agency_code (agency_code);

ALTER TABLE geo_organization_unit_code ADD CONSTRAINT geo_org_unit_type_fk FOREIGN KEY (geo_org_unit_type_code) REFERENCES geo_org_unit_type_code (geo_org_unit_type_code);

ALTER TABLE geo_org_unit_structure ADD CONSTRAINT geo_org_structure_parent_fk FOREIGN KEY (parent_geo_org_unit_code) REFERENCES geo_organization_unit_code (geo_organization_unit_code);

ALTER TABLE geo_org_unit_structure ADD CONSTRAINT geo_org_structure_child_fk FOREIGN KEY (child_geo_org_unit_code) REFERENCES geo_organization_unit_code (geo_organization_unit_code);

ALTER TABLE geo_org_unit_structure ADD CONSTRAINT geo_org_structure_agency_fk FOREIGN KEY (agency_code_ref) REFERENCES agency_code (agency_code);

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER app_user_history_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON app_user FOR EACH ROW EXECUTE FUNCTION audit_history ('app_user_h', 'app_user_guid');

CREATE TRIGGER office_history_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON office FOR EACH ROW EXECUTE FUNCTION audit_history ('office_h', 'office_guid');

CREATE TRIGGER team_history_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON team FOR EACH ROW EXECUTE FUNCTION audit_history ('team_h', 'team_guid');

CREATE TRIGGER app_user_team_xref_history_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON app_user_team_xref FOR EACH ROW EXECUTE FUNCTION audit_history ('app_user_team_xref_h', 'app_user_team_xref_guid');

CREATE TRIGGER geo_org_unit_structure_history_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON geo_org_unit_structure FOR EACH ROW EXECUTE FUNCTION audit_history (
  'geo_org_unit_structure_h',
  'geo_org_unit_structure_guid'
);

CREATE TRIGGER geo_org_unit_type_code_update_trigger BEFORE
UPDATE ON geo_org_unit_type_code FOR EACH ROW EXECUTE FUNCTION update_audit_columns ();

CREATE TRIGGER geo_organization_unit_code_update_trigger BEFORE
UPDATE ON geo_organization_unit_code FOR EACH ROW EXECUTE FUNCTION update_audit_columns ();

CREATE TRIGGER team_code_update_trigger BEFORE
UPDATE ON team_code FOR EACH ROW EXECUTE FUNCTION update_audit_columns ();

CREATE TRIGGER team_update_trigger BEFORE
UPDATE ON team FOR EACH ROW EXECUTE FUNCTION update_audit_columns ();