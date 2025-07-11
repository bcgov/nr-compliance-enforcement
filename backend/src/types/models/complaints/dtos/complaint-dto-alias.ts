import { AllegationComplaintDto } from "./allegation-complaint";
import { GeneralIncidentComplaintDto } from "./gir-complaint";
import { WildlifeComplaintDto } from "./wildlife-complaint";
import { SectorComplaintDto } from "./sector-complaint";

export type ComplaintDtoAlias =
  | WildlifeComplaintDto
  | AllegationComplaintDto
  | GeneralIncidentComplaintDto
  | SectorComplaintDto;
