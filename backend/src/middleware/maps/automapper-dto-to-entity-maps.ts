import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";

//-- entities
import { Complaint } from "../../v1/complaint/entities/complaint.entity";
import { HwcrComplaint } from "../../v1/hwcr_complaint/entities/hwcr_complaint.entity";
import { AllegationComplaint } from "../../v1/allegation_complaint/entities/allegation_complaint.entity";
import { AttractantHwcrXref } from "../../v1/attractant_hwcr_xref/entities/attractant_hwcr_xref.entity";

//-- dto
import { WildlifeComplaintDto } from "../../types/models/complaints/wildlife-complaint";
import { ComplaintDto } from "../../types/models/complaints/complaint";
import { AttractantXrefDto } from "../../types/models/complaints/attractant-ref";
import { AllegationComplaintDto } from "../../types/models/complaints/allegation-complaint";
import { GeneralIncidentComplaintDto } from "../../types/models/complaints/gir-complaint";
import { GirComplaint } from "../../v1/gir_complaint/entities/gir_complaint.entity";

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
      (dest) => dest.cos_geo_org_unit,
      mapFrom((src) => {
        const { area, zone, region } = src.organization;
        return { area_code: area, zone_code: zone, region_code: region };
      }),
    ),
    forMember(
      (dest) => dest.geo_organization_unit_code,
      mapFrom((src) => {
        const { area } = src.organization;
        return { geo_organization_unit_code: area };
      }),
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
      }),
    ),
    forMember(
      (dest) => dest.owned_by_agency_code,
      mapFrom((src) => {
        const { ownedBy } = src || null;
        return ownedBy ? { agency_code: ownedBy } : null;
      }),
    ),
    forMember(
      (dest) => dest.reported_by_code,
      mapFrom((src) => {
        const { reportedBy } = src || null;
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
      (dest) => dest.privacy_request_ind,
      mapFrom((src) => src.privacyRequestIndicator),
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
      (dest) => dest.complaint_identifier.cos_geo_org_unit,
      mapFrom((src) => {
        const { area, zone, region } = src.organization;
        return { area_code: area, zone_code: zone, region_code: region };
      }),
    ),
    forMember(
      (dest) => dest.complaint_identifier.geo_organization_unit_code,
      mapFrom((src) => {
        const { area } = src.organization;
        return { geo_organization_unit_code: area };
      }),
    ),
    forMember(
      (dest) => dest.complaint_identifier.person_complaint_xref,
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
      }),
    ),
    forMember(
      (dest) => dest.complaint_identifier.owned_by_agency_code,
      mapFrom((src) => {
        const { ownedBy } = src || null;
        return ownedBy ? { agency_code: ownedBy } : null;
      }),
    ),
    forMember(
      (dest) => dest.complaint_identifier.reported_by_code,
      mapFrom((src) => {
        const { reportedBy } = src || null;
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
      (dest) => dest.complaint_identifier.cos_geo_org_unit,
      mapFrom((src) => {
        const { area, zone, region } = src.organization;
        return { area_code: area, zone_code: zone, region_code: region };
      }),
    ),
    forMember(
      (dest) => dest.complaint_identifier.geo_organization_unit_code,
      mapFrom((src) => {
        const { area } = src.organization;
        return { geo_organization_unit_code: area };
      }),
    ),
    forMember(
      (dest) => dest.complaint_identifier.person_complaint_xref,
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
      }),
    ),
    forMember(
      (dest) => dest.complaint_identifier.owned_by_agency_code,
      mapFrom((src) => {
        const { ownedBy } = src || null;
        return ownedBy ? { agency_code: ownedBy } : null;
      }),
    ),
    forMember(
      (dest) => dest.complaint_identifier.reported_by_code,
      mapFrom((src) => {
        const { reportedBy } = src || null;
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
      (dest) => dest.complaint_identifier.cos_geo_org_unit,
      mapFrom((src) => {
        const { area, zone, region } = src.organization;
        return { area_code: area, zone_code: zone, region_code: region };
      }),
    ),
    forMember(
      (dest) => dest.complaint_identifier.geo_organization_unit_code,
      mapFrom((src) => {
        const { area } = src.organization;
        return { geo_organization_unit_code: area };
      }),
    ),
    forMember(
      (dest) => dest.complaint_identifier.owned_by_agency_code,
      mapFrom((src) => {
        const { ownedBy } = src || null;
        return ownedBy ? { agency_code: ownedBy } : null;
      }),
    ),
    forMember(
      (dest) => dest.complaint_identifier.reported_by_code,
      mapFrom((src) => {
        const { reportedBy } = src || null;
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
