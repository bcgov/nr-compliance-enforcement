import { AllegationComplaintDto } from "src/types/models/complaints/allegation-complaint";
import { WildlifeComplaintDto } from "src/types/models/complaints/wildlife-complaint";

export interface SearchResults {
  complaints: WildlifeComplaintDto[] | AllegationComplaintDto[];
  totalCount: number;
}
