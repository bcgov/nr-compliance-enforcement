import { UUID } from "crypto";
import { Complaint } from "./complaint";

export interface GeneralInformationComplaint extends Complaint {
  girId: UUID;
  girType: string;
}
