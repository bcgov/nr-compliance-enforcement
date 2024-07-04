import { WildlifeComplaintDto } from "./wildlife-complaint";
import { AllegationComplaintDto } from "./allegation-complaint";
import { GeneralInformationComplaintDto } from "./gir-complaint";

export interface SearchResults {
  complaints: Array<WildlifeComplaintDto> | Array<AllegationComplaintDto> | Array<GeneralInformationComplaintDto>;
  totalCount: number;
}
