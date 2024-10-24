import { UUID } from "crypto";
import { ComplaintDto } from "./complaint";
import { BaseComplaint } from "nrs-ce-common-types";

export interface GeneralIncidentComplaintDto extends ComplaintDto, BaseComplaint {
  girId: UUID;
  girType: string;
}
