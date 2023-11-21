import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";

//-- entities
import { CosGeoOrgUnit } from "src/v1/cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { PersonComplaintXref } from "src/v1/person_complaint_xref/entities/person_complaint_xref.entity";

//-- models (dto for now)
import { OrganizationCodeTable } from "src/types/models/code-tables";
import { DelegateDto } from "src/types/models/people/delegate";
import { Complaint } from "src/v1/complaint/entities/complaint.entity";
import { ComplaintDto } from "src/types/models/complaints/complaint";

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

  createMap<PersonComplaintXref, DelegateDto>(
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

  createMap<Complaint, ComplaintDto>(
   mapper,
   "Complaint", //-- source
   "ComplaintDto", //-- destination
   forMember(destination => destination.id, mapFrom(source => source.complaint_identifier)),
   forMember(destination => destination.details, mapFrom(source => source.detail_text)),
   forMember(destination => destination.name, mapFrom(source => source.caller_name)),
   forMember(destination => destination.address, mapFrom(source => source.caller_address)),
   forMember(destination => destination.email, mapFrom(source => source.caller_email)),
   forMember(destination => destination.phone1, mapFrom(source => source.caller_phone_1)),
   forMember(destination => destination.phone2, mapFrom(source => source.caller_phone_2)),
   forMember(destination => destination.phone3, mapFrom(source => source.caller_phone_3)),
   forMember(
      (destination) => destination.location,
      mapFrom((source) => {
        const {
          location_geometry_point: { type: locationType, coordinates },
        } = source;
        return { type: locationType, coordinates };
      })
    ),
   forMember(destination => destination.locationSummary, mapFrom(source => source.location_summary_text)),
   forMember(destination => destination.locationDetail, mapFrom(source => source.location_detailed_text)),
   forMember(destination => destination.status, mapFrom(source => { 
      const  { complaint_status_code: { complaint_status_code} } = source
      return complaint_status_code
   })),
   forMember(destination => destination.referredBy, mapFrom(source => { 
      if(source.referred_by_agency_code !== null){ 
         const { referred_by_agency_code: { agency_code} } = source
         return agency_code
      } else {  
         return "";
      }
   })),
   forMember(destination => destination.ownedBy, mapFrom(source => {
      if(source.owned_by_agency_code !== null){ 
         const { owned_by_agency_code: { agency_code} } = source
         return agency_code
      } else {  
         return "";
      }
   })),
   forMember(destination => destination.referredByAgencyOther, mapFrom(source => source.referred_by_agency_other_text)),
   forMember(destination => destination.incidentDateTime, mapFrom(source => source.incident_utc_datetime)),
   forMember(destination => destination.reportedOn, mapFrom(source => source.incident_reported_utc_timestmp)),
   forMember(
      (destination) => destination.organization,
      mapFrom((source) => {
        if(source.cos_geo_org_unit !== null){ 
         const {
           cos_geo_org_unit: {
             area_code: area,
             region_code: region,
             zone_code: zone,
             office_location_code: officeLocation,
           },
         } = source;
 
         return { region, zone, area, officeLocation}
        }
      })
    ),
    forMember(
      (destination) => destination.delegates,
      mapFrom((source) => {
        const { person_complaint_xref: people } = source;
        const delegates = mapper.mapArray<PersonComplaintXref, DelegateDto>(
          people,
          "PersonComplaintXref",
          "Delegate"
        );

        return delegates;
      })
    )
 );
};