import { Roles } from "./roles";
import { AgencyType } from "./agency-types";

export const COMPLAINT_TYPES = {
  HWCR: "HWCR",
  ERS: "ERS",
  GIR: "GIR",
  SECTOR: "SECTOR",
};
export const CEEB_TYPES = {
  ERS: "ERS",
  SECTOR: "SECTOR",
};
export const NROS_TYPES = {
  ERS: "ERS",
  SECTOR: "SECTOR",
};
export const MINES_TYPES = {
  ERS: "ERS",
  SECTOR: "SECTOR",
};
export const HWCR_ONLY_TYPES = {
  HWCR: "HWCR",
};

export const SECTOR_TYPES = {
  SECTOR: "SECTOR",
};

export const complaintTypeToName = (complaintType: string | undefined | null, singular?: boolean) => {
  switch (complaintType) {
    case COMPLAINT_TYPES.ERS:
      return "Enforcement";
    case COMPLAINT_TYPES.HWCR:
      return singular ? "Human Wildlife Conflict" : "Human Wildlife Conflicts";
    case COMPLAINT_TYPES.GIR:
      return singular ? "General Incident" : "General Incidents";
    case COMPLAINT_TYPES.SECTOR:
      return singular ? "Sector Complaint" : "Sector Complaints";
    default:
      return "";
  }
};

export const complaintTypeForRole = (roleType: string) => {
  switch (roleType) {
    case Roles.CEEB:
    case Roles.CEEB_COMPLIANCE_COORDINATOR:
    case Roles.CEEB_SECTION_HEAD:
      return CEEB_TYPES;
    case Roles.NROS:
      return NROS_TYPES;
    case Roles.MINES:
      return MINES_TYPES;
    case Roles.COS:
    case Roles.GLOBAL_ADMINISTRATOR:
    case Roles.AGENCY_ADMINISTRATOR:
    default:
      return COMPLAINT_TYPES;
  }
};

export const complaintTypesForReferral = (agency: string) => {
  switch (agency) {
    case AgencyType.CEEB:
      return CEEB_TYPES;
    case AgencyType.NROS:
      return NROS_TYPES;
    case AgencyType.MINES:
      return MINES_TYPES;
    default:
      return COMPLAINT_TYPES;
  }
};
export default COMPLAINT_TYPES;
