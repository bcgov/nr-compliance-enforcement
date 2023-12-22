import { AllegationComplaintDto } from "../../../types/models/complaints/allegation-complaint";
import { WildlifeComplaintDto } from "../../../types/models/complaints/wildlife-complaint";

export interface SearchResults {
  complaints: WildlifeComplaintDto[] | AllegationComplaintDto[];
  totalCount: number;
}
