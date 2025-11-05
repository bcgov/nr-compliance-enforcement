import { PojosMetadataMap } from "@automapper/pojos";

//-- entities
import { AppUserComplaintXref } from "../../v1/app_user_complaint_xref/entities/app_user_complaint_xref.entity";
import { Complaint } from "../../v1/complaint/entities/complaint.entity";

//-- models
import { Attractant, NatureOfComplaint, Species, Violation, ReportedBy } from "../../types/models/code-tables";
import { DelegateDto } from "../../types/models/app_user/delegate";
import { ComplaintDto } from "../../types/models/complaints/dtos/complaint";
import { HwcrComplaint } from "../../v1/hwcr_complaint/entities/hwcr_complaint.entity";
import { AttractantCode } from "../../v1/attractant_code/entities/attractant_code.entity";
import { WildlifeComplaintDto } from "../../types/models/complaints/dtos/wildlife-complaint";
import { SpeciesCode } from "../../v1/species_code/entities/species_code.entity";
import { HwcrComplaintNatureCode } from "../../v1/hwcr_complaint_nature_code/entities/hwcr_complaint_nature_code.entity";
import { AttractantHwcrXref } from "../../v1/attractant_hwcr_xref/entities/attractant_hwcr_xref.entity";
import { AttractantXrefDto } from "../../types/models/complaints/attractant-ref";
import { ViolationCode } from "../../v1/violation_code/entities/violation_code.entity";
import { AllegationComplaint } from "../../v1/allegation_complaint/entities/allegation_complaint.entity";
import { AllegationComplaintDto } from "../../types/models/complaints/dtos/allegation-complaint";
import { ReportedByCode } from "src/v1/reported_by_code/entities/reported_by_code.entity";

const createDelegateMetadata = () => {
  PojosMetadataMap.create<AppUserComplaintXref>("AppUserComplaintXref", {
    appUserComplaintXrefGuid: String,
    active_ind: Boolean,
    app_user_guid: String,
    app_user_complaint_xref_code: String,
  });

  PojosMetadataMap.create<DelegateDto>("Delegate", {
    xrefId: String,
    isActive: Boolean,
    type: String,
    appUserGuid: String,
  });
};

export const createComplaintMetaData = () => {
  createDelegateMetadata();
  createReportedByCodeMetaData();

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
    reported_by_code: ReportedByCode,
    owned_by_agency_code_ref: String,
    reported_by_other_text: String,
    incident_reported_utc_timestmp: Date,
    incident_utc_datetime: Date,
    update_utc_timestamp: Date,
    app_user_complaint_xref: Object,
    park_guid: String,
    complaint_type_code: Object,
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
    reportedBy: String,
    ownedBy: String,
    reportedByOther: String,
    reportedOn: Date,
    incidentDateTime: Date,
    updatedOn: Date,
    organization: Object,
    delegates: Array<DelegateDto>,
    parkGuid: String,
    type: String,
  });
};

export const createSpeciesCodeMetaData = () => {
  PojosMetadataMap.create<SpeciesCode>("SpeciesCode", {
    species_code: String,
    short_description: String,
    long_description: String,
    display_order: Number,
    active_ind: Boolean,
    legacy_code: String,
  });

  PojosMetadataMap.create<Species>("SpeciesDto", {
    species: String,
    legacy: String,
    shortDescription: String,
    longDescription: String,
    displayOrder: Number,
    isActive: Boolean,
  });
};

export const createReportedByCodeMetaData = () => {
  PojosMetadataMap.create<ReportedByCode>("ReportedByCode", {
    reported_by_code: String,
    short_description: String,
    long_description: String,
    display_order: Number,
    active_ind: Boolean,
  });

  PojosMetadataMap.create<ReportedBy>("ReportedByCodeDto", {
    reportedBy: String,
    shortDescription: String,
    longDescription: String,
    displayOrder: Number,
    isActive: Boolean,
  });
};

export const createNatureOfComplaintMetaData = () => {
  PojosMetadataMap.create<HwcrComplaintNatureCode>("NatureOfComplaintCode", {
    hwcr_complaint_nature_code: String,
    short_description: String,
    long_description: String,
    display_order: Number,
    active_ind: Boolean,
  });

  PojosMetadataMap.create<NatureOfComplaint>("NatureOfComplaintDto", {
    natureOfComplaint: String,
    shortDescription: String,
    longDescription: String,
    displayOrder: Number,
    isActive: Boolean,
  });
};

export const createAttractantCodeMetaData = () => {
  PojosMetadataMap.create<AttractantCode>("AttractantCode", {
    attractant_code: String,
    short_description: String,
    long_description: String,
    display_order: Number,
    active_ind: Boolean,
  });

  PojosMetadataMap.create<Attractant>("AttractantDto", {
    attractant: String,
    shortDescription: String,
    longDescription: String,
    displayOrder: Number,
    isActive: Boolean,
  });

  PojosMetadataMap.create<AttractantHwcrXref>("AttractantXref", {
    hwcr_complaint_guid: String,
    attractant_code: String,
    active_ind: Boolean,
  });

  PojosMetadataMap.create<AttractantXrefDto>("AttractantXrefDto", {
    xrefId: String,
    attractant: String,
    isActive: Boolean,
  });
};

export const createViolationCodeMetadata = () => {
  PojosMetadataMap.create<ViolationCode>("VioltionCode", {
    violation_code: String,
    short_description: String,
    long_description: String,
    display_order: Number,
    active_ind: Boolean,
  });

  PojosMetadataMap.create<Violation>("ViolationCodeDto", {
    violation: String,
    shortDescription: String,
    longDescription: String,
    displayOrder: Number,
    isActive: Boolean,
  });
};

export const createWildlifeComplaintMetadata = () => {
  createComplaintMetaData();
  createSpeciesCodeMetaData();
  createNatureOfComplaintMetaData();
  createAttractantCodeMetaData();

  PojosMetadataMap.create<HwcrComplaint>("WildlifeComplaint", {
    complaint_identifier: Complaint,
    species_code: SpeciesCode,
    hwcr_complaint_nature_code: HwcrComplaintNatureCode,
    other_attractants_text: String,
    attractant_hwcr_xref: Array<AttractantCode>,
  });

  PojosMetadataMap.create<WildlifeComplaintDto>("WildlifeComplaintDto", {
    hwcrId: Complaint,
    species: String,
    natureOfComplaint: String,
    otherAttractants: String,
    attractants: Array<string>,
  });
};

export const createAllegationComplaintMetaData = () => {
  createComplaintMetaData();
  createViolationCodeMetadata();

  PojosMetadataMap.create<AllegationComplaint>("AllegationComplaint", {
    complaint_identifier: Complaint,
    violation_code: ViolationCode,
    in_progress_ind: Boolean,
    observed_ind: Boolean,
    allegation_complaint_guid: String,
    suspect_witnesss_dtl_text: String,
  });

  PojosMetadataMap.create<AllegationComplaintDto>("AllegationComplaintDto", {
    ersId: Complaint,
    violation: String,
    isInProgress: Boolean,
    wasObserved: Boolean,
    violationDetails: String,
  });
};
