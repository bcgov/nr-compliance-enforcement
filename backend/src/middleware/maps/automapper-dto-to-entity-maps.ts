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
        if (src.delegates) {
          const items = src.delegates.map((item) => {
            const {
              xrefId,
              isActive,
              type,
              person: { id, firstName, lastName, middleName1, middleName2 },
            } = item;
            let record = {
              personComplaintXrefGuid: xrefId,
              active_ind: isActive,
              person_complaint_xref_code: {
                person_complaint_xref_code: type,
              },
              person_guid: {
                person_guid: id,
                first_name: firstName,
                middle_name_1: middleName1,
                middle_name_2: middleName2,
                last_name: lastName,
              },
            };

            return record;
          });
          return items;
        }
      })
    ),
    forMember(
      (dest) => dest.owned_by_agency_code,
      mapFrom((src) => {
        const { ownedBy } = src || null;
        return ownedBy ? { agency_code: ownedBy } : null;
      })
    ),
    forMember(
      (dest) => dest.referred_by_agency_code,
      mapFrom((src) => {
        const { referredBy } = src || null;
        return referredBy ? { agency_code: referredBy } : null;
      })
    ),
    forMember(
      (dest) => dest.complaint_status_code,
      mapFrom((src) => {
        const { status } = src;
        return { complaint_status_code: status };
      })
    )
  );
};

export const mapWildlifeComplaintDtoToHwcrComplaint = (mapper: Mapper) => { 
  
}