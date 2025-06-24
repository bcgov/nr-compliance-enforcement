import { WildlifeComplaintDto } from "./dtos/wildlife-complaint";
import { AllegationComplaintDto } from "./dtos/allegation-complaint";
import { GeneralIncidentComplaintDto } from "./dtos/gir-complaint";
import { SectorComplaintDto } from "./dtos/sector-complaint";
import { ComplaintDtoAlias } from "src/types/models/complaints/dtos/complaint-dto-alias";

export interface SearchResults {
  complaints: Array<ComplaintDtoAlias>;
  totalCount: number;
}
