import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";

//-- entities
import { AppUserComplaintXref } from "../../v1/app_user_complaint_xref/entities/app_user_complaint_xref.entity";
import { Complaint } from "../../v1/complaint/entities/complaint.entity";
import { SpeciesCode } from "../../v1/species_code/entities/species_code.entity";
import { HwcrComplaintNatureCode } from "../../v1/hwcr_complaint_nature_code/entities/hwcr_complaint_nature_code.entity";
import { AttractantCode } from "../../v1/attractant_code/entities/attractant_code.entity";
import { HwcrComplaint } from "../../v1/hwcr_complaint/entities/hwcr_complaint.entity";
import { AttractantHwcrXref } from "../../v1/attractant_hwcr_xref/entities/attractant_hwcr_xref.entity";
import { ViolationCode } from "../../v1/violation_code/entities/violation_code.entity";
import { AllegationComplaint } from "../../v1/allegation_complaint/entities/allegation_complaint.entity";
import { ReportedByCode } from "../../v1/reported_by_code/entities/reported_by_code.entity";
import { GirComplaint } from "../../v1/gir_complaint/entities/gir_complaint.entity";

//-- models (dto for now)
import {
  Agency,
  Attractant,
  GirType,
  NatureOfComplaint,
  ReportedBy,
  Species,
  Violation,
} from "../../types/models/code-tables";
import { DelegateDto } from "../../types/models/app_user/delegate";
import { ComplaintDto } from "../../types/models/complaints/dtos/complaint";
import { WildlifeComplaintDto } from "../../types/models/complaints/dtos/wildlife-complaint";
import { GeneralIncidentComplaintDto } from "../../types/models/complaints/dtos/gir-complaint";
import { SectorComplaintDto } from "../../types/models/complaints/dtos/sector-complaint";
import { AttractantXrefDto } from "../../types/models/complaints/attractant-ref";
import { AllegationComplaintDto } from "../../types/models/complaints/dtos/allegation-complaint";
import { format, toDate, toZonedTime } from "date-fns-tz";
import { GirTypeCode } from "../../v1/gir_type_code/entities/gir_type_code.entity";
import { AllegationReportData } from "../../types/models/reports/complaints/allegation-report-data";
import { WildlifeReportData } from "../../types/models/reports/complaints/wildlife-report-data";
import { formatPhonenumber } from "../../common/methods";
import { GeneralIncidentReportData } from "src/types/models/reports/complaints/general-incident-report-data";
// @SONAR_STOP@

//-- define entity -> model mapping
const appUserComplaintToDelegateDtoMap = (mapper: Mapper) => {
  createMap<AppUserComplaintXref, DelegateDto>(
    mapper,
    "AppUserComplaintXref",
    "Delegate",
    forMember(
      (destination) => destination.xrefId,
      mapFrom((source) => source.appUserComplaintXrefGuid),
    ),
    forMember(
      (destination) => destination.isActive,
      mapFrom((source) => source.active_ind),
    ),
    forMember(
      (destination) => destination.type,
      mapFrom((source) => source.app_user_complaint_xref_code.app_user_complaint_xref_code),
    ),
    forMember(
      (destination) => destination.appUserGuid,
      mapFrom((source) => source.app_user_guid),
    ),
  );
};

export const complaintToComplaintDtoMap = (mapper: Mapper) => {
  createMap<Complaint, ComplaintDto>(
    mapper,
    "Complaint", //-- source
    "ComplaintDto", //-- destination
    forMember(
      (destination) => destination.id,
      mapFrom((source) => source.complaint_identifier),
    ),
    forMember(
      (destination) => destination.details,
      mapFrom((source) => source.detail_text),
    ),
    forMember(
      (destination) => destination.name,
      mapFrom((source) => source.caller_name),
    ),
    forMember(
      (destination) => destination.address,
      mapFrom((source) => source.caller_address),
    ),
    forMember(
      (destination) => destination.email,
      mapFrom((source) => source.caller_email),
    ),
    forMember(
      (destination) => destination.phone1,
      mapFrom((source) => source.caller_phone_1),
    ),
    forMember(
      (destination) => destination.phone2,
      mapFrom((source) => source.caller_phone_2),
    ),
    forMember(
      (destination) => destination.phone3,
      mapFrom((source) => source.caller_phone_3),
    ),
    forMember(
      (destination) => destination.location,
      mapFrom((source) => {
        const {
          location_geometry_point: { type: locationType, coordinates },
        } = source;
        return { type: locationType, coordinates };
      }),
    ),
    forMember(
      (destination) => destination.locationSummary,
      mapFrom((source) => source.location_summary_text),
    ),
    forMember(
      (destination) => destination.locationDetail,
      mapFrom((source) => source.location_detailed_text),
    ),
    forMember(
      (destination) => destination.status,
      mapFrom((source) => {
        const {
          complaint_status_code: { complaint_status_code },
        } = source;
        return complaint_status_code;
      }),
    ),
    forMember(
      (destination) => destination.reportedBy,
      mapFrom((source) => {
        if (source.reported_by_code) {
          const {
            reported_by_code: { reported_by_code },
          } = source;
          return reported_by_code;
        } else {
          return "";
        }
      }),
    ),
    forMember(
      (destination) => destination.ownedBy,
      mapFrom((source) => source.owned_by_agency_code_ref),
    ),
    forMember(
      (destination) => destination.reportedByOther,
      mapFrom((source) => source.reported_by_other_text),
    ),
    forMember(
      (destination) => destination.incidentDateTime,
      mapFrom((source) => source.incident_utc_datetime),
    ),
    forMember(
      (destination) => destination.reportedOn,
      mapFrom((source) => source.incident_reported_utc_timestmp),
    ),
    forMember(
      (destination) => destination.updatedOn,
      mapFrom((source) => source.update_utc_timestamp),
    ),
    forMember(
      (destination) => destination.createdBy,
      mapFrom((source) => source.create_user_id),
    ),
    forMember(
      (destination) => destination.updatedBy,
      mapFrom((source) => source.update_user_id),
    ),
    forMember(
      (destination) => destination.organization,
      mapFrom((source) => {
        return {
          area: source.geo_organization_unit_code || "",
          areaName: "",
          zone: "",
          region: "",
          officeLocation: "",
        };
      }),
    ),
    forMember(
      (destination) => destination.delegates,
      mapFrom((source) => {
        const { app_user_complaint_xref: appUsers } = source;
        if (!appUsers || !Array.isArray(appUsers) || appUsers.length === 0) {
          return [];
        }
        const delegates = mapper.mapArray<AppUserComplaintXref, DelegateDto>(
          appUsers,
          "AppUserComplaintXref",
          "Delegate",
        );

        return delegates;
      }),
    ),
    forMember(
      (destination) => destination.webeocId,
      mapFrom((source) => source.webeoc_identifier),
    ),
    forMember(
      (destination) => destination.referenceNumber,
      mapFrom((source) => source.reference_number),
    ),
    forMember(
      (destination) => destination.complaintMethodReceivedCode,
      mapFrom((source) => {
        const xref = source.comp_mthd_recv_cd_agcy_cd_xref;
        if (xref) {
          const { complaint_method_received_code } = xref;
          if (complaint_method_received_code) {
            return complaint_method_received_code.complaint_method_received_code;
          }
        }
        return null;
      }),
    ),
    forMember(
      (destination) => destination.isPrivacyRequested,
      mapFrom((source) => source.is_privacy_requested),
    ),
    forMember(
      (destination) => destination.updatedOn,
      mapFrom((source) => source.comp_last_upd_utc_timestamp),
    ),
    forMember(
      (destination) => destination.parkGuid,
      mapFrom((source) => source.park_guid),
    ),
    forMember(
      (destination) => destination.type,
      mapFrom((source) => {
        if (!source.complaint_type_code) {
          return null;
        }
        const {
          complaint_type_code: { complaint_type_code },
        } = source;
        return complaint_type_code;
      }),
    ),
  );
};

const speciesCodeToSpeciesDtoMap = (mapper: Mapper) => {
  createMap<SpeciesCode, Species>(
    mapper,
    "SpeciesCode",
    "SpeciesDto",
    forMember(
      (destination) => destination.species,
      mapFrom((source) => source.species_code),
    ),
    forMember(
      (destination) => destination.legacy,
      mapFrom((source) => source.legacy_code),
    ),
    forMember(
      (destination) => destination.shortDescription,
      mapFrom((source) => source.short_description),
    ),
    forMember(
      (destination) => destination.longDescription,
      mapFrom((source) => source.long_description),
    ),
    forMember(
      (destination) => destination.isActive,
      mapFrom((source) => source.active_ind),
    ),
    forMember(
      (destination) => destination.displayOrder,
      mapFrom((source) => source.display_order),
    ),
  );
};

const natureOfComplaintCodeToNatureOfComplaintDtoMap = (mapper: Mapper) => {
  createMap<HwcrComplaintNatureCode, NatureOfComplaint>(
    mapper,
    "NatureOfComplaintCode",
    "NatureOfComplaintDto",
    forMember(
      (destination) => destination.natureOfComplaint,
      mapFrom((source) => source.hwcr_complaint_nature_code),
    ),
    forMember(
      (destination) => destination.shortDescription,
      mapFrom((source) => source.short_description),
    ),
    forMember(
      (destination) => destination.longDescription,
      mapFrom((source) => source.long_description),
    ),
    forMember(
      (destination) => destination.displayOrder,
      mapFrom((source) => source.display_order),
    ),
    forMember(
      (destination) => destination.isActive,
      mapFrom((source) => source.active_ind),
    ),
  );
};

const attractantCodeToAttractantDtoMap = (mapper: Mapper) => {
  createMap<AttractantCode, Attractant>(
    mapper,
    "AttractantCode",
    "AttractantDto",
    forMember(
      (destination) => destination.attractant,
      mapFrom((source) => source.attractant_code),
    ),
    forMember(
      (destination) => destination.shortDescription,
      mapFrom((source) => source.short_description),
    ),
    forMember(
      (destination) => destination.longDescription,
      mapFrom((source) => source.long_description),
    ),
    forMember(
      (destination) => destination.displayOrder,
      mapFrom((source) => source.display_order),
    ),
    forMember(
      (destination) => destination.isActive,
      mapFrom((source) => source.active_ind),
    ),
  );
};

const reportedByCodeToReportedByDto = (mapper: Mapper) => {
  createMap<ReportedByCode, ReportedBy>(
    mapper,
    "ReportedByCode",
    "ReportedByCodeDto",
    forMember(
      (destination) => destination.reportedBy,
      mapFrom((source) => {
        return source.reported_by_code;
      }),
    ),
    forMember(
      (destination) => destination.shortDescription,
      mapFrom((source) => source.short_description),
    ),
    forMember(
      (destination) => destination.longDescription,
      mapFrom((source) => source.long_description),
    ),
    forMember(
      (destination) => destination.displayOrder,
      mapFrom((source) => source.display_order),
    ),
    forMember(
      (destination) => destination.isActive,
      mapFrom((source) => source.active_ind),
    ),
  );
};

const attractantXrefToAttractantXrefDto = (mapper: Mapper) => {
  createMap<AttractantHwcrXref, AttractantXrefDto>(
    mapper,
    "AttractantXref",
    "AttractantXrefDto",
    forMember(
      (destination) => destination.xrefId,
      mapFrom((source) => source.attractant_hwcr_xref_guid),
    ),
    forMember(
      (destination) => destination.attractant,
      mapFrom((src) => {
        const item = mapper.map<AttractantCode, Attractant>(src.attractant_code, "AttractantCode", "AttractantDto");
        return item.attractant;
      }),
    ),
    forMember(
      (destination) => destination.isActive,
      mapFrom((source) => source.active_ind),
    ),
  );
};

const violationCodeToViolationDto = (mapper: Mapper) => {
  createMap<ViolationCode, Violation>(
    mapper,
    "ViolationCode",
    "ViolationCodeDto",
    forMember(
      (destination) => destination.violation,
      mapFrom((source) => source.violation_code),
    ),
    forMember(
      (destination) => destination.shortDescription,
      mapFrom((source) => source.short_description),
    ),
    forMember(
      (destination) => destination.longDescription,
      mapFrom((source) => source.long_description),
    ),
    forMember(
      (destination) => destination.displayOrder,
      mapFrom((source) => source.display_order),
    ),
    forMember(
      (destination) => destination.isActive,
      mapFrom((source) => source.active_ind),
    ),
  );
};

export const applyWildlifeComplaintMap = (mapper: Mapper) => {
  speciesCodeToSpeciesDtoMap(mapper);
  natureOfComplaintCodeToNatureOfComplaintDtoMap(mapper);
  attractantCodeToAttractantDtoMap(mapper);
  attractantXrefToAttractantXrefDto(mapper);
  appUserComplaintToDelegateDtoMap(mapper);
  reportedByCodeToReportedByDto(mapper);

  createMap<HwcrComplaint, WildlifeComplaintDto>(
    mapper,
    "HwcrComplaint",
    "WildlifeComplaintDto",
    forMember(
      (destination) => destination.id,
      mapFrom((source) => source.complaint_identifier.complaint_identifier),
    ),
    forMember(
      (destination) => destination.details,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.detail_text !== null ? complaint.detail_text : "";
      }),
    ),
    forMember(
      (destination) => destination.name,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_name !== null ? complaint.caller_name : "";
      }),
    ),
    forMember(
      (destination) => destination.address,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_address !== null ? complaint.caller_address : "";
      }),
    ),
    forMember(
      (destination) => destination.email,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_email !== null ? complaint.caller_email : "";
      }),
    ),
    forMember(
      (destination) => destination.phone1,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_phone_1 !== null ? complaint.caller_phone_1 : "";
      }),
    ),
    forMember(
      (destination) => destination.phone2,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_phone_2 !== null ? complaint.caller_phone_2 : "";
      }),
    ),
    forMember(
      (destination) => destination.phone3,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_phone_3 !== null ? complaint.caller_phone_3 : "";
      }),
    ),
    forMember(
      (destination) => destination.location,
      mapFrom((source) => {
        const {
          complaint_identifier: {
            location_geometry_point: { type: locationType, coordinates },
          },
        } = source;
        return { type: locationType, coordinates };
      }),
    ),
    forMember(
      (destination) => destination.locationSummary,
      mapFrom((source) => source.complaint_identifier.location_summary_text),
    ),
    forMember(
      (destination) => destination.locationDetail,
      mapFrom((source) => source.complaint_identifier.location_detailed_text),
    ),
    forMember(
      (destination) => destination.status,
      mapFrom((source) => {
        const {
          complaint_identifier: {
            complaint_status_code: { complaint_status_code },
          },
        } = source;
        return complaint_status_code;
      }),
    ),
    forMember(
      (destination) => destination.reportedBy,
      mapFrom((source) => {
        const {
          complaint_identifier: { reported_by_code: reported_by },
        } = source;
        if (reported_by) {
          const code = mapper.map<ReportedByCode, ReportedBy>(reported_by, "ReportedByCode", "ReportedByCodeDto");
          return code.reportedBy;
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.ownedBy,
      mapFrom((source) => source.complaint_identifier.owned_by_agency_code_ref),
    ),
    forMember(
      (destination) => destination.reportedByOther,
      mapFrom((source) => source.complaint_identifier.reported_by_other_text),
    ),
    forMember(
      (destination) => destination.incidentDateTime,
      mapFrom((source) => source.complaint_identifier.incident_utc_datetime),
    ),
    forMember(
      (destination) => destination.reportedOn,
      mapFrom((source) => source.complaint_identifier.incident_reported_utc_timestmp),
    ),
    forMember(
      (destination) => destination.updatedOn,
      mapFrom((source) => source.complaint_identifier.update_utc_timestamp),
    ),
    forMember(
      (destination) => destination.createdBy,
      mapFrom((source) => source.create_user_id),
    ),
    forMember(
      (destination) => destination.updatedBy,
      mapFrom((source) => source.update_user_id),
    ),
    forMember(
      (destination) => destination.organization,
      mapFrom((source) => {
        return {
          area: source.complaint_identifier.geo_organization_unit_code || "",
          areaName: "",
          zone: "",
          region: "",
          officeLocation: "",
        };
      }),
    ),
    forMember(
      (destination) => destination.delegates,
      mapFrom((source) => {
        const {
          complaint_identifier: { app_user_complaint_xref: appUsers },
        } = source;

        if (!appUsers || !Array.isArray(appUsers) || appUsers.length === 0) {
          return [];
        }

        const delegates = mapper.mapArray<AppUserComplaintXref, DelegateDto>(
          appUsers,
          "AppUserComplaintXref",
          "Delegate",
        );

        return delegates;
      }),
    ),
    forMember(
      (destination) => destination.hwcrId,
      mapFrom((src) => src.hwcr_complaint_guid),
    ),
    forMember(
      (destination) => destination.attractants,
      mapFrom((src) => {
        if (src.attractant_hwcr_xref !== null) {
          return mapper.mapArray<AttractantHwcrXref, AttractantXrefDto>(
            src.attractant_hwcr_xref,
            "AttractantXref",
            "AttractantXrefDto",
          );
        }

        return [];
      }),
    ),
    forMember(
      (destination) => destination.otherAttractants,
      mapFrom((src) => {
        if (src.other_attractants_text !== null) {
          return src.other_attractants_text;
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.species,
      mapFrom((src) => {
        const item = mapper.map<SpeciesCode, Species>(src.species_code, "SpeciesCode", "SpeciesDto");
        if (item !== null) {
          return item.species;
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.isLargeCarnivore,
      mapFrom((src) => src.species_code.large_carnivore_ind),
    ),
    forMember(
      (destination) => destination.natureOfComplaint,
      mapFrom((src) => {
        const item = mapper.map<HwcrComplaintNatureCode, NatureOfComplaint>(
          src.hwcr_complaint_nature_code,
          "NatureOfComplaintCode",
          "NatureOfComplaintDto",
        );
        if (item !== null) {
          return item.natureOfComplaint;
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.webeocId,
      mapFrom((source) => source.complaint_identifier.webeoc_identifier),
    ),
    forMember(
      (destination) => destination.referenceNumber,
      mapFrom((source) => source.complaint_identifier.reference_number),
    ),
    forMember(
      (destination) => destination.complaintMethodReceivedCode,
      mapFrom((source) => {
        const complaintIdentifier = source.complaint_identifier;
        const xref = complaintIdentifier?.comp_mthd_recv_cd_agcy_cd_xref;

        if (xref) {
          const { complaint_method_received_code } = xref;
          return complaint_method_received_code?.complaint_method_received_code ?? null;
        }

        return null;
      }),
    ),
    forMember(
      (destination) => destination.isPrivacyRequested,
      mapFrom((source) => source.complaint_identifier.is_privacy_requested),
    ),
    forMember(
      (destination) => destination.updatedOn,
      mapFrom((source) => source.complaint_identifier.comp_last_upd_utc_timestamp),
    ),
    forMember(
      (destination) => destination.parkGuid,
      mapFrom((source) => source.complaint_identifier.park_guid),
    ),
    forMember(
      (destination) => destination.type,
      mapFrom((source) => {
        if (!source.complaint_identifier.complaint_type_code) {
          return null;
        }
        const {
          complaint_identifier: {
            complaint_type_code: { complaint_type_code },
          },
        } = source;
        return complaint_type_code;
      }),
    ),
  );
};

export const applyAllegationComplaintMap = (mapper: Mapper) => {
  violationCodeToViolationDto(mapper);
  appUserComplaintToDelegateDtoMap(mapper);
  reportedByCodeToReportedByDto(mapper);

  createMap<AllegationComplaint, AllegationComplaintDto>(
    mapper,
    "AllegationComplaint",
    "AllegationComplaintDto",
    forMember(
      (destination) => destination.id,
      mapFrom((source) => source.complaint_identifier.complaint_identifier),
    ),
    forMember(
      (destination) => destination.details,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.detail_text !== null ? complaint.detail_text : "";
      }),
    ),
    forMember(
      (destination) => destination.name,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_name !== null ? complaint.caller_name : "";
      }),
    ),
    forMember(
      (destination) => destination.address,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_address !== null ? complaint.caller_address : "";
      }),
    ),
    forMember(
      (destination) => destination.email,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_email !== null ? complaint.caller_email : "";
      }),
    ),
    forMember(
      (destination) => destination.phone1,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_phone_1 !== null ? complaint.caller_phone_1 : "";
      }),
    ),
    forMember(
      (destination) => destination.phone2,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_phone_2 !== null ? complaint.caller_phone_2 : "";
      }),
    ),
    forMember(
      (destination) => destination.phone3,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_phone_3 !== null ? complaint.caller_phone_3 : "";
      }),
    ),
    forMember(
      (destination) => destination.location,
      mapFrom((source) => {
        const {
          complaint_identifier: {
            location_geometry_point: { type: locationType, coordinates },
          },
        } = source;
        return { type: locationType, coordinates };
      }),
    ),
    forMember(
      (destination) => destination.locationSummary,
      mapFrom((source) => source.complaint_identifier.location_summary_text),
    ),
    forMember(
      (destination) => destination.locationDetail,
      mapFrom((source) => source.complaint_identifier.location_detailed_text),
    ),
    forMember(
      (destination) => destination.status,
      mapFrom((source) => {
        const {
          complaint_identifier: {
            complaint_status_code: { complaint_status_code },
          },
        } = source;
        return complaint_status_code;
      }),
    ),
    forMember(
      (destination) => destination.reportedBy,
      mapFrom((source) => {
        const {
          complaint_identifier: { reported_by_code: reportedBy },
        } = source;
        if (reportedBy) {
          const code = mapper.map<ReportedByCode, ReportedBy>(reportedBy, "ReportedByCode", "ReportedByCodeDto");
          return code.reportedBy;
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.ownedBy,
      mapFrom((source) => source.complaint_identifier.owned_by_agency_code_ref),
    ),
    forMember(
      (destination) => destination.reportedByOther,
      mapFrom((source) => source.complaint_identifier.reported_by_other_text),
    ),
    forMember(
      (destination) => destination.incidentDateTime,
      mapFrom((source) => source.complaint_identifier.incident_utc_datetime),
    ),
    forMember(
      (destination) => destination.reportedOn,
      mapFrom((source) => source.complaint_identifier.incident_reported_utc_timestmp),
    ),
    forMember(
      (destination) => destination.updatedOn,
      mapFrom((source) => source.update_utc_timestamp),
    ),
    forMember(
      (destination) => destination.createdBy,
      mapFrom((source) => source.create_user_id),
    ),
    forMember(
      (destination) => destination.updatedBy,
      mapFrom((source) => source.update_user_id),
    ),
    forMember(
      (destination) => destination.organization,
      mapFrom((source) => {
        return {
          area: source.complaint_identifier.geo_organization_unit_code || "",
          areaName: "",
          zone: "",
          region: "",
          officeLocation: "",
        };
      }),
    ),
    forMember(
      (destination) => destination.delegates,
      mapFrom((source) => {
        const {
          complaint_identifier: { app_user_complaint_xref: appUsers },
        } = source;

        if (!appUsers || !Array.isArray(appUsers) || appUsers.length === 0) {
          return [];
        }

        const delegates = mapper.mapArray<AppUserComplaintXref, DelegateDto>(
          appUsers,
          "AppUserComplaintXref",
          "Delegate",
        );

        return delegates;
      }),
    ),
    forMember(
      (destination) => destination.ersId,
      mapFrom((src) => src.allegation_complaint_guid),
    ),
    forMember(
      (destination) => destination.violation,
      mapFrom((src) => {
        const item = mapper.map<ViolationCode, Violation>(src.violation_code, "ViolationCode", "ViolationCodeDto");
        if (item !== null) {
          return item.violation;
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.isInProgress,
      mapFrom((src) => src.in_progress_ind),
    ),
    forMember(
      (destination) => destination.wasObserved,
      mapFrom((src) => src.observed_ind),
    ),
    forMember(
      (destination) => destination.violationDetails,
      mapFrom((src) => src.suspect_witnesss_dtl_text),
    ),
    forMember(
      (destination) => destination.webeocId,
      mapFrom((source) => source.complaint_identifier.webeoc_identifier),
    ),
    forMember(
      (destination) => destination.referenceNumber,
      mapFrom((source) => source.complaint_identifier.reference_number),
    ),
    forMember(
      (destination) => destination.complaintMethodReceivedCode,
      mapFrom((source) => {
        const { complaint_identifier } = source;
        const { comp_mthd_recv_cd_agcy_cd_xref } = complaint_identifier || {};

        if (comp_mthd_recv_cd_agcy_cd_xref) {
          const { complaint_method_received_code } = comp_mthd_recv_cd_agcy_cd_xref;
          return complaint_method_received_code?.complaint_method_received_code ?? null;
        }

        return null;
      }),
    ),
    forMember(
      (destination) => destination.isPrivacyRequested,
      mapFrom((source) => source.complaint_identifier.is_privacy_requested),
    ),
    forMember(
      (destination) => destination.updatedOn,
      mapFrom((source) => source.complaint_identifier.comp_last_upd_utc_timestamp),
    ),
    forMember(
      (destination) => destination.parkGuid,
      mapFrom((source) => source.complaint_identifier.park_guid),
    ),
    forMember(
      (destination) => destination.type,
      mapFrom((source) => {
        if (!source.complaint_identifier.complaint_type_code) {
          return null;
        }
        const {
          complaint_identifier: {
            complaint_type_code: { complaint_type_code },
          },
        } = source;
        return complaint_type_code;
      }),
    ),
  );
};

export const applyGeneralInfomationComplaintMap = (mapper: Mapper) => {
  violationCodeToViolationDto(mapper);
  appUserComplaintToDelegateDtoMap(mapper);
  reportedByCodeToReportedByDto(mapper);
  girTypeCodeToGirTypeCodeDto(mapper);

  createMap<GirComplaint, GeneralIncidentComplaintDto>(
    mapper,
    "GirComplaint",
    "GeneralIncidentComplaintDto",
    forMember(
      (destination) => destination.id,
      mapFrom((source) => source.complaint_identifier.complaint_identifier),
    ),
    forMember(
      (destination) => destination.details,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.detail_text !== null ? complaint.detail_text : "";
      }),
    ),
    forMember(
      (destination) => destination.name,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_name !== null ? complaint.caller_name : "";
      }),
    ),
    forMember(
      (destination) => destination.address,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_address !== null ? complaint.caller_address : "";
      }),
    ),
    forMember(
      (destination) => destination.email,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_email !== null ? complaint.caller_email : "";
      }),
    ),
    forMember(
      (destination) => destination.phone1,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_phone_1 !== null ? complaint.caller_phone_1 : "";
      }),
    ),
    forMember(
      (destination) => destination.phone2,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_phone_2 !== null ? complaint.caller_phone_2 : "";
      }),
    ),
    forMember(
      (destination) => destination.phone3,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_phone_3 !== null ? complaint.caller_phone_3 : "";
      }),
    ),
    forMember(
      (destination) => destination.location,
      mapFrom((source) => {
        const {
          complaint_identifier: {
            location_geometry_point: { type: locationType, coordinates },
          },
        } = source;
        return { type: locationType, coordinates };
      }),
    ),
    forMember(
      (destination) => destination.locationSummary,
      mapFrom((source) => source.complaint_identifier.location_summary_text),
    ),
    forMember(
      (destination) => destination.locationDetail,
      mapFrom((source) => source.complaint_identifier.location_detailed_text),
    ),
    forMember(
      (destination) => destination.status,
      mapFrom((source) => {
        const {
          complaint_identifier: {
            complaint_status_code: { complaint_status_code },
          },
        } = source;
        return complaint_status_code;
      }),
    ),
    forMember(
      (destination) => destination.reportedBy,
      mapFrom((source) => {
        const {
          complaint_identifier: { reported_by_code: reportedBy },
        } = source;
        if (reportedBy) {
          const code = mapper.map<ReportedByCode, ReportedBy>(reportedBy, "ReportedByCode", "ReportedByCodeDto");
          return code.reportedBy;
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.ownedBy,
      mapFrom((source) => source.complaint_identifier.owned_by_agency_code_ref),
    ),
    forMember(
      (destination) => destination.reportedByOther,
      mapFrom((source) => source.complaint_identifier.reported_by_other_text),
    ),
    forMember(
      (destination) => destination.incidentDateTime,
      mapFrom((source) => source.complaint_identifier.incident_utc_datetime),
    ),
    forMember(
      (destination) => destination.reportedOn,
      mapFrom((source) => source.complaint_identifier.incident_reported_utc_timestmp),
    ),
    forMember(
      (destination) => destination.updatedOn,
      mapFrom((source) => source.update_utc_timestamp),
    ),
    forMember(
      (destination) => destination.createdBy,
      mapFrom((source) => source.create_user_id),
    ),
    forMember(
      (destination) => destination.updatedBy,
      mapFrom((source) => source.update_user_id),
    ),
    forMember(
      (destination) => destination.organization,
      mapFrom((source) => {
        return {
          area: source.complaint_identifier.geo_organization_unit_code || "",
          areaName: "",
          zone: "",
          region: "",
          officeLocation: "",
        };
      }),
    ),
    forMember(
      (destination) => destination.delegates,
      mapFrom((source) => {
        const {
          complaint_identifier: { app_user_complaint_xref: appUsers },
        } = source;

        if (!appUsers || !Array.isArray(appUsers) || appUsers.length === 0) {
          return [];
        }

        const delegates = mapper.mapArray<AppUserComplaintXref, DelegateDto>(
          appUsers,
          "AppUserComplaintXref",
          "Delegate",
        );

        return delegates;
      }),
    ),
    forMember(
      (destination) => destination.girId,
      mapFrom((src) => src.gir_complaint_guid),
    ),
    forMember(
      (destination) => destination.girType,
      mapFrom((src) => {
        const item = mapper.map<GirTypeCode, GirType>(src.gir_type_code, "GirTypeCode", "GirTypeCodeDto");
        if (item !== null) {
          return item.girType;
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.complaintMethodReceivedCode,
      mapFrom((source) => {
        const { comp_mthd_recv_cd_agcy_cd_xref } = source.complaint_identifier || {};

        const { complaint_method_received_code } = comp_mthd_recv_cd_agcy_cd_xref || {};

        return complaint_method_received_code?.complaint_method_received_code ?? null;
      }),
    ),
    forMember(
      (destination) => destination.isPrivacyRequested,
      mapFrom((source) => source.complaint_identifier.is_privacy_requested),
    ),
    forMember(
      (destination) => destination.updatedOn,
      mapFrom((source) => source.complaint_identifier.comp_last_upd_utc_timestamp),
    ),
    forMember(
      (destination) => destination.parkGuid,
      mapFrom((source) => source.complaint_identifier.park_guid),
    ),
    forMember(
      (destination) => destination.type,
      mapFrom((source) => {
        if (!source.complaint_identifier.complaint_type_code) {
          return null;
        }
        const {
          complaint_identifier: {
            complaint_type_code: { complaint_type_code },
          },
        } = source;
        return complaint_type_code;
      }),
    ),
  );
};

export const applySectorComplaintMap = (mapper: Mapper) => {
  violationCodeToViolationDto(mapper);
  appUserComplaintToDelegateDtoMap(mapper);
  reportedByCodeToReportedByDto(mapper);

  createMap<Complaint, SectorComplaintDto>(
    mapper,
    "Complaint",
    "SectorComplaintDto",
    forMember(
      (destination) => destination.id,
      mapFrom((source) => source.complaint_identifier),
    ),
    forMember(
      (destination) => destination.details,
      mapFrom((source) => {
        return source.detail_text !== null ? source.detail_text : "";
      }),
    ),
    forMember(
      (destination) => destination.name,
      mapFrom((source) => {
        return source.caller_name !== null ? source.caller_name : "";
      }),
    ),
    forMember(
      (destination) => destination.address,
      mapFrom((source) => {
        return source.caller_address !== null ? source.caller_address : "";
      }),
    ),
    forMember(
      (destination) => destination.email,
      mapFrom((source) => {
        return source.caller_email !== null ? source.caller_email : "";
      }),
    ),
    forMember(
      (destination) => destination.phone1,
      mapFrom((source) => {
        return source.caller_phone_1 !== null ? source.caller_phone_1 : "";
      }),
    ),
    forMember(
      (destination) => destination.phone2,
      mapFrom((source) => {
        return source.caller_phone_2 !== null ? source.caller_phone_2 : "";
      }),
    ),
    forMember(
      (destination) => destination.phone3,
      mapFrom((source) => {
        return source.caller_phone_3 !== null ? source.caller_phone_3 : "";
      }),
    ),
    forMember(
      (destination) => destination.location,
      mapFrom((source) => {
        const {
          location_geometry_point: { type: locationType, coordinates },
        } = source;
        return { type: locationType, coordinates };
      }),
    ),
    forMember(
      (destination) => destination.locationSummary,
      mapFrom((source) => source.location_summary_text),
    ),
    forMember(
      (destination) => destination.locationDetail,
      mapFrom((source) => source.location_detailed_text),
    ),
    forMember(
      (destination) => destination.status,
      mapFrom((source) => {
        const {
          complaint_status_code: { complaint_status_code },
        } = source;
        return complaint_status_code;
      }),
    ),
    forMember(
      (destination) => destination.reportedBy,
      mapFrom((source) => {
        const { reported_by_code: reportedBy } = source;
        if (reportedBy) {
          const code = mapper.map<ReportedByCode, ReportedBy>(reportedBy, "ReportedByCode", "ReportedByCodeDto");
          return code.reportedBy;
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.ownedBy,
      mapFrom((source) => source.owned_by_agency_code_ref),
    ),
    forMember(
      (destination) => destination.reportedByOther,
      mapFrom((source) => source.reported_by_other_text),
    ),
    forMember(
      (destination) => destination.incidentDateTime,
      mapFrom((source) => source.incident_utc_datetime),
    ),
    forMember(
      (destination) => destination.reportedOn,
      mapFrom((source) => source.incident_reported_utc_timestmp),
    ),
    forMember(
      (destination) => destination.updatedOn,
      mapFrom((source) => source.update_utc_timestamp),
    ),
    forMember(
      (destination) => destination.createdBy,
      mapFrom((source) => source.create_user_id),
    ),
    forMember(
      (destination) => destination.updatedBy,
      mapFrom((source) => source.update_user_id),
    ),
    forMember(
      (destination) => destination.organization,
      mapFrom((source) => {
        return {
          area: source.geo_organization_unit_code || "",
          areaName: "",
          zone: "",
          region: "",
          officeLocation: "",
        };
      }),
    ),
    forMember(
      (destination) => destination.delegates,
      mapFrom((source) => {
        const { app_user_complaint_xref: appUsers } = source;

        if (!appUsers || !Array.isArray(appUsers) || appUsers.length === 0) {
          return [];
        }

        const delegates = mapper.mapArray<AppUserComplaintXref, DelegateDto>(
          appUsers,
          "AppUserComplaintXref",
          "Delegate",
        );

        return delegates;
      }),
    ),
    forMember(
      (destination) => destination.complaintMethodReceivedCode,
      mapFrom((source) => {
        const { comp_mthd_recv_cd_agcy_cd_xref } = source ?? {};

        const { complaint_method_received_code } = comp_mthd_recv_cd_agcy_cd_xref ?? {};

        return complaint_method_received_code?.complaint_method_received_code ?? null;
      }),
    ),
    forMember(
      (destination) => destination.isPrivacyRequested,
      mapFrom((source) => source.is_privacy_requested),
    ),
    forMember(
      (destination) => destination.updatedOn,
      mapFrom((source) => source.comp_last_upd_utc_timestamp),
    ),
    forMember(
      (destination) => destination.parkGuid,
      mapFrom((source) => source.park_guid),
    ),
    forMember(
      (destination) => destination.type,
      mapFrom((source) => {
        if (!source.complaint_type_code) {
          return null;
        }
        const {
          complaint_type_code: { complaint_type_code },
        } = source;
        return complaint_type_code;
      }),
    ),
    forMember(
      (destination) => destination.issueType,
      mapFrom(() => ""),
    ),
    forMember(
      (destination) => destination.referralAgency,
      mapFrom(() => []),
    ),
  );
};

const girTypeCodeToGirTypeCodeDto = (mapper: Mapper) => {
  createMap<GirTypeCode, GirType>(
    mapper,
    "GirTypeCode",
    "GirTypeCodeDto",
    forMember(
      (destination) => destination.girType,
      mapFrom((source) => source.gir_type_code),
    ),
  );
};

//-- reporting data maps
export const mapWildlifeReport = (mapper: Mapper, tz: string = "America/Vancouver") => {
  const reportGeneratedOn: Date = new Date();

  speciesCodeToSpeciesDtoMap(mapper);
  natureOfComplaintCodeToNatureOfComplaintDtoMap(mapper);
  attractantCodeToAttractantDtoMap(mapper);
  attractantXrefToAttractantXrefDto(mapper);
  appUserComplaintToDelegateDtoMap(mapper);
  reportedByCodeToReportedByDto(mapper);

  createMap<HwcrComplaint, WildlifeReportData>(
    mapper,
    "HwcrComplaint",
    "WildlifeReportData",

    forMember(
      (destination) => destination.id,
      mapFrom((source) => source.complaint_identifier.complaint_identifier),
    ),
    forMember(
      (destination) => destination.createdBy,
      mapFrom((source) => source.create_user_id),
    ),
    forMember(
      (destination) => destination.ownedBy,
      mapFrom((source) => source.complaint_identifier.owned_by_agency_code_ref),
    ),
    forMember(
      (destination) => destination.reportedOn,
      mapFrom((source) => {
        const {
          complaint_identifier: { incident_reported_utc_timestmp: reported },
        } = source;
        return reported || "";
      }),
    ),
    forMember(
      (destination) => destination.updatedOn,
      mapFrom((source) => source.complaint_identifier.update_utc_timestamp),
    ),
    forMember(
      (destination) => destination.officerAssigned,
      mapFrom((source) => {
        const {
          complaint_identifier: { app_user_complaint_xref: appUsers },
        } = source;

        const delegates = mapper.mapArray<AppUserComplaintXref, DelegateDto>(
          appUsers,
          "AppUserComplaintXref",
          "Delegate",
        );

        if (delegates.length === 0) {
          return "Not Assigned";
        } else {
          const assignee = delegates.find((item) => item.type === "ASSIGNEE");
          if (!assignee) {
            return "Not Assigned";
          } else {
            return assignee.appUserGuid || "Not Assigned";
          }
        }
      }),
    ),

    forMember(
      (destination) => destination.status,
      mapFrom((source) => {
        return source.complaint_identifier.complaint_status_code.short_description;
      }),
    ),
    forMember(
      (destination) => destination.incidentDateTime,
      mapFrom((source) => source.complaint_identifier.incident_utc_datetime),
    ),
    forMember(
      (destination) => destination.location,
      mapFrom((source) => source.complaint_identifier.location_summary_text),
    ),
    forMember(
      (destination) => destination.latitude,
      mapFrom((source) => {
        const {
          complaint_identifier: {
            location_geometry_point: { coordinates },
          },
        } = source;
        return coordinates[1].toString();
      }),
    ),
    forMember(
      (destination) => destination.longitude,
      mapFrom((source) => {
        const {
          complaint_identifier: {
            location_geometry_point: { coordinates },
          },
        } = source;
        return coordinates[0].toString();
      }),
    ),

    forMember(
      (destination) => destination.community,
      mapFrom((source) => {
        return "";
      }),
    ),
    forMember(
      (destination) => destination.office,
      mapFrom((source) => {
        return "";
      }),
    ),
    forMember(
      (destination) => destination.zone,
      mapFrom((source) => {
        return source.complaint_identifier.geo_organization_unit_code || "";
      }),
    ),
    forMember(
      (destination) => destination.region,
      mapFrom((source) => {
        return "";
      }),
    ),
    forMember(
      (destination) => destination.locationDescription,
      mapFrom((source) => source.complaint_identifier.location_detailed_text),
    ),
    forMember(
      (destination) => destination.description,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.detail_text !== null ? complaint.detail_text : "";
      }),
    ),
    forMember(
      (destination) => destination.name,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_name !== null ? complaint.caller_name : "";
      }),
    ),
    forMember(
      (destination) => destination.phone1,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        const { caller_phone_1: phone } = complaint;

        try {
          if (phone) {
            return formatPhonenumber(phone);
          }
        } catch (error) {
          return phone;
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.phone2,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        const { caller_phone_2: phone } = complaint;

        try {
          if (phone) {
            return formatPhonenumber(phone);
          }
        } catch (error) {
          return phone;
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.phone3,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        const { caller_phone_3: phone } = complaint;

        try {
          if (phone) {
            return formatPhonenumber(phone);
          }
        } catch (error) {
          return phone;
        }
        return "";
      }),
    ),
    forMember(
      (destination) => destination.email,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_email !== null ? complaint.caller_email : "";
      }),
    ),
    forMember(
      (destination) => destination.address,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_address !== null ? complaint.caller_address : "";
      }),
    ),
    forMember(
      (destination) => destination.reportedBy,
      mapFrom((source) => {
        const {
          complaint_identifier: { reported_by_code: reported_by },
        } = source;
        if (reported_by) {
          const code = mapper.map<ReportedByCode, ReportedBy>(reported_by, "ReportedByCode", "ReportedByCodeDto");
          return code.longDescription;
        }

        return "";
      }),
    ),

    //--
    forMember(
      (destination) => destination.species,
      mapFrom((src) => {
        const item = mapper.map<SpeciesCode, Species>(src.species_code, "SpeciesCode", "SpeciesDto");
        if (item !== null) {
          return item.longDescription;
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.natureOfComplaint,
      mapFrom((src) => {
        const item = mapper.map<HwcrComplaintNatureCode, NatureOfComplaint>(
          src.hwcr_complaint_nature_code,
          "NatureOfComplaintCode",
          "NatureOfComplaintDto",
        );
        if (item !== null) {
          return item.longDescription;
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.attractants,
      mapFrom((src) => {
        if (src.attractant_hwcr_xref !== null) {
          const attractants = src.attractant_hwcr_xref.map((item) => item.attractant_code.short_description);

          return attractants.map((item) => item).join();
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.webeocId,
      mapFrom((source) => source.complaint_identifier.webeoc_identifier),
    ),
    forMember(
      (destination) => destination.referenceNumber,
      mapFrom((source) => source.complaint_identifier.reference_number),
    ),
    forMember(
      (destination) => destination.linkedComplaintIdentifier,
      mapFrom((source) => {
        const {
          complaint_identifier: { linked_complaint_xref: linkedComplaints },
        } = source;
        return linkedComplaints[0]?.complaint_id;
      }),
    ),
    forMember(
      (destination) => destination.complaintMethodReceivedCode,
      mapFrom((source) => {
        const { complaint_identifier } = source;
        const { comp_mthd_recv_cd_agcy_cd_xref } = complaint_identifier || {};

        if (comp_mthd_recv_cd_agcy_cd_xref) {
          const { complaint_method_received_code } = comp_mthd_recv_cd_agcy_cd_xref;
          return complaint_method_received_code?.long_description || null;
        }

        return null;
      }),
    ),
    forMember(
      (destination) => destination.parkGuid,
      mapFrom((source) => source.complaint_identifier.park_guid),
    ),
    forMember(
      (destination) => destination.type,
      mapFrom((source) => {
        if (!source.complaint_identifier.complaint_type_code) {
          return null;
        }
        const {
          complaint_identifier: {
            complaint_type_code: { complaint_type_code },
          },
        } = source;
        return complaint_type_code;
      }),
    ),
  );
};

export const mapAllegationReport = (mapper: Mapper, tz: string = "America/Vancouver") => {
  const reportGeneratedOn: Date = new Date();

  violationCodeToViolationDto(mapper);
  appUserComplaintToDelegateDtoMap(mapper);
  reportedByCodeToReportedByDto(mapper);

  createMap<AllegationComplaint, AllegationReportData>(
    mapper,
    "AllegationComplaint",
    "AllegationReportData",

    forMember(
      (destination) => destination.id,
      mapFrom((source) => source.complaint_identifier.complaint_identifier),
    ),
    forMember(
      (destination) => destination.createdBy,
      mapFrom((source) => source.create_user_id),
    ),
    forMember(
      (destination) => destination.ownedBy,
      mapFrom((source) => source.complaint_identifier.owned_by_agency_code_ref),
    ),
    forMember(
      (destination) => destination.reportedOn,
      mapFrom((source) => {
        const {
          complaint_identifier: { incident_reported_utc_timestmp: reported },
        } = source;
        return reported || "";
      }),
    ),
    forMember(
      (destination) => destination.updatedOn,
      mapFrom((source) => source.complaint_identifier.comp_last_upd_utc_timestamp),
    ),
    forMember(
      (destination) => destination.officerAssigned,
      mapFrom((source) => {
        const {
          complaint_identifier: { app_user_complaint_xref: appUsers },
        } = source;

        const delegates = mapper.mapArray<AppUserComplaintXref, DelegateDto>(
          appUsers,
          "AppUserComplaintXref",
          "Delegate",
        );

        if (delegates.length === 0) {
          return "Not Assigned";
        } else {
          const assignee = delegates.find((item) => item.type === "ASSIGNEE");
          if (!assignee) {
            return "Not Assigned";
          } else {
            return assignee.appUserGuid || "Not Assigned";
          }
        }
      }),
    ),

    forMember(
      (destination) => destination.status,
      mapFrom((source) => {
        return source.complaint_identifier.complaint_status_code.short_description;
      }),
    ),
    forMember(
      (destination) => destination.incidentDateTime,
      mapFrom((source) => source.complaint_identifier.incident_utc_datetime),
    ),
    forMember(
      (destination) => destination.location,
      mapFrom((source) => source.complaint_identifier.location_summary_text),
    ),
    forMember(
      (destination) => destination.latitude,
      mapFrom((source) => {
        const {
          complaint_identifier: {
            location_geometry_point: { coordinates },
          },
        } = source;
        return coordinates[1].toString();
      }),
    ),
    forMember(
      (destination) => destination.longitude,
      mapFrom((source) => {
        const {
          complaint_identifier: {
            location_geometry_point: { coordinates },
          },
        } = source;
        return coordinates[0].toString();
      }),
    ),

    forMember(
      (destination) => destination.community,
      mapFrom((source) => {
        return "";
      }),
    ),
    forMember(
      (destination) => destination.office,
      mapFrom((source) => {
        return "";
      }),
    ),
    forMember(
      (destination) => destination.zone,
      mapFrom((source) => {
        return source.complaint_identifier.geo_organization_unit_code || "";
      }),
    ),
    forMember(
      (destination) => destination.region,
      mapFrom((source) => {
        return "";
      }),
    ),
    forMember(
      (destination) => destination.locationDescription,
      mapFrom((source) => source.complaint_identifier.location_detailed_text),
    ),
    forMember(
      (destination) => destination.description,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.detail_text !== null ? complaint.detail_text : "";
      }),
    ),
    forMember(
      (destination) => destination.name,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_name !== null ? complaint.caller_name : "";
      }),
    ),
    forMember(
      (destination) => destination.phone1,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        const { caller_phone_1: phone } = complaint;

        try {
          if (phone) {
            return formatPhonenumber(phone);
          }
        } catch (error) {
          return phone;
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.phone2,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        const { caller_phone_2: phone } = complaint;

        try {
          if (phone) {
            return formatPhonenumber(phone);
          }
        } catch (error) {
          return phone;
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.phone3,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        const { caller_phone_3: phone } = complaint;

        try {
          if (phone) {
            return formatPhonenumber(phone);
          }
        } catch (error) {
          return phone;
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.email,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_email !== null ? complaint.caller_email : "";
      }),
    ),
    forMember(
      (destination) => destination.address,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_address !== null ? complaint.caller_address : "";
      }),
    ),
    forMember(
      (destination) => destination.reportedBy,
      mapFrom((source) => {
        const {
          complaint_identifier: { reported_by_code: reported_by },
        } = source;
        if (reported_by) {
          const code = mapper.map<ReportedByCode, ReportedBy>(reported_by, "ReportedByCode", "ReportedByCodeDto");
          return code.longDescription;
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.privacyRequested,
      mapFrom((source) => {
        if (source.complaint_identifier.is_privacy_requested === "Y") {
          return "Yes";
        } else if (source.complaint_identifier.is_privacy_requested === "N") {
          return "No";
        } else {
          return null;
        }
      }),
    ),
    //--
    forMember(
      (destination) => destination.violationType,
      mapFrom((src) => {
        if (src.violation_code) {
          return src.violation_code.long_description;
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.inProgress,
      mapFrom((src) => (src.in_progress_ind ? "Yes" : "No")),
    ),
    forMember(
      (destination) => destination.wasObserved,
      mapFrom((src) => (src.observed_ind ? "Yes" : "No")),
    ),
    forMember(
      (destination) => destination.details,
      mapFrom((src) => src.suspect_witnesss_dtl_text),
    ),
    forMember(
      (destination) => destination.webeocId,
      mapFrom((source) => source.complaint_identifier.webeoc_identifier),
    ),
    forMember(
      (destination) => destination.referenceNumber,
      mapFrom((source) => source.complaint_identifier.reference_number),
    ),
    forMember(
      (destination) => destination.complaintMethodReceivedCode,
      mapFrom((source) => {
        const { complaint_identifier } = source;
        const { comp_mthd_recv_cd_agcy_cd_xref } = complaint_identifier || {};

        if (comp_mthd_recv_cd_agcy_cd_xref) {
          const { complaint_method_received_code } = comp_mthd_recv_cd_agcy_cd_xref;
          return complaint_method_received_code?.long_description || null;
        }

        return null;
      }),
    ),
    forMember(
      (destination) => destination.parkGuid,
      mapFrom((source) => source.complaint_identifier.park_guid),
    ),
    forMember(
      (destination) => destination.type,
      mapFrom((source) => {
        if (!source.complaint_identifier.complaint_type_code) {
          return null;
        }
        const {
          complaint_identifier: {
            complaint_type_code: { complaint_type_code },
          },
        } = source;
        return complaint_type_code;
      }),
    ),
  );
};

export const mapGeneralIncidentReport = (mapper: Mapper, tz: string = "America/Vancouver") => {
  reportedByCodeToReportedByDto(mapper);
  violationCodeToViolationDto(mapper);
  appUserComplaintToDelegateDtoMap(mapper);
  createMap<GirComplaint, GeneralIncidentReportData>(
    mapper,
    "GirComplaint",
    "GeneralIncidentReportData",

    forMember(
      (destination) => destination.complaintMethodReceivedCode,
      mapFrom((source) => {
        const { complaint_identifier } = source;
        const { comp_mthd_recv_cd_agcy_cd_xref } = complaint_identifier || {};

        if (comp_mthd_recv_cd_agcy_cd_xref) {
          const { complaint_method_received_code } = comp_mthd_recv_cd_agcy_cd_xref;
          return complaint_method_received_code?.long_description || null;
        }

        return null;
      }),
    ),
    forMember(
      (destination) => destination.referenceNumber,
      mapFrom((source) => source.complaint_identifier.reference_number),
    ),
    forMember(
      (destination) => destination.webeocId,
      mapFrom((source) => source.complaint_identifier.webeoc_identifier),
    ),
    forMember(
      (destination) => destination.generalIncidentType,
      mapFrom((src) => {
        if (src.gir_type_code) {
          return src.gir_type_code.long_description;
        }
        return "";
      }),
    ),
    forMember(
      (destination) => destination.privacyRequested,
      mapFrom((source) => {
        if (source.complaint_identifier.is_privacy_requested === "Y") {
          return "Yes";
        } else if (source.complaint_identifier.is_privacy_requested === "N") {
          return "No";
        } else {
          return null;
        }
      }),
    ),
    forMember(
      (destination) => destination.reportedBy,
      mapFrom((source) => {
        const {
          complaint_identifier: { reported_by_code: reported_by },
        } = source;
        if (reported_by) {
          const code = mapper.map<ReportedByCode, ReportedBy>(reported_by, "ReportedByCode", "ReportedByCodeDto");
          return code.longDescription;
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.address,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_address !== null ? complaint.caller_address : "";
      }),
    ),
    forMember(
      (destination) => destination.email,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_email !== null ? complaint.caller_email : "";
      }),
    ),
    forMember(
      (destination) => destination.phone3,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        const { caller_phone_3: phone } = complaint;

        try {
          if (phone) {
            return formatPhonenumber(phone);
          }
        } catch (error) {
          return phone;
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.phone2,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        const { caller_phone_2: phone } = complaint;

        try {
          if (phone) {
            return formatPhonenumber(phone);
          }
        } catch (error) {
          return phone;
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.phone1,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        const { caller_phone_1: phone } = complaint;

        try {
          if (phone) {
            return formatPhonenumber(phone);
          }
        } catch (error) {
          return phone;
        }

        return "";
      }),
    ),
    forMember(
      (destination) => destination.name,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.caller_name !== null ? complaint.caller_name : "";
      }),
    ),
    forMember(
      (destination) => destination.description,
      mapFrom((source) => {
        const { complaint_identifier: complaint } = source;
        return complaint.detail_text !== null ? complaint.detail_text : "";
      }),
    ),
    forMember(
      (destination) => destination.locationDescription,
      mapFrom((source) => source.complaint_identifier.location_detailed_text),
    ),
    forMember(
      (destination) => destination.region,
      mapFrom((source) => {
        return "";
      }),
    ),
    forMember(
      (destination) => destination.zone,
      mapFrom((source) => {
        return source.complaint_identifier.geo_organization_unit_code || "";
      }),
    ),
    forMember(
      (destination) => destination.office,
      mapFrom((source) => {
        return "";
      }),
    ),
    forMember(
      (destination) => destination.community,
      mapFrom((source) => {
        return "";
      }),
    ),
    forMember(
      (destination) => destination.longitude,
      mapFrom((source) => {
        const {
          complaint_identifier: {
            location_geometry_point: { coordinates },
          },
        } = source;
        return coordinates[0].toString();
      }),
    ),
    forMember(
      (destination) => destination.latitude,
      mapFrom((source) => {
        const {
          complaint_identifier: {
            location_geometry_point: { coordinates },
          },
        } = source;
        return coordinates[1].toString();
      }),
    ),
    forMember(
      (destination) => destination.location,
      mapFrom((source) => source.complaint_identifier.location_summary_text),
    ),
    forMember(
      (destination) => destination.incidentDateTime,
      mapFrom((source) => source.complaint_identifier.incident_utc_datetime),
    ),
    forMember(
      (destination) => destination.status,
      mapFrom((source) => {
        return source.complaint_identifier.complaint_status_code.short_description;
      }),
    ),
    forMember(
      (destination) => destination.officerAssigned,
      mapFrom((source) => {
        const {
          complaint_identifier: { app_user_complaint_xref: appUsers },
        } = source;

        const delegates = mapper.mapArray<AppUserComplaintXref, DelegateDto>(
          appUsers,
          "AppUserComplaintXref",
          "Delegate",
        );

        if (delegates.length === 0) {
          return "Not Assigned";
        } else {
          const assignee = delegates.find((item) => item.type === "ASSIGNEE");
          if (!assignee) {
            return "Not Assigned";
          } else {
            return assignee.appUserGuid || "Not Assigned";
          }
        }
      }),
    ),
    forMember(
      (destination) => destination.updatedOn,
      mapFrom((source) => source.complaint_identifier.update_utc_timestamp),
    ),
    forMember(
      (destination) => destination.reportedOn,
      mapFrom((source) => {
        const {
          complaint_identifier: { incident_reported_utc_timestmp: reported },
        } = source;
        return reported || "";
      }),
    ),
    forMember(
      (destination) => destination.ownedBy,
      mapFrom((source) => source.complaint_identifier.owned_by_agency_code_ref),
    ),
    forMember(
      (destination) => destination.createdBy,
      mapFrom((source) => source.create_user_id),
    ),
    forMember(
      (destination) => destination.id,
      mapFrom((source) => source.complaint_identifier.complaint_identifier),
    ),
    forMember(
      (destination) => destination.parkGuid,
      mapFrom((source) => source.complaint_identifier.park_guid),
    ),
    forMember(
      (destination) => destination.type,
      mapFrom((source) => {
        if (!source.complaint_identifier.complaint_type_code) {
          return null;
        }
        const {
          complaint_identifier: {
            complaint_type_code: { complaint_type_code },
          },
        } = source;
        return complaint_type_code;
      }),
    ),
  );
};

// @SONAR_START@
