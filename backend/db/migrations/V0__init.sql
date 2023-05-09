CREATE SCHEMA IF NOT EXISTS ceds;
CREATE EXTENSION postgis with schema ceds;
-- ceds.agency_code definition

-- Drop table
-- DROP TABLE ceds.agency_code;

CREATE TABLE ceds.agency_code (
	agency_code varchar NOT NULL,
	short_description varchar NOT NULL,
	long_description varchar NULL,
	display_order int4 NOT NULL,
	active_ind bool NOT NULL,
	create_user_id varchar NOT NULL,
	create_user_guid varchar NOT NULL,
	create_timestamp timestamp NOT NULL,
	update_user_id varchar NOT NULL,
	update_user_guid varchar NOT NULL,
	update_timestamp timestamp NOT NULL,
	CONSTRAINT "PK_478945fb4f3b754f1e5dccc3f34" PRIMARY KEY (agency_code)
);


-- ceds.complaint_status_code definition

-- Drop table

-- DROP TABLE ceds.complaint_status_code;

CREATE TABLE ceds.complaint_status_code (
	complaint_status_code varchar NOT NULL,
	short_description varchar NOT NULL,
	long_description varchar NULL,
	display_order int4 NOT NULL,
	active_ind bool NOT NULL,
	create_user_id varchar NOT NULL,
	create_user_guid varchar NOT NULL,
	create_timestamp timestamp NOT NULL,
	update_user_id varchar NOT NULL,
	update_user_guid varchar NOT NULL,
	update_timestamp timestamp NOT NULL,
	CONSTRAINT "PK_661c4fa1830ed8d75c7092e9a80" PRIMARY KEY (complaint_status_code)
);


-- ceds.geo_org_unit_type_code definition

-- Drop table

-- DROP TABLE ceds.geo_org_unit_type_code;

CREATE TABLE ceds.geo_org_unit_type_code (
	geo_org_unit_type_code varchar NOT NULL,
	short_description varchar NOT NULL,
	long_description varchar NULL,
	display_order int4 NOT NULL,
	active_ind bool NOT NULL,
	create_user_id varchar NOT NULL,
	create_user_guid varchar NOT NULL,
	create_timestamp timestamp NOT NULL,
	update_user_id varchar NOT NULL,
	update_user_guid varchar NOT NULL,
	update_timestamp timestamp NOT NULL,
	CONSTRAINT "PK_1286498f2aec8be1877eee5850a" PRIMARY KEY (geo_org_unit_type_code)
);


-- ceds.violation_code definition

-- Drop table

-- DROP TABLE ceds.violation_code;

CREATE TABLE ceds.violation_code (
	violation_code varchar NOT NULL,
	short_description varchar NOT NULL,
	long_description varchar NULL,
	display_order int4 NOT NULL,
	active_ind bool NOT NULL,
	legacy_code varchar NULL,
	create_user_id varchar NOT NULL,
	create_user_guid varchar NOT NULL,
	create_timestamp timestamp NOT NULL,
	update_user_id varchar NOT NULL,
	update_user_guid varchar NOT NULL,
	update_timestamp timestamp NOT NULL,
	CONSTRAINT "PK_300d986eb9a47d3a01a1a59d379" PRIMARY KEY (violation_code)
);


-- ceds.geo_organization_unit_code definition

-- Drop table

-- DROP TABLE ceds.geo_organization_unit_code;

CREATE TABLE ceds.geo_organization_unit_code (
	geo_organization_unit_code varchar NOT NULL,
	short_description varchar NULL,
	long_description varchar NULL,
	legacy_code varchar NULL,
	effective_date timestamp NOT NULL,
	expiry_date timestamp NULL,
	create_user_id varchar NOT NULL,
	create_user_guid varchar NOT NULL,
	create_timestamp timestamp NOT NULL,
	update_user_id varchar NOT NULL,
	update_user_guid varchar NOT NULL,
	update_timestamp timestamp NOT NULL,
	"geoOrgUnitTypeCodeGeoOrgUnitTypeCode" varchar NULL,
	CONSTRAINT "PK_58b8d8fd2b72c1601fdf041ce80" PRIMARY KEY (geo_organization_unit_code),
	CONSTRAINT "REL_7eb567a78e0380c9c5df195dcc" UNIQUE ("geoOrgUnitTypeCodeGeoOrgUnitTypeCode"),
	CONSTRAINT "FK_7eb567a78e0380c9c5df195dccd" FOREIGN KEY ("geoOrgUnitTypeCodeGeoOrgUnitTypeCode") REFERENCES ceds.geo_org_unit_type_code(geo_org_unit_type_code)
);


-- ceds.office definition

-- Drop table

-- DROP TABLE ceds.office;

CREATE TABLE ceds.office (
	office_guid varchar NOT NULL,
	create_user_id varchar NOT NULL,
	create_user_guid varchar NOT NULL,
	create_timestamp timestamp NOT NULL,
	update_user_id varchar NOT NULL,
	update_user_guid varchar NOT NULL,
	update_timestamp timestamp NOT NULL,
	"geoOrganizationUnitCodeGeoOrganizationUnitCode" varchar NULL,
	"agencyCodeAgencyCode" varchar NULL,
	CONSTRAINT "PK_bbad043d9dc25e69ee87831a69c" PRIMARY KEY (office_guid),
	CONSTRAINT "REL_54e3a62b898ed840aea2eee51d" UNIQUE ("geoOrganizationUnitCodeGeoOrganizationUnitCode"),
	CONSTRAINT "REL_c7b5e15e6f98d320d93b4298ec" UNIQUE ("agencyCodeAgencyCode"),
	CONSTRAINT "FK_54e3a62b898ed840aea2eee51d1" FOREIGN KEY ("geoOrganizationUnitCodeGeoOrganizationUnitCode") REFERENCES ceds.geo_organization_unit_code(geo_organization_unit_code),
	CONSTRAINT "FK_c7b5e15e6f98d320d93b4298ec2" FOREIGN KEY ("agencyCodeAgencyCode") REFERENCES ceds.agency_code(agency_code)
);


-- ceds.person definition

-- Drop table

-- DROP TABLE ceds.person;

CREATE TABLE ceds.person (
	person_guid varchar NOT NULL,
	first_name varchar NOT NULL,
	middle_name_1 varchar NULL,
	middle_name_2 varchar NULL,
	last_name varchar NOT NULL,
	create_user_id varchar NOT NULL,
	create_user_guid varchar NOT NULL,
	create_timestamp timestamp NOT NULL,
	update_user_id varchar NOT NULL,
	update_user_guid varchar NOT NULL,
	update_timestamp timestamp NOT NULL,
	"officeGuidOfficeGuid" varchar NULL,
	CONSTRAINT "PK_df1f2874a3d7d873e16cb26d4c7" PRIMARY KEY (person_guid),
	CONSTRAINT "REL_beeaa5c8dadfb903c830d6fd38" UNIQUE ("officeGuidOfficeGuid"),
	CONSTRAINT "FK_beeaa5c8dadfb903c830d6fd387" FOREIGN KEY ("officeGuidOfficeGuid") REFERENCES ceds.office(office_guid)
);


-- ceds.complaint definition

-- Drop table

-- DROP TABLE ceds.complaint;

CREATE TABLE ceds.complaint (
	complaint_id serial4 NOT NULL,
	detail_text varchar NULL,
	caller_name varchar NULL,
	caller_address varchar NULL,
	caller_email varchar NULL,
	caller_phone_1 varchar NULL,
	caller_phone_2 varchar NULL,
	caller_phone_3 varchar NULL,
	location_geometry_point ceds.geometry NULL,
	location_summary_text varchar NULL,
	location_detailed_text varchar NULL,
	incident_date timestamp NULL,
	referred_by_agency_other_text varchar NULL,
	create_user_id varchar NOT NULL,
	create_user_guid varchar NOT NULL,
	create_timestamp timestamp NOT NULL,
	update_user_id varchar NOT NULL,
	update_user_guid varchar NOT NULL,
	update_timestamp timestamp NOT NULL,
	"referredByAgencyCodeAgencyCode" varchar NULL,
	"ownedByAgencyCodeAgencyCode" varchar NULL,
	"complaintStatusCodeComplaintStatusCode" varchar NULL,
	"geoOrganizationUnitCodeGeoOrganizationUnitCode" varchar NULL,
	CONSTRAINT "PK_6ba3b50df025a93df1544695d07" PRIMARY KEY (complaint_id),
	CONSTRAINT "REL_3edd7ff5c0bf341dbf0e78681e" UNIQUE ("complaintStatusCodeComplaintStatusCode"),
	CONSTRAINT "REL_721184b73a1f0104f308f6b89c" UNIQUE ("referredByAgencyCodeAgencyCode"),
	CONSTRAINT "REL_e2aabc900302f4390eb37a94e2" UNIQUE ("ownedByAgencyCodeAgencyCode"),
	CONSTRAINT "REL_e9edb5e9f7925cce38777f8cd0" UNIQUE ("geoOrganizationUnitCodeGeoOrganizationUnitCode"),
	CONSTRAINT "FK_3edd7ff5c0bf341dbf0e78681ed" FOREIGN KEY ("complaintStatusCodeComplaintStatusCode") REFERENCES ceds.complaint_status_code(complaint_status_code),
	CONSTRAINT "FK_721184b73a1f0104f308f6b89ca" FOREIGN KEY ("referredByAgencyCodeAgencyCode") REFERENCES ceds.agency_code(agency_code),
	CONSTRAINT "FK_e2aabc900302f4390eb37a94e27" FOREIGN KEY ("ownedByAgencyCodeAgencyCode") REFERENCES ceds.agency_code(agency_code),
	CONSTRAINT "FK_e9edb5e9f7925cce38777f8cd05" FOREIGN KEY ("geoOrganizationUnitCodeGeoOrganizationUnitCode") REFERENCES ceds.geo_organization_unit_code(geo_organization_unit_code)
);


-- ceds.geo_org_unit_structure definition

-- Drop table

-- DROP TABLE ceds.geo_org_unit_structure;

CREATE TABLE ceds.geo_org_unit_structure (
	geo_org_unit_structure_guid varchar NOT NULL,
	effective_date timestamp NOT NULL,
	expiry_date timestamp NULL,
	create_user_id varchar NOT NULL,
	create_user_guid varchar NOT NULL,
	create_timestamp timestamp NOT NULL,
	update_user_id varchar NOT NULL,
	update_user_guid varchar NOT NULL,
	update_timestamp timestamp NOT NULL,
	"agencyCodeAgencyCode" varchar NULL,
	"parentGeoOrgUnitCodeGeoOrganizationUnitCode" varchar NULL,
	"childGeoOrgUnitCodeGeoOrganizationUnitCode" varchar NULL,
	CONSTRAINT "PK_61c2072baf86ce6538f03046b1e" PRIMARY KEY (geo_org_unit_structure_guid),
	CONSTRAINT "REL_2a3a29c4a3589d4e8019aad14b" UNIQUE ("childGeoOrgUnitCodeGeoOrganizationUnitCode"),
	CONSTRAINT "REL_7f07f490490cd03a4c2fd9d903" UNIQUE ("agencyCodeAgencyCode"),
	CONSTRAINT "REL_ed1928a85424bf2ca60ee55c46" UNIQUE ("parentGeoOrgUnitCodeGeoOrganizationUnitCode"),
	CONSTRAINT "UQ_bb180854b01e0f7569c2f8f656d" UNIQUE ("parentGeoOrgUnitCodeGeoOrganizationUnitCode", "childGeoOrgUnitCodeGeoOrganizationUnitCode"),
	CONSTRAINT "FK_2a3a29c4a3589d4e8019aad14b6" FOREIGN KEY ("childGeoOrgUnitCodeGeoOrganizationUnitCode") REFERENCES ceds.geo_organization_unit_code(geo_organization_unit_code),
	CONSTRAINT "FK_7f07f490490cd03a4c2fd9d903c" FOREIGN KEY ("agencyCodeAgencyCode") REFERENCES ceds.agency_code(agency_code),
	CONSTRAINT "FK_ed1928a85424bf2ca60ee55c460" FOREIGN KEY ("parentGeoOrgUnitCodeGeoOrganizationUnitCode") REFERENCES ceds.geo_organization_unit_code(geo_organization_unit_code)
);


-- ceds.officer definition

-- Drop table

-- DROP TABLE ceds.officer;

CREATE TABLE ceds.officer (
	officer_guid varchar NOT NULL,
	user_id varchar NOT NULL,
	create_user_id varchar NOT NULL,
	create_user_guid varchar NOT NULL,
	create_timestamp timestamp NOT NULL,
	update_user_id varchar NOT NULL,
	update_user_guid varchar NOT NULL,
	update_timestamp timestamp NOT NULL,
	"personGuidPersonGuid" varchar NULL,
	"officeGuidOfficeGuid" varchar NULL,
	CONSTRAINT "PK_7fc935f4ae529157693940d5652" PRIMARY KEY (officer_guid),
	CONSTRAINT "REL_31541ca539c4ff7aa7451a810b" UNIQUE ("officeGuidOfficeGuid"),
	CONSTRAINT "UQ_88e11fbfa41ff4643e427c53b61" UNIQUE ("personGuidPersonGuid"),
	CONSTRAINT "FK_31541ca539c4ff7aa7451a810ba" FOREIGN KEY ("officeGuidOfficeGuid") REFERENCES ceds.office(office_guid),
	CONSTRAINT "FK_88e11fbfa41ff4643e427c53b61" FOREIGN KEY ("personGuidPersonGuid") REFERENCES ceds.person(person_guid)
);


-- ceds.allegation_complaint definition

-- Drop table

-- DROP TABLE ceds.allegation_complaint;

CREATE TABLE ceds.allegation_complaint (
	alegation_complaint_guid varchar NOT NULL,
	in_progress_ind bool NOT NULL,
	observed_ind bool NOT NULL,
	suspect_witnesss_dtl_text varchar NULL,
	create_user_id varchar NOT NULL,
	create_user_guid varchar NOT NULL,
	create_timestamp timestamp NOT NULL,
	update_user_id varchar NOT NULL,
	update_user_guid varchar NOT NULL,
	update_timestamp timestamp NOT NULL,
	"complaintIdComplaintId" int4 NULL,
	"violationCodeViolationCode" varchar NULL,
	CONSTRAINT "PK_56bb3006021dade312f509d9ce3" PRIMARY KEY (alegation_complaint_guid),
	CONSTRAINT "REL_d69a375b4c7aeea9ffa21f3101" UNIQUE ("violationCodeViolationCode"),
	CONSTRAINT "UQ_fe457cacc024d15c6fe9c6f0bd8" UNIQUE ("complaintIdComplaintId"),
	CONSTRAINT "FK_d69a375b4c7aeea9ffa21f31012" FOREIGN KEY ("violationCodeViolationCode") REFERENCES ceds.violation_code(violation_code),
	CONSTRAINT "FK_fe457cacc024d15c6fe9c6f0bd8" FOREIGN KEY ("complaintIdComplaintId") REFERENCES ceds.complaint(complaint_id)
);