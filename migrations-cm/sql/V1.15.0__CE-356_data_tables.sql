
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--
-- CREATE TABLE action_code
--

create table case_management.action_code (
    action_code varchar(10) NOT NULL,
    short_description varchar(50) NULL,
    long_description varchar(250) NULL,
    active_ind bool NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NULL,
    update_utc_timestamp timestamp NULL,
    constraint "PK_action_code" PRIMARY KEY (action_code)
);

comment on table case_management.action_code is 'Contains a list of all possible actions that can be performed on a case.  ';
comment on column case_management.action_code.action_code is 'A human readable code used to identify a case management action.';
comment on column case_management.action_code.short_description is 'The short description of a case management action.';
comment on column case_management.action_code.long_description is 'The long description of a case management action.';
comment on column case_management.action_code.active_ind is 'A boolean indicator to determine if the case management action is active.';
comment on column case_management.action_code.create_user_id is 'The id of the user that created the case management action.';
comment on column case_management.action_code.create_utc_timestamp is 'The timestamp when the case management action was created.  The timestamp is stored in UTC with no Offset.';
comment on column case_management.action_code.update_user_id is 'The id of the user that updated the case management action.';
comment on column case_management.action_code.update_utc_timestamp is 'The timestamp when the case management action was updated.  The timestamp is stored in UTC with no Offset.';

--
-- CREATE TABLE action_type_code
--

create table case_management.action_type_code (
    action_type_code varchar(10) NOT NULL,
    short_description varchar(50) NULL,
    long_description varchar(250) NULL,
    active_ind bool NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NULL,
    update_utc_timestamp timestamp NULL,
    constraint "PK_action_type_code" PRIMARY KEY (action_type_code)
);

comment on table case_management.action_type_code is 'Case management actions are grouped into logical types. For example COMPASSESS = ''Complaint Assessment''.';	
comment on column case_management.action_type_code.action_type_code is 'A human readable code used to identify a logical grouping of case management actions.';
comment on column case_management.action_type_code.short_description is 'The short description of a logical grouping of case management actions.';
comment on column case_management.action_type_code.long_description is 'The long description of a logical grouping of case management actions.';
comment on column case_management.action_type_code.active_ind is 'A boolean indicator to determine if the logical grouping of case management actions is active.';
comment on column case_management.action_type_code.create_user_id is 'The id of the user that created the action type entry.';
comment on column case_management.action_type_code.create_utc_timestamp is 'The timestamp when the action type entry was created.  The timestamp is stored in UTC with no Offset.';
comment on column case_management.action_type_code.update_user_id is 'The id of the user that updated the action type entry.';
comment on column case_management.action_type_code.update_utc_timestamp is 'The timestamp when the action type entry was updated.  The timestamp is stored in UTC with no Offset.';

--
-- CREATE TABLE action_type_action_xref
--

create table case_management.action_type_action_xref (
    action_type_action_xref_guid uuid NOT NULL DEFAULT uuid_generate_v4(),
    action_type_code varchar(10) NOT NULL,
    action_code	varchar(10) NOT NULL,
    display_order int4 NOT NULL,
    active_ind bool NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NULL,
    update_utc_timestamp timestamp NULL,
    constraint "PK_action_type_action_xref_guid" PRIMARY KEY (action_type_action_xref_guid),
    constraint "FK_action_type_action_xref__action_type_code" FOREIGN KEY (action_type_code) REFERENCES case_management.action_type_code(action_type_code),
    constraint "FK_action_type_action_xref__action_code" FOREIGN KEY (action_code) REFERENCES case_management.action_code(action_code)

);

comment on table case_management.action_type_action_xref is 'Contains the relationship between case management actions and logical types.';	
comment on column case_management.action_type_action_xref.action_type_action_xref_guid is 'System generated unique key for a relationship between case management actions and logical types.  This key should never be exposed to users via any system utilizing the tables.';
comment on column case_management.action_type_action_xref.action_type_code is 'A human readable code used to identify a logical grouping of case management actions.';
comment on column case_management.action_type_action_xref.action_code is 'A human readable code used to identify a case management action.';
comment on column case_management.action_type_action_xref.display_order is 'The order in which the values of the case management actions should be displayed when presented to a user in a list.';
comment on column case_management.action_type_action_xref.active_ind is 'A boolean indicator to determine if the relationship between case management actions and logical types is active.';

--
-- CREATE TABLE agency_code
--

create table case_management.agency_code (
    agency_code varchar(10) NOT NULL,
    short_description varchar(50) NULL,
    long_description varchar(250) NULL,
    active_ind bool NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NULL,
    update_utc_timestamp timestamp NULL,
    constraint "PK_agency_code" PRIMARY KEY (agency_code)
);

comment on table case_management.agency_code is 'Contains a list of all the organizations that have been onboarded onto the Case Management System. This can be used to restrict some content to organization specific values.';	
comment on column case_management.agency_code.agency_code is 'A human readable code used to identify an agency.';
comment on column case_management.agency_code.short_description is 'The short description of the agency code.';
comment on column case_management.agency_code.long_description is 'The long description of the agency code.';
comment on column case_management.agency_code.active_ind is 'A boolean indicator to determine if the agency code is active.';
comment on column case_management.agency_code.create_user_id is 'The id of the user that created the agency code.';
comment on column case_management.agency_code.create_utc_timestamp is 'The timestamp when the agency was created.  The timestamp is stored in UTC with no Offset.';
comment on column case_management.agency_code.update_user_id is 'The id of the user that updated the agency code.';
comment on column case_management.agency_code.update_utc_timestamp is 'The timestamp when the agency was updated.  The timestamp is stored in UTC with no Offset.';

--
-- CREATE TABLE case_code
--

create table case_management.case_code (
    case_code varchar(10) NOT NULL,
    short_description varchar(50) NULL,	
    long_description varchar(250) NULL,	
    active_ind bool NULL,	
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NULL,
    update_utc_timestamp timestamp NULL,
    constraint "PK_case_code" PRIMARY KEY (case_code)
);

comment on table case_management.case_code is 'Contains the list of case types supported by the system.  For example HWCR = "Human Wildlife Conflict"';	
comment on column case_management.case_code.case_code is 'A human readable code used to identify a case type.';
comment on column case_management.case_code.short_description is 'The short description of a case type.';
comment on column case_management.case_code.long_description is 'The long description of a case type.';
comment on column case_management.case_code.active_ind is 'A boolean indicator to determine if the case type is active.';
comment on column case_management.case_code.create_user_id is 'The id of the user that created the case type.';
comment on column case_management.case_code.create_utc_timestamp is 'The timestamp when the case type was created.  The timestamp is stored in UTC with no Offset.';
comment on column case_management.case_code.update_user_id is 'The id of the user that updated the case type.';
comment on column case_management.case_code.update_utc_timestamp is 'The timestamp when the case type was updated.  The timestamp is stored in UTC with no Offset.';

--
-- CREATE TABLE inaction_reason_code
--

create table case_management.inaction_reason_code (
    inaction_reason_code varchar(10) NOT NULL,
    agency_code varchar(10) NOT NULL,
    short_description varchar(50) NULL,
    long_description varchar(250) NULL,
    display_order int4 NULL,
    active_ind bool NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NULL,
    update_utc_timestamp timestamp NULL,
    constraint "PK_inaction_reason_code" PRIMARY KEY (inaction_reason_code),
    constraint "FK_inaction_reason_code__agency_code" FOREIGN KEY (agency_code) REFERENCES case_management.agency_code(agency_code)
);

comment on table case_management.inaction_reason_code is 'Contains the list of available reasons a user can select to indicate that the reason why they did not take any action on a case. Values are Organization specific.';	
comment on column case_management.inaction_reason_code.inaction_reason_code is 'A human readable code used to identify a reason why no action on the case was taken.';
comment on column case_management.inaction_reason_code.agency_code is 'A human readable code used to identify an agency.';
comment on column case_management.inaction_reason_code.short_description is 'The short description of the reason why no action on the case was taken.';
comment on column case_management.inaction_reason_code.long_description is 'The long description of the reason why no action on the case was taken.';
comment on column case_management.inaction_reason_code.display_order is 'The order in which the values of the reasons why no action on the case was taken should be displayed when presented to a user in a list.';
comment on column case_management.inaction_reason_code.active_ind is 'A boolean indicator to determine if the reason why no action on the case was taken is active.';
comment on column case_management.inaction_reason_code.create_user_id is 'The id of the user that created the reason why no action on the case was taken.';
comment on column case_management.inaction_reason_code.create_utc_timestamp is 'The timestamp when the reason why no action on the case was taken was created. The timestamp is stored in UTC with no Offset.';
comment on column case_management.inaction_reason_code.update_user_id is 'The id of the user that updated the reason why no action on the case was taken.';
comment on column case_management.inaction_reason_code.update_utc_timestamp is 'The timestamp when the reason why no action on the case was taken was updated. The timestamp is stored in UTC with no Offset.';

--
-- CREATE TABLE case
--

create table case_management.case_file (
    case_file_guid uuid NULL DEFAULT uuid_generate_v4(),
    case_code varchar(10) NOT NULL,
    owned_by_agency_code varchar(10) NOT NULL,
    inaction_reason_code varchar(10) NULL,
    action_not_required_ind	bool NULL,
    note_text varchar(4000) NULL,
    review_required_ind	bool NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NULL,
    update_utc_timestamp timestamp NULL,
    constraint "PK_case_file_guid" PRIMARY KEY (case_file_guid),
    constraint "FK_case_file__case_code" FOREIGN KEY (case_code) REFERENCES case_management.case_code(case_code),
    constraint "FK_case_file__owned_by_agency_code" FOREIGN KEY (owned_by_agency_code) REFERENCES case_management.agency_code(agency_code),
    constraint "FK_case_file__inaction_reason_code" FOREIGN KEY (inaction_reason_code) REFERENCES case_management.inaction_reason_code(inaction_reason_code)

);

comment on table case_management.case_file is 'The central entity of the case management system.   ';	
comment on column case_management.case_file.case_file_guid is 'System generated unique key for a case.  This key should never be exposed to users via any system utilizing the tables.';
comment on column case_management.case_file.case_code is 'A human readable code used to identify a case type.';
comment on column case_management.case_file.owned_by_agency_code is 'A human readable code used to identify the agency that owns this case.';
comment on column case_management.case_file.inaction_reason_code is 'A human readable code used to identify a reason why no action on the case was taken.';
comment on column case_management.case_file.action_not_required_ind is 'True only if no action required was explicitly indicated for the case.   It is assumed that action is required if not set.  ';
comment on column case_management.case_file.note_text is 'A free-form note that can be edited by collaborators on the case.';
comment on column case_management.case_file.review_required_ind is 'A flag to indicate that a further review of the file by a supervisor is required.';
comment on column case_management.case_file.create_user_id is 'The id of the user that created the case.';
comment on column case_management.case_file.create_utc_timestamp is 'The timestamp when the case was created.  The timestamp is stored in UTC with no Offset.';
comment on column case_management.case_file.update_user_id is 'The id of the user that updated the case.';
comment on column case_management.case_file.update_utc_timestamp is 'The timestamp when the case was updated.  The timestamp is stored in UTC with no Offset.';

--
-- CREATE TABLE action
--

create table case_management.action (
    action_guid uuid NOT NULL DEFAULT uuid_generate_v4(),
    case_guid uuid NOT NULL,
    action_type_action_xref_guid uuid NOT NULL,
    actor_guid uuid NOT NULL,
    action_date timestamp NOT NULL,
    active_ind bool NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NULL,
    update_utc_timestamp timestamp NULL,
    constraint "PK_action_guid" PRIMARY KEY (action_guid),
    constraint "FK_action__case_guid" FOREIGN KEY (case_guid) REFERENCES case_management.case_file(case_file_guid)
);

comment on table case_management.action is 'Represents a concrete action recorded by the case management system.   All actions have an actor and the date/time they occurred.';	
comment on column case_management.action.action_guid is 'System generated unique key for the action.  This key should never be exposed to users via any system utilizing the tables.';
comment on column case_management.action.case_guid is 'System generated unique key for a case.  This key should never be exposed to users via any system utilizing the tables.';
comment on column case_management.action.action_type_action_xref_guid is 'System generated unique key for a relationship between case management actions and logical types.  This key should never be exposed to users via any system utilizing the tables.';
comment on column case_management.action.actor_guid is 'Represents the IDIR guid of the user who performed the action.    ';
comment on column case_management.action.action_date is 'The date the action was recorded.   This value is user entered.';
comment on column case_management.action.active_ind is 'A boolean indicator to determine if the action is active and should be displayed in the application.';
comment on column case_management.action.create_user_id is 'The id of the user that created the case.';
comment on column case_management.action.create_utc_timestamp is 'The timestamp when the case was created.  The timestamp is stored in UTC with no Offset.';
comment on column case_management.action.update_user_id is 'The id of the user that updated the case.';
comment on column case_management.action.update_utc_timestamp is 'The timestamp when the case was updated.  The timestamp is stored in UTC with no Offset.';

--
-- CREATE TABLE lead
--

create table case_management.lead (
    lead_identifier varchar(20) NOT NULL,
    case_identifier uuid NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NULL,
    update_utc_timestamp timestamp NULL,
    constraint "PK_lead_identifier" PRIMARY KEY (lead_identifier),
    constraint "FK_lead__case_identifier" FOREIGN KEY (case_identifier) REFERENCES case_management.case_file(case_file_guid)
);

comment on table case_management.lead is 'A lead is any potential issue that an agency is made aware of. This could be a complaint, referral, etc. A lead needs to be evaluated to determine if it will become a case.';	
comment on column case_management.lead.lead_identifier is 'Natural key for a complaint generated by an external system.  ';
comment on column case_management.lead.case_identifier is 'System generated unique key for a case.  This key should never be exposed to users via any system utilizing the tables.';
comment on column case_management.lead.create_user_id is 'The id of the user that created the complaint/case relationship.';
comment on column case_management.lead.create_utc_timestamp is 'The timestamp when the complaint/case relationship was created.  The timestamp is stored in UTC with no Offset.';
comment on column case_management.lead.update_user_id is 'The id of the user that updated the  complaint/case relationship.';
comment on column case_management.lead.update_utc_timestamp is 'The timestamp when the complaint/case relationship was updated.  The timestamp is stored in UTC with no Offset.';