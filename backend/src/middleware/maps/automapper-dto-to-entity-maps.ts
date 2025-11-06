import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";

//-- entities
import { Complaint } from "../../v1/complaint/entities/complaint.entity";
import { HwcrComplaint } from "../../v1/hwcr_complaint/entities/hwcr_complaint.entity";
import { AllegationComplaint } from "../../v1/allegation_complaint/entities/allegation_complaint.entity";
import { AttractantHwcrXref } from "../../v1/attractant_hwcr_xref/entities/attractant_hwcr_xref.entity";

//-- dto
import { WildlifeComplaintDto } from "../../types/models/complaints/dtos/wildlife-complaint";
import { ComplaintDto } from "../../types/models/complaints/dtos/complaint";
import { AttractantXrefDto } from "../../types/models/complaints/attractant-ref";
import { AllegationComplaintDto } from "../../types/models/complaints/dtos/allegation-complaint";
import { GeneralIncidentComplaintDto } from "../../types/models/complaints/dtos/gir-complaint";
import { GirComplaint } from "../../v1/gir_complaint/entities/gir_complaint.entity";
import { SectorComplaintDto } from "../../types/models/complaints/dtos/sector-complaint";

export const mapComplaintDtoToComplaint = (mapper: Mapper) => {
  createMap<ComplaintDto, Complaint>(
    mapper,
    "ComplaintDto",
    "Complaint",
    forMember(
      (dest) => dest.complaint_identifier,
      mapFrom((src) => src.id),
    ),
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
      (dest) => dest.reported_by_other_text,
      mapFrom((src) => src.reportedByOther),
    ),
    forMember(
      (dest) => dest.incident_utc_datetime,
      mapFrom((src) => src.incidentDateTime),
    ),
    forMember(
      (dest) => dest.incident_reported_utc_timestmp,
      mapFrom((src) => src.reportedOn),
    ),
    forMember(
      (dest) => dest.geo_organization_unit_code,
      mapFrom((src) => src.organization?.area || ""),
    ),
    forMember(
      (dest) => dest.app_user_complaint_xref,
      mapFrom((src) => {
        const { delegates } = src;
        if (!delegates || !Array.isArray(delegates)) {
          return [];
        }

        return delegates.map((delegate) => ({
          active_ind: delegate.isActive,
          app_user_guid: delegate.appUserGuid,
          app_user_complaint_xref_code: { app_user_complaint_xref_code: delegate.type },
        }));
      }),
    ),
    forMember(
      (dest) => dest.owned_by_agency_code_ref,
      mapFrom((src) => src.ownedBy),
    ),
    forMember(
      (dest) => dest.reported_by_code,
      mapFrom((src) => {
        const { reportedBy } = src ?? null;
        return reportedBy ? { reported_by_code: reportedBy } : null;
      }),
    ),
    forMember(
      (dest) => dest.complaint_status_code,
      mapFrom((src) => {
        const { status } = src;
        return { complaint_status_code: status };
      }),
    ),
    forMember(
      (dest) => dest.comp_mthd_recv_cd_agcy_cd_xref,
      mapFrom((src) => {
        // This will be looked up from the service using the received complaintMethodReceivedCode
        return null; // This will be handled in the service
      }),
    ),
    forMember(
      (dest) => dest.is_privacy_requested,
      mapFrom((src) => src.isPrivacyRequested),
    ),
    forMember(
      (dest) => dest.comp_last_upd_utc_timestamp,
      mapFrom((src) => src.updatedOn),
    ),
    forMember(
      (dest) => dest.park_guid,
      mapFrom((src) => src.parkGuid),
    ),
    forMember(
      (dest) => dest.complaint_type_code,
      mapFrom((src) => {
        const { type } = src;
        return type ? { complaint_type_code: type } : null;
      }),
    ),
  );
};

export const mapWildlifeComplaintDtoToHwcrComplaint = (mapper: Mapper) => {
  createMap<WildlifeComplaintDto, HwcrComplaint>(
    mapper,
    "WildlifeComplaintDto",
    "HwcrComplaint",
    forMember(
      (dest) => dest.complaint_identifier.complaint_identifier,
      mapFrom((src) => src.id),
    ),
    forMember(
      (dest) => dest.complaint_identifier.detail_text,
      mapFrom((src) => src.details),
    ),
    forMember(
      (dest) => dest.complaint_identifier.caller_name,
      mapFrom((src) => src.name),
    ),
    forMember(
      (dest) => dest.complaint_identifier.caller_address,
      mapFrom((src) => src.address),
    ),
    forMember(
      (dest) => dest.complaint_identifier.caller_email,
      mapFrom((src) => src.email),
    ),
    forMember(
      (dest) => dest.complaint_identifier.caller_phone_1,
      mapFrom((src) => src.phone1),
    ),
    forMember(
      (dest) => dest.complaint_identifier.caller_phone_2,
      mapFrom((src) => src.phone2),
    ),
    forMember(
      (dest) => dest.complaint_identifier.caller_phone_3,
      mapFrom((src) => src.phone3),
    ),
    forMember(
      (dest) => dest.complaint_identifier.location_geometry_point,
      mapFrom((src) => src.location),
    ),
    forMember(
      (dest) => dest.complaint_identifier.location_summary_text,
      mapFrom((src) => src.locationSummary),
    ),
    forMember(
      (dest) => dest.complaint_identifier.location_detailed_text,
      mapFrom((src) => src.locationDetail),
    ),
    forMember(
      (dest) => dest.complaint_identifier.reported_by_other_text,
      mapFrom((src) => src.reportedByOther),
    ),
    forMember(
      (dest) => dest.complaint_identifier.incident_utc_datetime,
      mapFrom((src) => src.incidentDateTime),
    ),
    forMember(
      (dest) => dest.complaint_identifier.incident_reported_utc_timestmp,
      mapFrom((src) => src.reportedOn),
    ),
    forMember(
      (dest) => dest.complaint_identifier.geo_organization_unit_code,
      mapFrom((src) => src.organization?.zone || ""),
    ),
    forMember(
      (dest) => dest.complaint_identifier.app_user_complaint_xref,
      mapFrom((src) => {
        const { delegates } = src;
        if (!delegates || !Array.isArray(delegates)) {
          return [];
        }

        return delegates.map((delegate) => ({
          active_ind: delegate.isActive,
          app_user_guid: delegate.appUserGuid,
          app_user_complaint_xref_code: { app_user_complaint_xref_code: delegate.type },
        }));
      }),
    ),
    forMember(
      (dest) => dest.complaint_identifier.owned_by_agency_code_ref,
      mapFrom((src) => src.ownedBy),
    ),
    forMember(
      (dest) => dest.complaint_identifier.reported_by_code,
      mapFrom((src) => {
        const { reportedBy } = src ?? null;
        return reportedBy ? { reported_by_code: reportedBy } : null;
      }),
    ),
    forMember(
      (dest) => dest.complaint_identifier.complaint_status_code,
      mapFrom((src) => {
        const { status } = src;
        return { complaint_status_code: status };
      }),
    ),
    forMember(
      (dest) => dest.hwcr_complaint_guid,
      mapFrom((src) => src.hwcrId),
    ),
    forMember(
      (dest) => dest.attractant_hwcr_xref,
      mapFrom((src) => {
        const { attractants } = src;

        const items = attractants.map((item) => {
          const { attractant, xrefId, isActive } = item;

          let record = {
            attractant_hwcr_xref_guid: xrefId,
            active_ind: isActive,
            attractant_code: {
              attractant_code: attractant,
            },
          };

          return record as any;
        });

        return items;
      }),
    ),
    forMember(
      (dest) => dest.other_attractants_text,
      mapFrom((src) => src.otherAttractants),
    ),
    forMember(
      (dest) => dest.species_code,
      mapFrom((src) => {
        const { species } = src;

        const record = {
          species_code: species,
        };

        return record;
      }),
    ),
    forMember(
      (dest) => dest.hwcr_complaint_nature_code,
      mapFrom((src) => {
        const { natureOfComplaint } = src;
        const record = {
          hwcr_complaint_nature_code: natureOfComplaint,
        };

        return record;
      }),
    ),
    forMember(
      (dest) => dest.complaint_identifier.is_privacy_requested,
      mapFrom((src) => src.isPrivacyRequested),
    ),
    forMember(
      (dest) => dest.complaint_identifier.comp_last_upd_utc_timestamp,
      mapFrom((src) => src.updatedOn),
    ),
    forMember(
      (dest) => dest.complaint_identifier.park_guid,
      mapFrom((src) => src.parkGuid),
    ),
    forMember(
      (dest) => dest.complaint_identifier.complaint_type_code,
      mapFrom((src) => {
        const { type } = src;
        return type ? { complaint_type_code: type } : null;
      }),
    ),
  );
};

export const mapAllegationComplaintDtoToAllegationComplaint = (mapper: Mapper) => {
  createMap<AllegationComplaintDto, AllegationComplaint>(
    mapper,
    "AllegationComplaintDto",
    "AllegationComplaint",
    forMember(
      (dest) => dest.complaint_identifier.complaint_identifier,
      mapFrom((src) => src.id),
    ),
    forMember(
      (dest) => dest.complaint_identifier.detail_text,
      mapFrom((src) => src.details),
    ),
    forMember(
      (dest) => dest.complaint_identifier.caller_name,
      mapFrom((src) => src.name),
    ),
    forMember(
      (dest) => dest.complaint_identifier.caller_address,
      mapFrom((src) => src.address),
    ),
    forMember(
      (dest) => dest.complaint_identifier.caller_email,
      mapFrom((src) => src.email),
    ),
    forMember(
      (dest) => dest.complaint_identifier.caller_phone_1,
      mapFrom((src) => src.phone1),
    ),
    forMember(
      (dest) => dest.complaint_identifier.caller_phone_2,
      mapFrom((src) => src.phone2),
    ),
    forMember(
      (dest) => dest.complaint_identifier.caller_phone_3,
      mapFrom((src) => src.phone3),
    ),
    forMember(
      (dest) => dest.complaint_identifier.location_geometry_point,
      mapFrom((src) => src.location),
    ),
    forMember(
      (dest) => dest.complaint_identifier.location_summary_text,
      mapFrom((src) => src.locationSummary),
    ),
    forMember(
      (dest) => dest.complaint_identifier.location_detailed_text,
      mapFrom((src) => src.locationDetail),
    ),
    forMember(
      (dest) => dest.complaint_identifier.reported_by_other_text,
      mapFrom((src) => src.reportedByOther),
    ),
    forMember(
      (dest) => dest.complaint_identifier.incident_utc_datetime,
      mapFrom((src) => src.incidentDateTime),
    ),
    forMember(
      (dest) => dest.complaint_identifier.incident_reported_utc_timestmp,
      mapFrom((src) => src.reportedOn),
    ),
    forMember(
      (dest) => dest.complaint_identifier.geo_organization_unit_code,
      mapFrom((src) => src.organization?.zone || ""),
    ),
    forMember(
      (dest) => dest.complaint_identifier.app_user_complaint_xref,
      mapFrom((src) => {
        const { delegates } = src;
        if (!delegates || !Array.isArray(delegates)) {
          return [];
        }

        return delegates.map((delegate) => ({
          active_ind: delegate.isActive,
          app_user_guid: delegate.appUserGuid,
          app_user_complaint_xref_code: { app_user_complaint_xref_code: delegate.type },
        }));
      }),
    ),
    forMember(
      (dest) => dest.complaint_identifier.owned_by_agency_code_ref,
      mapFrom((src) => src.ownedBy),
    ),
    forMember(
      (dest) => dest.complaint_identifier.reported_by_code,
      mapFrom((src) => {
        const { reportedBy } = src ?? null;
        return reportedBy ? { reported_by_code: reportedBy } : null;
      }),
    ),
    forMember(
      (dest) => dest.complaint_identifier.complaint_status_code,
      mapFrom((src) => {
        const { status } = src;
        return { complaint_status_code: status };
      }),
    ),
    forMember(
      (dest) => dest.allegation_complaint_guid,
      mapFrom((src) => src.ersId),
    ),
    forMember(
      (dest) => dest.in_progress_ind,
      mapFrom((src) => src.isInProgress),
    ),
    forMember(
      (dest) => dest.observed_ind,
      mapFrom((src) => src.wasObserved),
    ),
    forMember(
      (dest) => dest.violation_code,
      mapFrom((src) => {
        const { violation } = src;

        return {
          violation_code: violation,
        };
      }),
    ),
    forMember(
      (dest) => dest.suspect_witnesss_dtl_text,
      mapFrom((src) => src.violationDetails),
    ),
    forMember(
      (dest) => dest.complaint_identifier.is_privacy_requested,
      mapFrom((src) => src.isPrivacyRequested),
    ),
    forMember(
      (dest) => dest.complaint_identifier.comp_last_upd_utc_timestamp,
      mapFrom((src) => src.updatedOn),
    ),
    forMember(
      (dest) => dest.complaint_identifier.park_guid,
      mapFrom((src) => src.parkGuid),
    ),
    forMember(
      (dest) => dest.complaint_identifier.complaint_type_code,
      mapFrom((src) => {
        const { type } = src;
        return type ? { complaint_type_code: type } : null;
      }),
    ),
  );
};

export const mapGirComplaintDtoToGirComplaint = (mapper: Mapper) => {
  createMap<GeneralIncidentComplaintDto, GirComplaint>(
    mapper,
    "GeneralIncidentComplaintDto",
    "GirComplaint",
    forMember(
      (dest) => dest.complaint_identifier.complaint_identifier,
      mapFrom((src) => src.id),
    ),
    forMember(
      (dest) => dest.complaint_identifier.detail_text,
      mapFrom((src) => src.details),
    ),
    forMember(
      (dest) => dest.complaint_identifier.caller_name,
      mapFrom((src) => src.name),
    ),
    forMember(
      (dest) => dest.complaint_identifier.caller_address,
      mapFrom((src) => src.address),
    ),
    forMember(
      (dest) => dest.complaint_identifier.caller_email,
      mapFrom((src) => src.email),
    ),
    forMember(
      (dest) => dest.complaint_identifier.caller_phone_1,
      mapFrom((src) => src.phone1),
    ),
    forMember(
      (dest) => dest.complaint_identifier.caller_phone_2,
      mapFrom((src) => src.phone2),
    ),
    forMember(
      (dest) => dest.complaint_identifier.caller_phone_3,
      mapFrom((src) => src.phone3),
    ),
    forMember(
      (dest) => dest.complaint_identifier.location_geometry_point,
      mapFrom((src) => src.location),
    ),
    forMember(
      (dest) => dest.complaint_identifier.location_summary_text,
      mapFrom((src) => src.locationSummary),
    ),
    forMember(
      (dest) => dest.complaint_identifier.location_detailed_text,
      mapFrom((src) => src.locationDetail),
    ),
    forMember(
      (dest) => dest.complaint_identifier.reported_by_other_text,
      mapFrom((src) => src.reportedByOther),
    ),
    forMember(
      (dest) => dest.complaint_identifier.incident_utc_datetime,
      mapFrom((src) => src.incidentDateTime),
    ),
    forMember(
      (dest) => dest.complaint_identifier.incident_reported_utc_timestmp,
      mapFrom((src) => src.reportedOn),
    ),
    forMember(
      (dest) => dest.complaint_identifier.geo_organization_unit_code,
      mapFrom((src) => src.organization?.zone || ""),
    ),
    forMember(
      (dest) => dest.complaint_identifier.app_user_complaint_xref,
      mapFrom((src) => {
        const { delegates } = src;
        if (!delegates || !Array.isArray(delegates)) {
          return [];
        }

        return delegates.map((delegate) => ({
          active_ind: delegate.isActive,
          app_user_guid: delegate.appUserGuid,
          app_user_complaint_xref_code: { app_user_complaint_xref_code: delegate.type },
        }));
      }),
    ),
    forMember(
      (dest) => dest.complaint_identifier.owned_by_agency_code_ref,
      mapFrom((src) => src.ownedBy),
    ),
    forMember(
      (dest) => dest.complaint_identifier.reported_by_code,
      mapFrom((src) => {
        const { reportedBy } = src ?? null;
        return reportedBy ? { reported_by_code: reportedBy } : null;
      }),
    ),
    forMember(
      (dest) => dest.complaint_identifier.complaint_status_code,
      mapFrom((src) => {
        const { status } = src;
        return { complaint_status_code: status };
      }),
    ),
    forMember(
      (dest) => dest.gir_complaint_guid,
      mapFrom((src) => src.girId),
    ),
    forMember(
      (dest) => dest.complaint_identifier.is_privacy_requested,
      mapFrom((src) => src.isPrivacyRequested),
    ),
    forMember(
      (dest) => dest.complaint_identifier.comp_last_upd_utc_timestamp,
      mapFrom((src) => src.updatedOn),
    ),
    forMember(
      (dest) => dest.complaint_identifier.park_guid,
      mapFrom((src) => src.parkGuid),
    ),
    forMember(
      (dest) => dest.complaint_identifier.complaint_type_code,
      mapFrom((src) => {
        const { type } = src;
        return type ? { complaint_type_code: type } : null;
      }),
    ),
  );
};

export const mapSectorComplaintDtoToSectorComplaint = (mapper: Mapper) => {
  createMap<SectorComplaintDto, Complaint>(
    mapper,
    "SectorComplaintDto",
    "Complaint",
    forMember(
      (dest) => dest.complaint_identifier,
      mapFrom((src) => src.id),
    ),
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
      (dest) => dest.reported_by_other_text,
      mapFrom((src) => src.reportedByOther),
    ),
    forMember(
      (dest) => dest.incident_utc_datetime,
      mapFrom((src) => src.incidentDateTime),
    ),
    forMember(
      (dest) => dest.incident_reported_utc_timestmp,
      mapFrom((src) => src.reportedOn),
    ),
    forMember(
      (dest) => dest.geo_organization_unit_code,
      mapFrom((src) => src.organization?.area || ""),
    ),
    forMember(
      (dest) => dest.app_user_complaint_xref,
      mapFrom((src) => {
        const { delegates } = src;
        if (!delegates || !Array.isArray(delegates)) {
          return [];
        }

        return delegates.map((delegate) => ({
          active_ind: delegate.isActive,
          app_user_guid: delegate.appUserGuid,
          app_user_complaint_xref_code: { app_user_complaint_xref_code: delegate.type },
        }));
      }),
    ),
    forMember(
      (dest) => dest.owned_by_agency_code_ref,
      mapFrom((src) => src.ownedBy),
    ),
    forMember(
      (dest) => dest.reported_by_code,
      mapFrom((src) => {
        const { reportedBy } = src ?? null;
        return reportedBy ? { reported_by_code: reportedBy } : null;
      }),
    ),
    forMember(
      (dest) => dest.complaint_status_code,
      mapFrom((src) => {
        const { status } = src;
        return { complaint_status_code: status };
      }),
    ),
    forMember(
      (dest) => dest.is_privacy_requested,
      mapFrom((src) => src.isPrivacyRequested),
    ),
    forMember(
      (dest) => dest.comp_last_upd_utc_timestamp,
      mapFrom((src) => src.updatedOn),
    ),
    forMember(
      (dest) => dest.park_guid,
      mapFrom((src) => src.parkGuid),
    ),
    forMember(
      (dest) => dest.complaint_type_code,
      mapFrom((src) => {
        const { type } = src;
        return type ? { complaint_type_code: type } : null;
      }),
    ),
  );
};

export const mapAttractantXrefDtoToAttractantHwcrXref = (mapper: Mapper) => {
  createMap<AttractantXrefDto, AttractantHwcrXref>(
    mapper,
    "AttractantXrefDto",
    "AttractantHwcrXref",
    forMember(
      (dest) => dest.active_ind,
      mapFrom((src) => src.isActive),
    ),
    forMember(
      (dest) => dest.attractant_code,
      mapFrom((src) => {
        const { attractant } = src;
        return { attractant_code: attractant, active_ind: src.isActive };
      }),
    ),
    forMember(
      (dest) => dest.attractant_hwcr_xref_guid,
      mapFrom((src) => src.xrefId),
    ),
  );
};
