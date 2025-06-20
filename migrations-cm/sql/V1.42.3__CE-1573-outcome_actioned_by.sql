--
-- This migration introduces the hwcr_outcome_actioned_by_code which is used to
-- indicate the party that took a specific action in a HWCR outcome. At the time
-- of implementation, these included Euthenized by... and Dispatched by... HWCR
-- outcome codes. Related updates can be found in R__code-table-data.sql under
-- the comment beginning with CE-1573.

--
-- CREATE TABLE hwcr_outcome_code
--
CREATE TABLE
  case_management.hwcr_outcome_actioned_by_code (
    hwcr_outcome_actioned_by_code varchar(10) NOT NULL,
    agency_code varchar(10),
    short_description varchar(50) NOT NULL,
    long_description varchar(250) NULL,
    display_order int4 NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_hwc_outcome_actioned_by_code" PRIMARY KEY (hwcr_outcome_actioned_by_code),
    CONSTRAINT "FK_hwc_outcome_actioned_by__agency_code" FOREIGN KEY (agency_code) REFERENCES case_management.agency_code(agency_code)
  );

comment on table case_management.hwcr_outcome_actioned_by_code is 'Indicates the party responsible for carrying out the action in a HWC outcome.';
comment on column case_management.hwcr_outcome_actioned_by_code.hwcr_outcome_actioned_by_code is 'A human readable code used to identify who carried out an HWCR outcome.';
comment on column case_management.hwcr_outcome_actioned_by_code.agency_code is 'A reference to the agency in this system if the party is a NatCom user such as "COS".';
comment on column case_management.hwcr_outcome_actioned_by_code.short_description is 'The short description of an HWCR outcome actioned by code.';
comment on column case_management.hwcr_outcome_actioned_by_code.long_description is 'The long description of an HWCR outcome actioned by code.';
comment on column case_management.hwcr_outcome_actioned_by_code.display_order is 'The order in which the values of the HWCR outcome actioned by code should be displayed when presented to a user in a list.';
comment on column case_management.hwcr_outcome_actioned_by_code.active_ind is 'A boolean indicator to determine if an HWCR outcome actioned by code is active.';
comment on column case_management.hwcr_outcome_actioned_by_code.create_user_id is 'The id of the user that created the HWCR outcome actioned by code.';
comment on column case_management.hwcr_outcome_actioned_by_code.create_utc_timestamp is 'The timestamp when the HWCR outcome actioned by code was created. The timestamp is stored in UTC with no Offset.';
comment on column case_management.hwcr_outcome_actioned_by_code.update_user_id is 'The id of the user that updated the HWCR outcome actioned by code.';
comment on column case_management.hwcr_outcome_actioned_by_code.update_utc_timestamp is 'The timestamp when the HWCR outcome actioned by code was updated. The timestamp is stored in UTC with no Offset.';

--
-- Alter table Wildlife
-- Add a reference to a hwcr_outcome_actioned_by_code in the wildlife table.
-- Not all HWCR outcomes require users to specify actioned_by, so the column is optional.
--
ALTER TABLE case_management.wildlife
  ADD hwcr_outcome_actioned_by_code varchar(10);

comment on column case_management.wildlife.hwcr_outcome_actioned_by_code is 'A human readable code used to reference an HWCR outcome actioned by code.';

ALTER TABLE case_management.wildlife
  ADD CONSTRAINT FK_wildlife__hwcr_outcome_actioned_by_code
  FOREIGN KEY (hwcr_outcome_actioned_by_code)
  REFERENCES case_management.hwcr_outcome_actioned_by_code (hwcr_outcome_actioned_by_code);
