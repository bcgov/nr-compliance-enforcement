import { WildlifeComplaint } from "../app/complaints/wildlife-complaint";
import { AllegationComplaint as AllegationComplaintModel } from "../app/complaints/allegation-complaint";
import { AllegationComplaint } from "./allegation-complaint";
import { HwcrComplaint } from "./hwcr-complaint";

export interface MapSearchResults {
  complaints: HwcrComplaint[] | AllegationComplaint[] | Array<WildlifeComplaint> | Array<AllegationComplaintModel>;
  unmappedComplaints: number;
}
