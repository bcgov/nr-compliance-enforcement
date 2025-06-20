-- Feature Code table --
CREATE TABLE
  feature_code (
    feature_code varchar(10) NOT NULL,
    short_description varchar(50) NOT NULL,
    long_description varchar(250) NULL,
    display_order int4 NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_featurecd" PRIMARY KEY (feature_code)
  );

-- Comments for Feature Code table
comment on table feature_code is 'A list of FEATUREs that can be enabled or disabled on a per agency basis.';

comment on column feature_code.feature_code is 'A human readable code used to identify a FEATURE that is controlled by the FEATURE_AGENCY_XREF table.';

comment on column feature_code.short_description is 'The short description of the FEATURE controlled by the flag.';

comment on column feature_code.long_description is 'The long description of the FEATURE controlled by the flag.';

comment on column feature_code.display_order is 'The order in which the values of  the FEATUREs should be displayed when presented to a user in a list.';

comment on column feature_code.active_ind is 'A boolean indicator to determine if the FEATURE is active.';

comment on column feature_code.create_user_id is 'The id of the user that created the FEATURE.';

comment on column feature_code.create_utc_timestamp is 'The timestamp when the FEATURE was created.  The timestamp is stored in UTC with no Offset.';

comment on column feature_code.update_user_id is 'The id of the user that updated the FEATURE';

comment on column feature_code.update_utc_timestamp is 'The timestamp when the FEATURE was updated.  The timestamp is stored in UTC with no Offset.';

-- Feature / Agency XREF table --
CREATE TABLE
  feature_agency_xref (
    feature_agency_xref_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    feature_code varchar(10) NOT NULL,
    agency_code varchar(10) NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_featagcyxr" PRIMARY KEY (feature_agency_xref_guid),
    CONSTRAINT "FK_featurecd" FOREIGN KEY (feature_code) REFERENCES feature_code (feature_code),
    CONSTRAINT "FK_agencycode" FOREIGN KEY (agency_code) REFERENCES agency_code (agency_code)
  );

-- Comments for Feature / Agency XREF table
comment on table feature_agency_xref is 'Maintains a mapping between FEATURES and AGENCIES that allow for features to be displayed or hidden as required.';

comment on column feature_agency_xref.feature_agency_xref_guid is 'System generated unique key for a FEATURE_AGENCY_XREF ecord.  This key should never be exposed to users via any system utilizing the tables.';

comment on column feature_agency_xref.feature_code is 'A human readable code used to identify a FEATURE that is controlled by the FEATURE_AGENCY_XREF table.';

comment on column feature_agency_xref.agency_code is 'A human readable code used to identify an AGENCY.';

comment on column feature_agency_xref.active_ind is 'A boolean indicator to determine if the FEATURE should be rendered the for users in the given AGENCY';

comment on column feature_agency_xref.create_user_id is 'The id of the user that created the FEATURE / AGENCY mapping.';

comment on column feature_agency_xref.create_utc_timestamp is 'The timestamp when the FEATURE / AGENCY mapping was created.  The timestamp is stored in UTC with no Offset.';

comment on column feature_agency_xref.update_user_id is 'The id of the user that updated the FEATURE / AGENCY mapping';

comment on column feature_agency_xref.update_utc_timestamp is 'The timestamp when the FEATURE / AGENCY mapping was updated.  The timestamp is stored in UTC with no Offset.';