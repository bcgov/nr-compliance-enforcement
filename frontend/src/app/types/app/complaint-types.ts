import config from "../../../config";

export const COMPLAINT_TYPES = {
  HWCR: "HWCR",
  ERS: "ERS",
  GIR: "GIR",
};

export const complaintTypeToName = (complaintType: string | undefined | null, singular?: boolean) => {
  switch (complaintType) {
    case COMPLAINT_TYPES.ERS:
      return "Enforcement";
    case COMPLAINT_TYPES.HWCR:
      return singular ? "Human Wildlife Conflict" : "Human Wildlife Conflicts";
    case COMPLAINT_TYPES.GIR:
      return config.SHOW_EXPERIMENTAL_FEATURES === false ? "" : "General Incident";
    default:
      return "";
  }
};

export default COMPLAINT_TYPES;
