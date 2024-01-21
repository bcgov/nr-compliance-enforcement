import { WildlifeComplaintDto } from "./wildlife-complaint";
import { AllegationComplaintDto } from "./allegation-complaint";

export interface MapSearchResults {
  complaints: WildlifeComplaintDto[] | AllegationComplaintDto[];
  unmappedComplaints: number;
}
