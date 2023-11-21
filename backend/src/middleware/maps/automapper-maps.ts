import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { OrganizationCodeTable } from "src/types/models/code-tables";
import { Delegate } from "src/types/models/people";
import { CosGeoOrgUnit } from "src/v1/cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { PersonComplaintXref } from "src/v1/person_complaint_xref/entities/person_complaint_xref.entity";

export const applyComplaintMap = (mapper: Mapper) => {
  createMap<CosGeoOrgUnit, OrganizationCodeTable>(
    mapper,
    "CosGeoOrgUnit", //-- source
    "OrganizationCodeTable", //-- destination
    forMember(
      (destination) => destination.area,
      mapFrom((source) => source.area_code)
    ),
    forMember(
      (destination) => destination.officeLocation,
      mapFrom((source) => source.office_location_code)
    ),
    forMember(
      (destination) => destination.region,
      mapFrom((source) => source.region_code)
    ),
    forMember(
      (destination) => destination.zone,
      mapFrom((source) => source.zone_code)
    )
  );

  createMap<PersonComplaintXref, Delegate>(
    mapper,
    "PersonComplaintXref",
    "Delegate",
    forMember(
      (destination) => destination.xrefId,
      mapFrom((source) => source.personComplaintXrefGuid)
    ),
    forMember(
      (destination) => destination.isActive,
      mapFrom((source) => source.active_ind)
    ),
    forMember(
      (destination) => destination.type,
      mapFrom(
        (source) => source.person_complaint_xref_code.person_complaint_xref_code
      )
    ),
    forMember(
      (destination) => destination.person,
      mapFrom((source) => {
        return {
          id: source.person_guid.person_guid,
          firstName: source.person_guid.first_name,
          middleName1: source.person_guid.middle_name_1,
          middleName2: source.person_guid.middle_name_2,
          lastName: source.person_guid.last_name,
        }
      })
    )
  );
};