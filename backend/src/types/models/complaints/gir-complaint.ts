import { UUID } from "crypto";
import { ComplaintDto } from "./complaint";

export interface GeneralInformationComplaintDto extends ComplaintDto {
  girId: UUID;
  girType: string;
}
