-- Feature Code table --
CREATE TABLE
  complaint_method_received_code (
    complaint_method_received_code varchar(10) NOT NULL,
    short_description varchar(50) NOT NULL,
    long_description varchar(250) NULL,
    display_order int4 NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_complaint_method_received_code" PRIMARY KEY (complaint_method_received_code)
  );

comment on table complaint_method_received_code is 'Methods in which the complaint was received.  Examples include: DGIR forward, Direct email or phone call,Minister''s office,RAPP ,Referral';

comment on column complaint_method_received_code.complaint_method_received_code is 'A human readable code used to define the method in which the complaint was received';

comment on column complaint_method_received_code.short_description is 'The short description of a METHOD_COMPLAINT_RECEIVED_CODE';

comment on column complaint_method_received_code.long_description is 'The long description of a METHOD_COMPLAINT_RECEIVED_CODE';

comment on column complaint_method_received_code.active_ind is 'A boolean indicator to determine if the METHOD_COMPLAINT_RECEIVED_CODE is active';

comment on column complaint_method_received_code.create_user_id is 'The id of the user that created the wdr schedule code.';

comment on column complaint_method_received_code.create_utc_timestamp is 'The timestamp when the METHOD_COMPLAINT_RECEIVED_CODE was created.  The timestamp is stored in UTC with no Offset.';

comment on column complaint_method_received_code.update_user_id is 'The id of the user that updated the METHOD_COMPLAINT_RECEIVED_CODE.';

comment on column complaint_method_received_code.update_utc_timestamp is 'The timestamp when the METHOD_COMPLAINT_RECEIVED_CODE was updated.  The timestamp is stored in UTC with no Offset.';

-- comp_mthd_recv_cd_agcy_cd_xref definition
-- Drop table
-- DROP TABLE comp_mthd_recv_cd_agcy_cd_xref;
CREATE TABLE
  comp_mthd_recv_cd_agcy_cd_xref (
    comp_mthd_recv_cd_agcy_cd_xref_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    agency_code varchar(10) NOT NULL,
    complaint_method_received_code varchar(10) NOT NULL,
    active_ind bool NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_comp_mthd_recv_cd_agcy_cd_xref" PRIMARY KEY (comp_mthd_recv_cd_agcy_cd_xref_guid),
    CONSTRAINT "UK_comp_mthd_recv_cd_agcy_cd_xref" UNIQUE (agency_code, complaint_method_received_code)
  );

COMMENT ON TABLE comp_mthd_recv_cd_agcy_cd_xref IS 'complaint_method_received_code and AGENCIES that allow for features to be displayed or hidden as required.';

-- Column comments
COMMENT ON COLUMN comp_mthd_recv_cd_agcy_cd_xref.complaint_method_received_code IS 'A human readable code used to identify a complaint_method_received_code that is controlled by the comp_mthd_recv_cd_agcy_cd_xref table.';

COMMENT ON COLUMN comp_mthd_recv_cd_agcy_cd_xref.agency_code IS 'A human readable code used to identify an AGENCY.';

COMMENT ON COLUMN comp_mthd_recv_cd_agcy_cd_xref.active_ind IS 'A boolean indicator to determine if the complaint_method_received_code should be rendered the for users in the given AGENCY';

COMMENT ON COLUMN comp_mthd_recv_cd_agcy_cd_xref.create_user_id IS 'The id of the user that created the complaint_method_received_code / AGENCY mapping.';

COMMENT ON COLUMN comp_mthd_recv_cd_agcy_cd_xref.create_utc_timestamp IS 'The timestamp when the complaint_method_received_code / AGENCY mapping was created.  The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN comp_mthd_recv_cd_agcy_cd_xref.update_user_id IS 'The id of the user that updated the complaint_method_received_code / AGENCY mapping';

COMMENT ON COLUMN comp_mthd_recv_cd_agcy_cd_xref.update_utc_timestamp IS 'The timestamp when the complaint_method_received_code / AGENCY mapping was updated.  The timestamp is stored in UTC with no Offset.';

-- feature_agency_xref foreign keys
ALTER TABLE comp_mthd_recv_cd_agcy_cd_xref ADD CONSTRAINT "FK_comp_mthd_recv_cd_agcy_cd_xref_agencycode" FOREIGN KEY (agency_code) REFERENCES agency_code (agency_code);

ALTER TABLE comp_mthd_recv_cd_agcy_cd_xref ADD CONSTRAINT "FK_comp_mthd_recv_cd_agcy_cd_xref_complaint_method_received_code" FOREIGN KEY (complaint_method_received_code) REFERENCES complaint_method_received_code (complaint_method_received_code);

ALTER TABLE complaint ADD comp_mthd_recv_cd_agcy_cd_xref_guid uuid NULL;

ALTER TABLE complaint ADD CONSTRAINT complaint_comp_mthd_recv_cd_agcy_cd_xref_fk FOREIGN KEY (comp_mthd_recv_cd_agcy_cd_xref_guid) REFERENCES comp_mthd_recv_cd_agcy_cd_xref (comp_mthd_recv_cd_agcy_cd_xref_guid);

comment on column complaint.comp_mthd_recv_cd_agcy_cd_xref_guid is 'Methods in which the complaint was received.  Examples include: DGIR forward, Direct email or phone call,Minister''s office,RAPP ,Referral';