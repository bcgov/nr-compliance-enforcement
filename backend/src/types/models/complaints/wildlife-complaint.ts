import { UUID } from "crypto";
import { ComplaintDto } from "./complaint";

export interface WildlifeComplaintDto extends ComplaintDto { 
   hwcrId: UUID
   species: string
   natureOfComplaint: string
   attractants: Array<string>
   otherAttractants: string
}