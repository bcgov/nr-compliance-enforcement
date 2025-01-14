import Roles from "./roles";

export const COMPLAINT_TYPES = {
  HWCR: "HWCR",
  ERS: "ERS",
  GIR: "GIR",
};
export const CEEB_TYPES = {
  ERS: "ERS",
};

export const complaintTypeToName = (complaintType: string | undefined | null, singular?: boolean) => {
  switch (complaintType) {
    case COMPLAINT_TYPES.ERS:
      return "Enforcement";
    case COMPLAINT_TYPES.HWCR:
      return singular ? "Human Wildlife Conflict" : "Human Wildlife Conflicts";
    case COMPLAINT_TYPES.GIR:
      return singular ? "General Incident" : "General Incidents";
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
