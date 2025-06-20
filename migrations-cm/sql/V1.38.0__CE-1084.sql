-- Create new table for IPM Authorization Category
CREATE TABLE IF NOT EXISTS case_management.ipm_auth_category_code (
    ipm_auth_category_code varchar(10) NOT NULL,
    short_description varchar(50) NULL,
    long_description varchar(250) NULL,
    display_order int4 NULL,
    active_ind bool NULL default 'Y',
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NULL,
    update_utc_timestamp timestamp NULL,
    constraint "PK_ipm_auth_category_code" PRIMARY KEY (ipm_auth_category_code)
);

comment on table case_management.ipm_auth_category_code is 'Contains the list of IPM authorization categories a user can select to indicate the context in which a party is authorized to use pesticides.';
comment on column case_management.ipm_auth_category_code.ipm_auth_category_code is 'A human readable code used to identify a IPM authorization category.';
comment on column case_management.ipm_auth_category_code.short_description is 'The short description of the IPM authorization category where the case was taken.';
comment on column case_management.ipm_auth_category_code.long_description is 'The long description of the IPM authorization category where the case was taken.';
comment on column case_management.ipm_auth_category_code.display_order is 'The order in which the values of the IPM authorization category should be displayed when presented to a user in a list.';
comment on column case_management.ipm_auth_category_code.active_ind is 'A boolean indicator to determine if the IPM authorization category is active.';
comment on column case_management.ipm_auth_category_code.create_user_id is 'The id of the user that created the IPM authorization category.';
comment on column case_management.ipm_auth_category_code.create_utc_timestamp is 'The timestamp when the IPM authorization category was created. The timestamp is stored in UTC with no Offset.';
comment on column case_management.ipm_auth_category_code.update_user_id is 'The id of the user that updated the IPM authorization category.';
comment on column case_management.ipm_auth_category_code.update_utc_timestamp is 'The timestamp when the IPM authorization category was updated. The timestamp is stored in UTC with no Offset.';
comment on table case_management.schedule_code is 'Contains the list of values for indicating the waste schedule or pesticide sector an incident falls under.';
comment on table case_management.sector_code is 'Contains the list of values to further categorizes an incident by providing context (industry, methods of handling, etc.) for the kind of waste involved.';

-- ADD Foreign Key onto decision table
ALTER TABLE case_management.decision 
ADD ipm_auth_category_code varchar(10);

ALTER TABLE case_management.decision 
ADD CONSTRAINT FK_decision__ipm_auth_category_code FOREIGN KEY (ipm_auth_category_code) REFERENCES case_management.ipm_auth_category_code (ipm_auth_category_code);




