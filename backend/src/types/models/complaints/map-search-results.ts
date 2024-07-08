import { WildlifeComplaintDto } from "./wildlife-complaint";
import { AllegationComplaintDto } from "./allegation-complaint";
import { GeneralInformationComplaintDto } from "./gir-complaint";

export interface MapSearchResults {
  complaints: WildlifeComplaintDto[] | AllegationComplaintDto[] | GeneralInformationComplaintDto[];
  unmappedComplaints: number;
}
