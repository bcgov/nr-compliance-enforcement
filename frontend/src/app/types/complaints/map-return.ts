import { AllegationComplaint } from "./allegation-complaint";
import { HwcrComplaint } from "./hwcr-complaint";

export interface MapReturn {
  complaints: HwcrComplaint[] | AllegationComplaint [],
  unmappedComplaints: number,
}
