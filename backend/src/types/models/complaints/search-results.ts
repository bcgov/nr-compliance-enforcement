import { WildlifeComplaintDto } from "./wildlife-complaint";
import { AllegationComplaintDto } from "./allegation-complaint";
import { GeneralIncidentComplaintDto } from "./gir-complaint";
import { ComplaintDto } from "./complaint";

export interface SearchResults {
  complaints:
    | Array<WildlifeComplaintDto>
    | Array<AllegationComplaintDto>
    | Array<GeneralIncidentComplaintDto>
    | Array<ComplaintDto>;
  totalCount: number;
}
