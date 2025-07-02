CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

--
-- CREATE TABLE equipment
--
CREATE TABLE
  case_management.equipment (
    equipment_guid	uuid,
    equipment_code	varchar(10),
    equipment_location_desc	varchar(120),
    equipment_geometry_point	geometry,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_equipment_guid" PRIMARY KEY (equipment_guid)
  );

-- case_management.equipment foreign keys
ALTER TABLE case_management.equipment ADD CONSTRAINT FK_equipment__equipment_code FOREIGN KEY (equipment_code) REFERENCES case_management.equipment_code(equipment_code);

ALTER TABLE action ADD COLUMN equipment_guid uuid;

ALTER TABLE case_management.equipment ALTER COLUMN equipment_guid SET DEFAULT uuid_generate_v4();

ALTER TABLE case_management.action ADD CONSTRAINT FK_action__equipment_guid FOREIGN KEY (equipment_guid) REFERENCES case_management.equipment(equipment_guid);

comment on table case_management.equipment is 'Represents a piece of physical equipment that has been deployed in support of the case.   Contains information about where and when the equipment was deployed.';
comment on column case_management.equipment.equipment_guid is 'System generated unique key for a piece of equipment.  This key should never be exposed to users via any system utilizing the tables.';
comment on column case_management.equipment.equipment_code is 'A human readable code used to identify a piece of equipment';
comment on column case_management.equipment.equipment_location_desc is 'Free form text describing the location of the equipment.   Usually (but not always) an address.';
comment on column case_management.equipment.equipment_geometry_point is 'The closest approximation to where the equipment is deployed.   Stored as a geometric point using the EPSG:3005 Projected Coordinate System (BC Albers)';
comment on column case_management.equipment.active_ind is 'A boolean indicator to determine if the equipment record is active and should be displayed in the application.';
comment on column case_management.equipment.create_user_id is 'The id of the user that created the equipment record.';
comment on column case_management.equipment.create_utc_timestamp is 'The timestamp when the equipment record was created.  The timestamp is stored in UTC with no Offset.';
comment on column case_management.equipment.update_user_id is 'The id of the user that updated the equipment record.';
comment on column case_management.equipment.update_utc_timestamp is 'The timestamp when the equipment record was updated.  The timestamp is stored in UTC with no Offset.';
comment on column case_management.action.equipment_guid is 'System generated unique key for a piece of equipment.  This key should never be exposed to users via any system utilizing the tables.';