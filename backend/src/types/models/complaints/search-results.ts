import { WildlifeComplaintDto } from "./dtos/wildlife-complaint";
import { AllegationComplaintDto } from "./dtos/allegation-complaint";
import { GeneralIncidentComplaintDto } from "./dtos/gir-complaint";
import { SectorComplaintDto } from "./dtos/sector-complaint";

export interface SearchResults {
  complaints:
    | Array<WildlifeComplaintDto>
    | Array<AllegationComplaintDto>
    | Array<GeneralIncidentComplaintDto>
    | Array<SectorComplaintDto>;
  totalCount: number;
}
