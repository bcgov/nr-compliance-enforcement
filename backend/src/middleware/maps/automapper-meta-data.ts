import { PojosMetadataMap } from "@automapper/pojos";

//-- entities
import { CosGeoOrgUnit } from "src/v1/cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { PersonComplaintXref } from "src/v1/person_complaint_xref/entities/person_complaint_xref.entity";
import { Person } from "src/v1/person/entities/person.entity";
import { Complaint } from "src/v1/complaint/entities/complaint.entity";

//-- models
import { OrganizationCodeTable } from "src/types/models/code-tables";
import { DelegateDto } from "src/types/models/people/delegate";
import { ComplaintDto } from "src/types/models/complaints/complaint";


const createOrganizationMetaData = () => {
  PojosMetadataMap.create<CosGeoOrgUnit>("CosGeoOrgUnit", {
    region_code: String,
    zone_code: String,
    area_code: String,
    office_location_code: String,
    region_name: String,
    zone_name: String,
    area_name: String,
    office_location_name: String,
  });

  PojosMetadataMap.create<OrganizationCodeTable>("OrganizationCodeTable", {
    areaName: String,
    officeLocationName: String,
    regionName: String,
    zoneName: String,
    area: String,
    officeLocation: String,
    region: String,
    zone: String,
  });
};

const createDelegateMetadata = () => { 
  PojosMetadataMap.create<Person>("Person", {
    person_guid: Object,
    first_name: String,
    middle_name_1: String,
    middle_name_2: String,
    last_name: String
  });

  PojosMetadataMap.create<PersonComplaintXref>("PersonComplaintXref", {
    personComplaintXrefGuid: String,
    active_ind: Boolean,
    person_guid: Person
  });

  PojosMetadataMap.create<DelegateDto>("Delegate", {
    xrefId: String,
    isActive: Boolean,
    type: String ,
    person: Object
  });

}

export const createComplaintMetaData = () => {
  createDelegateMetadata()
  createOrganizationMetaData();

  PojosMetadataMap.create<Complaint>("Complaint", {
    complaint_identifier: String,
    detail_text: String,
    caller_name: String,
    caller_address: String,
    caller_email: String,
    caller_phone_1: String,
    caller_phone_2: String,
    caller_phone_3: String,
    location_geometry_point: Object,
    location_summary_text: String,
    location_detailed_text: String,
    complaint_status_code: Object,
    referred_by_agency_code: Object,
    owned_by_agency_code: Object,
    referred_by_agency_other_text: String,
    incident_reported_utc_timestmp: Date,
    incident_utc_datetime: Date,
    cos_geo_org_unit: Object,
    person_complaint_xref: Object,
  });

  PojosMetadataMap.create<ComplaintDto>("ComplaintDto", {
    id: String,
    details: String,
    name: String,
    address: String,
    email: String,
    phone1: String,
    phone2: String,
    phone3: String,
    location: Object,
    locationSummary: String,
    locationDetail: String,
    status: String,
    referredBy: String,
    ownedBy: String,
    referredByAgencyOther: String,
    reportedOn: Date,
    incidentDateTime: Date,
    organization: Object,
    delegates: Array<DelegateDto>,
  });

};


