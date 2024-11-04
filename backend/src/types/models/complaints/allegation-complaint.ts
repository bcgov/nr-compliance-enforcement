import { UUID } from "crypto";
import { ComplaintDto } from "./complaint";
import { BaseComplaint } from "nrs-ce-common-types";

export interface AllegationComplaintDto extends ComplaintDto, BaseComplaint {
  ersId: UUID;
  violation: string;
  isInProgress: boolean;
  wasObserved: boolean;
  violationDetails: string;
}
