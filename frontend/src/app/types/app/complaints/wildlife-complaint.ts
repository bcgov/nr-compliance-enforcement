import { UUID } from "crypto";
import { Complaint } from "./complaint";
import { AttractantXref } from "./attractant-xref";

export interface WildlifeComplaint extends Complaint {
   hwcrId: UUID;
   species: string;
   natureOfComplaint: string;
   attractants: Array<AttractantXref>;
   otherAttractants: string;
 }