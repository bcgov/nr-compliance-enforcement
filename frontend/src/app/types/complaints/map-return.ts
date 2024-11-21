import { WildlifeComplaint } from "@apptypes/app/complaints/wildlife-complaint";
import { AllegationComplaint as AllegationComplaintModel } from "@apptypes/app/complaints/allegation-complaint";
import { AllegationComplaint } from "./allegation-complaint";
import { HwcrComplaint } from "./hwcr-complaint";

export interface MapSearchResults {
  complaints: HwcrComplaint[] | AllegationComplaint[] | Array<WildlifeComplaint> | Array<AllegationComplaintModel>;
  unmappedComplaints: number;
}
