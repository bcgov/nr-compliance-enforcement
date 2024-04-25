import { UUID } from "crypto";
import { ComplaintDto } from "./complaint";

export interface AllegationComplaintDto extends ComplaintDto {
  ersId: UUID;
  violation: string;
  isInProgress: boolean;
  wasObserved: boolean;
  violationDetails: string;
}
