import { BaseCodeTable } from "../../models/code-tables/code-table";

export interface ComplaintStatus extends BaseCodeTable {
  complaintStatus: string;
  manuallyAssignableInd: boolean;
}
