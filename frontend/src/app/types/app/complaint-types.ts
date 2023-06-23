const COMPLAINT_TYPES = {
  HWCR: "HWCR",
  ERS: "ERS",
};

export const complaintTypeToName = (complaintType: string | undefined | null) => {
  switch (complaintType) {
    case COMPLAINT_TYPES.ERS:
      return "Enforcement";
    case COMPLAINT_TYPES.HWCR:
      return "Human Wildlife Conflict";
    default:
      return "";
  }
};

export default COMPLAINT_TYPES;
