import { UUID } from "node:crypto";
import { ComplaintDto } from "./complaint";
import { AttractantXrefDto } from "../attractant-ref";

export interface WildlifeComplaintDto extends ComplaintDto {
  hwcrId: UUID;
  species: string;
  isLargeCarnivore: boolean;
  natureOfComplaint: string;
  attractants: Array<AttractantXrefDto>;
  otherAttractants: string;
}
