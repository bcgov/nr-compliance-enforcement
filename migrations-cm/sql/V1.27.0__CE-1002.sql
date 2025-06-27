CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--
-- creates new tables to support authroization outcomes
--
--
-- create authorization_permit table
--
create table
  case_management.authorization_permit (
    authorization_permit_guid uuid NULL DEFAULT uuid_generate_v4 (),
    case_file_guid uuid NOT NULL,
    authorization_permit_id varchar(50) NOT NULL,
    active_ind boolean default TRUE,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NULL,
    update_utc_timestamp timestamp NULL,
    constraint "PK_authorization_permit_guid" PRIMARY KEY (authorization_permit_guid)
  );

comment on table case_management.authorization_permit is 'Contains the authroized site id for the Authroization Outcome';

comment on column case_management.authorization_permit.authorization_permit_guid is 'System generated unique key for an authorized_permit record';

comment on column case_management.authorization_permit.case_file_guid is 'System generated unique key for a case.  This key should never be exposed to users via any system utilizing the tables.';

comment on column case_management.authorization_permit.authorization_permit_id is 'The value used for an authorized site id';

comment on column case_management.authorization_permit.active_ind is 'A boolean indicator to determine if the has been soft deleted.';

comment on column case_management.authorization_permit.create_user_id is 'The id of the user that created the authroized site id.';

comment on column case_management.authorization_permit.create_utc_timestamp is 'The timestamp when the authroized site id was created. The timestamp is stored in UTC with no Offset.';

comment on column case_management.authorization_permit.update_user_id is 'The id of the user that updated the authroized site id';

comment on column case_management.authorization_permit.update_utc_timestamp is 'The timestamp when the authroized site id was updated. The timestamp is stored in UTC with no Offset.';

--
-- create authorized_permit_h history table
--
CREATE TABLE
  case_management.authorization_permit_h (
    h_authorization_permit_guid uuid NOT NULL DEFAULT uuid_generate_v4 (),
    target_row_id uuid NOT NULL,
    operation_type char(1) NOT NULL,
    operation_user_id varchar(32) NOT NULL DEFAULT current_user,
    operation_executed_at timestamp NOT NULL DEFAULT now(),
    data_after_executed_operation jsonb,
    CONSTRAINT "PK_h_authorization_permit" PRIMARY KEY (h_authorization_permit_guid)
  );

COMMENT on table case_management.authorization_permit_h is 'History table for authorization_permit table';

COMMENT on column case_management.authorization_permit_h.h_authorization_permit_guid is 'System generated unique key for authorization permit history. This key should never be exposed to users via any system utilizing the tables.';

COMMENT on column case_management.authorization_permit_h.target_row_id is 'The unique key for the authorization permit that has been created or modified.';

COMMENT on column case_management.authorization_permit_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT on column case_management.authorization_permit_h.operation_user_id is 'The id of the user that created or modified the data in the authorization permit table.  Defaults to the logged in user if not passed in by the application.';

COMMENT on column case_management.authorization_permit_h.operation_executed_at is 'The timestamp when the data in the authorization permit table was created or modified.  The timestamp is stored in UTC with no Offset.';

COMMENT on column case_management.authorization_permit_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

--
-- create site table
--
create table
  case_management.site (
    site_guid uuid NULL DEFAULT uuid_generate_v4 (),
    case_file_guid uuid NOT NULL,
    site_id varchar(50) NOT NULL,
    active_ind boolean default TRUE,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NULL,
    update_utc_timestamp timestamp NULL,
    constraint "PK_site_guid" PRIMARY KEY (site_guid)
  );

comment on table case_management.site is 'Contains the unauthorized site id for the Authroization Outcome';

comment on column case_management.site.site_guid is 'System generated unique key for a site record';

comment on column case_management.site.case_file_guid is 'System generated unique key for a case.  This key should never be exposed to users via any system utilizing the tables.';

comment on column case_management.site.site_id is 'The value used for an unauthorized site id';

comment on column case_management.site.active_ind is 'A boolean indicator to determine if the record has been soft deleted.';

comment on column case_management.site.create_user_id is 'The id of the user that created the unauthroized site id.';

comment on column case_management.site.create_utc_timestamp is 'The timestamp when the unauthroized site id was created. The timestamp is stored in UTC with no Offset.';

comment on column case_management.site.update_user_id is 'The id of the user that updated the unauthroized site id';

comment on column case_management.site.update_utc_timestamp is 'The timestamp when the unauthroized site id was updated. The timestamp is stored in UTC with no Offset.';

--
-- create site_h history table
--
CREATE TABLE
  case_management.site_h (
    h_site_guid uuid NOT NULL DEFAULT uuid_generate_v4 (),
    target_row_id uuid NOT NULL,
    operation_type char(1) NOT NULL,
    operation_user_id varchar(32) NOT NULL DEFAULT current_user,
    operation_executed_at timestamp NOT NULL DEFAULT now(),
    data_after_executed_operation jsonb,
    CONSTRAINT "PK_h_site" PRIMARY KEY (h_site_guid)
  );

COMMENT on table case_management.site_h is 'History table for site table';

COMMENT on column case_management.site_h.h_site_guid is 'System generated unique key for site history. This key should never be exposed to users via any system utilizing the tables.';

COMMENT on column case_management.site_h.target_row_id is 'The unique key for the site that has been created or modified.';

COMMENT on column case_management.site_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT on column case_management.site_h.operation_user_id is 'The id of the user that created or modified the data in the site table.  Defaults to the logged in user if not passed in by the application.';

COMMENT on column case_management.site_h.operation_executed_at is 'The timestamp when the data in the site table was created or modified.  The timestamp is stored in UTC with no Offset.';

COMMENT on column case_management.site_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

--
-- add history triggers to authorization_permit and site tables
--
CREATE
OR REPLACE TRIGGER auth_permit_history_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON case_management.authorization_permit FOR EACH ROW
EXECUTE PROCEDURE audit_history (
  'authorization_permit_h',
  'authorization_permit_guid'
);

CREATE
OR REPLACE TRIGGER site_history_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON case_management.site FOR EACH ROW
EXECUTE PROCEDURE audit_history ('site_h', 'site_guid');

--
-- add foreign keys to case_file table
--
ALTER TABLE case_management.authorization_permit
ADD CONSTRAINT FK_authorization_permit__case_file_guid FOREIGN KEY (case_file_guid) REFERENCES case_management.case_file (case_file_guid);

ALTER TABLE case_management.site
ADD CONSTRAINT FK_site__case_file_guid FOREIGN KEY (case_file_guid) REFERENCES case_management.case_file (case_file_guid);