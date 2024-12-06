import { WildlifeComplaintDto } from "./wildlife-complaint";
import { AllegationComplaintDto } from "./allegation-complaint";
import { GeneralIncidentComplaintDto } from "./gir-complaint";

export interface MapSearchResults {
  complaints?: WildlifeComplaintDto[] | AllegationComplaintDto[] | GeneralIncidentComplaintDto[];
  clusters?: any;
  unmappedComplaints?: number;
  zoom?: number;
  center?: Array<number>;
}
