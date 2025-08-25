import { Complaint } from "./complaint";

export interface SectorComplaint extends Complaint {
  issueType: string;
}
