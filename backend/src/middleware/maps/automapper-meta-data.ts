import { PojosMetadataMap } from "@automapper/pojos";

//-- entities
import { CosGeoOrgUnit } from "src/v1/cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { PersonComplaintXref } from "src/v1/person_complaint_xref/entities/person_complaint_xref.entity";
import { Person } from "src/v1/person/entities/person.entity";

//-- models
import { OrganizationCodeTable } from "src/types/models/code-tables";
import { Delegate, Person as PersonModel } from "src/types/models/people";

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

  //
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

  PojosMetadataMap.create<Delegate>("Delegate", {
    xrefId: String,
    isActive: Boolean,
    type: String ,
    person: Object
  });

};

export const createComplaintMetaData = () => {
  createOrganizationMetaData();

  //-- complaint source entity

  //-- complaint destination model


};
