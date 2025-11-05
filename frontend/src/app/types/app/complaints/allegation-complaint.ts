import { UUID } from "node:crypto";
import { Complaint } from "./complaint";

export interface AllegationComplaint extends Complaint {
  ersId: UUID;
  violation: string;
  isInProgress: boolean;
  wasObserved: boolean;
  violationDetails: string;
  authorization: string;
}
