-- Create new table for equipment status filter
CREATE TABLE
    IF NOT EXISTS case_management.equipment_status_code (
        equipment_status_code varchar(10) NOT NULL,
        short_description varchar(50) NULL,
        long_description varchar(250) NULL,
        display_order int4 NULL,
        active_ind bool NULL default 'Y',
        create_user_id varchar(32) NOT NULL,
        create_utc_timestamp timestamp NOT NULL,
        update_user_id varchar(32) NULL,
        update_utc_timestamp timestamp NULL,
        constraint "PK_equipment_status_code" PRIMARY KEY (equipment_status_code)
    );

comment on table case_management.equipment_status_code is 'Contains the list of equipment status a user can select for filtering.';

comment on column case_management.equipment_status_code.equipment_status_code is 'A human readable code used to identify an equipment status.';

comment on column case_management.equipment_status_code.short_description is 'The short description of an equipment status.';

comment on column case_management.equipment_status_code.long_description is 'The long description of an equipment status.';

comment on column case_management.equipment_status_code.display_order is 'The order in which the values of the equipment status should be displayed when presented to a user in a list.';

comment on column case_management.equipment_status_code.active_ind is 'A boolean indicator to determine if the equipment status option is active.';

comment on column case_management.equipment_status_code.create_user_id is 'The id of the user that created the equipment status.';

comment on column case_management.equipment_status_code.create_utc_timestamp is 'The timestamp when the equipment status was created. The timestamp is stored in UTC with no Offset.';

comment on column case_management.equipment_status_code.update_user_id is 'The id of the user that updated the equipment status.';

comment on column case_management.equipment_status_code.update_utc_timestamp is 'The timestamp when the equipment status was updated. The timestamp is stored in UTC with no Offset.';

GRANT ALL ON case_management.equipment_status_code TO case_management;