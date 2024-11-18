import { UUID } from "crypto";
import { ComplaintDto } from "./complaint";
import { AttractantXrefDto } from "./attractant-ref";
import { BaseComplaint } from "nrs-ce-common-types";

export interface WildlifeComplaintDto extends ComplaintDto, BaseComplaint {
  hwcrId: UUID;
  species: string;
  isLargeCarnivore: boolean;
  natureOfComplaint: string;
  attractants: Array<AttractantXrefDto>;
  otherAttractants: string;
}
