import { WildlifeComplaintDto } from "./wildlife-complaint";
import { AllegationComplaintDto } from "./allegation-complaint";

export interface SearchResults {
  complaints:
    | Array<WildlifeComplaintDto>
    | Array<AllegationComplaintDto>;
  totalCount: number;
}
