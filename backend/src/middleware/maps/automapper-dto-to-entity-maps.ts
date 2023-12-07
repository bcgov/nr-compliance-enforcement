import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";

//-- entities
import { Complaint } from "src/v1/complaint/entities/complaint.entity";
import { HwcrComplaint } from "src/v1/hwcr_complaint/entities/hwcr_complaint.entity";
import { PersonComplaintXref } from "src/v1/person_complaint_xref/entities/person_complaint_xref.entity";

//-- dto
import { WildlifeComplaintDto } from "src/types/models/complaints/wildlife-complaint";
import { ComplaintDto } from "src/types/models/complaints/complaint";
import { DelegateDto } from "src/types/models/people/delegate";

export const mapComplaintDtoToComplaint = (mapper: Mapper) => {
  createMap<ComplaintDto, Complaint>(
    mapper,
    "ComplaintDto",
    "Complaint",
    forMember(
      (dest) => dest.complaint_identifier,
      mapFrom((src) => src.id)
    ),
    forMember(
      (dest) => dest.detail_text,
      mapFrom((src) => src.details)
    ),
    forMember(
      (dest) => dest.caller_name,
      mapFrom((src) => src.name)
    ),
    forMember(
      (dest) => dest.caller_address,
      mapFrom((src) => src.address)
    ),
    forMember(
      (dest) => dest.caller_email,
      mapFrom((src) => src.email)
    ),
    forMember(
      (dest) => dest.caller_phone_1,
      mapFrom((src) => src.phone1)
    ),
    forMember(
      (dest) => dest.caller_phone_2,
      mapFrom((src) => src.phone2)
    ),
    forMember(
      (dest) => dest.caller_phone_3,
      mapFrom((src) => src.phone3)
    ),
    forMember(
      (dest) => dest.location_geometry_point,
      mapFrom((src) => src.location)
    ),
    forMember(
      (dest) => dest.location_summary_text,
      mapFrom((src) => src.locationSummary)
    ),
    forMember(
      (dest) => dest.location_detailed_text,
      mapFrom((src) => src.locationDetail)
    ),
    forMember(
      (dest) => dest.referred_by_agency_other_text,
      mapFrom((src) => src.referredByAgencyOther)
    ),
    forMember(
      (dest) => dest.incident_utc_datetime,
      mapFrom((src) => src.incidentDateTime)
    ),
    forMember(
      (dest) => dest.incident_reported_utc_timestmp,
      mapFrom((src) => src.reportedOn)
    ),
    forMember(
      (dest) => dest.cos_geo_org_unit,
      mapFrom((src) => {
        const { area, zone, region } = src.organization;
        return { area_code: area, zone_code: zone, region_code: region };
      })
    ),
    forMember(
      (dest) => dest.cos_geo_org_unit,
      mapFrom((src) => {
        const { area, zone, region } = src.organization;
        return { area_code: area, zone_code: zone, region_code: region };
      })
    ),
    forMember(
      (dest) => dest.person_complaint_xref,
      mapFrom((src) => {
         const items = mapper.mapArray<DelegateDto, PersonComplaintXref>(
            src.delegates,
            "ViolationCode",
            "ViolationCodeDto"
          );

          return items
      })
    ),
  );
};

export const delegatesToPersonComplaintXref = (mapper: Mapper) => {
  createMap<DelegateDto, PersonComplaintXref>(
    mapper,
    "DelegateDto",
    "PersonComplaintXref",
    forMember(
      (dest) => dest.personComplaintXrefGuid,
      mapFrom((src) => src.xrefId)
    ),
    forMember(
      (dest) => dest.active_ind,
      mapFrom((src) => src.isActive)
    ),
    forMember(
      (dest) => dest.person_complaint_xref_code,
      mapFrom((src) => {
        return { person_complaint_xref_code: src.type };
      })
    )
  );
};

/*const personComplaintToDelegateDtoMap = (mapper: Mapper) => {
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
         };
       })
     )
   );
 };*/

// export const mapWidllifeComplaintToHwcrComplaint = (mapper: Mapper) => {
//    createMap<WildlifeComplaintDto, HwcrComplaint>(mapper, "WildlifeComplaintDto", "HwcrComplaint",
//    )
// };
