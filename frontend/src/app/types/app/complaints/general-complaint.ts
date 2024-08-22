import { UUID } from "crypto";
import { Complaint } from "./complaint";

export interface GeneralIncidentComplaint extends Complaint {
  girId: UUID;
  girType: string;
}