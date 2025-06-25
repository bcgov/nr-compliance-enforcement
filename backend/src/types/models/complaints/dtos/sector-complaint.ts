import { ComplaintDto } from "./complaint";

export interface SectorComplaintDto extends ComplaintDto {
  issueType?: string;
  referralAgency?: string[];
}
