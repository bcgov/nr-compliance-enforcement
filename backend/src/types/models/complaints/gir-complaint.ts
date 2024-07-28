import { UUID } from "crypto";
import { ComplaintDto } from "./complaint";

export interface GeneralIncidentComplaintDto extends ComplaintDto {
  girId: UUID;
  girType: string;
}
