import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { AttractantXrefDto } from "../../types/models/complaints/attractant-ref";
import { ComplaintDto } from "../../types/models/complaints/dtos/complaint";
import { DelegateDto } from "../../types/models/app_user/delegate";
import { AttractantXrefTable } from "../../types/tables/attractant-xref.table";
import { AppUserComplaintXrefTable } from "../../types/tables/app-user-complaint-xref.table";
import { UpdateComplaintDto } from "../../types/models/complaints/dtos/update-complaint";

export const mapComplaintDtoToComplaintTable = (mapper: Mapper) => {
  createMap<ComplaintDto, UpdateComplaintDto>(
    mapper,
    "ComplaintDto",
    "UpdateComplaintDto",
    forMember(
      (dest) => dest.detail_text,
      mapFrom((src) => src.details),
    ),
    forMember(
      (dest) => dest.caller_name,
      mapFrom((src) => src.name),
    ),
    forMember(
      (dest) => dest.caller_address,
      mapFrom((src) => src.address),
    ),
    forMember(
      (dest) => dest.caller_email,
      mapFrom((src) => src.email),
    ),
    forMember(
      (dest) => dest.caller_phone_1,
      mapFrom((src) => src.phone1),
    ),
    forMember(
      (dest) => dest.caller_phone_2,
      mapFrom((src) => src.phone2),
    ),
    forMember(
      (dest) => dest.caller_phone_3,
      mapFrom((src) => src.phone3),
    ),
    forMember(
      (dest) => dest.location_geometry_point,
      mapFrom((src) => src.location),
    ),
    forMember(
      (dest) => dest.location_summary_text,
      mapFrom((src) => src.locationSummary),
    ),
    forMember(
      (dest) => dest.location_detailed_text,
      mapFrom((src) => src.locationDetail),
    ),
    forMember(
      (dest) => dest.incident_utc_datetime,
      mapFrom((src) => src.incidentDateTime),
    ),
    forMember(
      (dest) => dest.reported_by_other_text,
      mapFrom((src) => src.reportedByOther),
    ),
    forMember(
      (dest) => dest.complaint_identifier,
      mapFrom((src) => src.id),
    ),
    forMember(
      (dest) => dest.reported_by_code,
      mapFrom((src) => {
        return !src.reportedBy
          ? null
          : {
              reported_by_code: src.reportedBy,
            };
      }),
    ),
    forMember(
      (dest) => dest.owned_by_agency_code_ref,
      mapFrom((src) => {
        return src.ownedBy;
      }),
    ),
    forMember(
      (dest) => dest.complaint_status_code,
      mapFrom((src) => {
        return {
          complaint_status_code: src.status,
        };
      }),
    ),
    forMember(
      (dest) => dest.reference_number,
      mapFrom((src) => {
        return src.referenceNumber;
      }),
    ),
    forMember(
      (dest) => dest.is_privacy_requested,
      mapFrom((src) => {
        return src.isPrivacyRequested;
      }),
    ),
    forMember(
      (dest) => dest.comp_last_upd_utc_timestamp,
      mapFrom((src) => {
        return src.updatedOn;
      }),
    ),
    forMember(
      (dest) => dest.park_guid,
      mapFrom((src) => {
        return src.parkGuid;
      }),
    ),
    forMember(
      (dest) => dest.geo_organization_unit_code,
      mapFrom((src) => {
        return src.organization?.area;
      }),
    ),
  );
};

export const mapDelegateDtoToAppUserComplaintXrefTable = (mapper: Mapper) => {
  createMap<DelegateDto, AppUserComplaintXrefTable>(
    mapper,
    "DelegateDto",
    "AppUserComplaintXrefTable",
    forMember(
      (dest) => dest.active_ind,
      mapFrom((src) => src.isActive),
    ),
    forMember(
      (dest) => dest.app_user_guid,
      mapFrom((src) => src.appUserGuid),
    ),
    forMember(
      (dest) => dest.app_user_complaint_xref_code,
      mapFrom((src) => src.type),
    ),
  );
};

export const mapAttactantDtoToAttractant = (mapper: Mapper) => {
  createMap<AttractantXrefDto, AttractantXrefTable>(
    mapper,
    "AttractantXrefDto",
    "AttractantXrefTable",
    forMember(
      (dest) => dest.active_ind,
      mapFrom((src) => src.isActive),
    ),
    forMember(
      (dest) => dest.attractant_code,
      mapFrom((src) => {
        const { attractant } = src;
        return { attractant_code: attractant, active_ind: true };
      }),
    ),
    forMember(
      (dest) => dest.hwcr_complaint_guid,
      mapFrom((src) => src.xrefId),
    ),
  );
};
