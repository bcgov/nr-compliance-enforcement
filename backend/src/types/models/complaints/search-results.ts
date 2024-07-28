import { WildlifeComplaintDto } from "./wildlife-complaint";
import { AllegationComplaintDto } from "./allegation-complaint";
import { GeneralIncidentComplaintDto } from "./gir-complaint";

export interface SearchResults {
  complaints: Array<WildlifeComplaintDto> | Array<AllegationComplaintDto> | Array<GeneralIncidentComplaintDto>;
  totalCount: number;
}
