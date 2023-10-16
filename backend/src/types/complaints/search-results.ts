import { AllegationComplaint } from "src/v1/allegation_complaint/entities/allegation_complaint.entity";
import { HwcrComplaint } from "src/v1/hwcr_complaint/entities/hwcr_complaint.entity";


export interface SearchResults {
  complaints: HwcrComplaint[] | AllegationComplaint[];
  totalCount: number;
}
