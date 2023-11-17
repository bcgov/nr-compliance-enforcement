import { UUID } from "crypto";
import { Complaint } from "./complaint";

export interface WildlifeComplaint extends Complaint { 
   hwcrId: UUID
   species: string
   natureOfComplaint: string
   attractants: Array<string>
   otherAttractants: string
}