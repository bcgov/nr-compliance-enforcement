import { Roles } from "./roles";

export const COMPLAINT_TYPE_AGENCY_MAPPING = {
  HWCR: ["COS", "PARKS"],
  GIR: ["COS", "PARKS"],
  ERS: ["COS", "PARKS", "EPO"],
};

export const COMPLAINT_TYPE_EXTERNAL_AGENCY_MAPPING = {
  HWCR: false,
  GIR: true,
  ERS: true,
  SECTOR: false,
};

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
    case Roles.COS_ADMINISTRATOR:
    case Roles.SYSTEM_ADMINISTRATOR:
    case Roles.COS:
    case Roles.TEMPORARY_TEST_ADMIN:
    default:
      return COMPLAINT_TYPES;
  }
};
export default COMPLAINT_TYPES;
