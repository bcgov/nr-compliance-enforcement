import { COMPLAINT_TYPE } from "./complaint-type";

export interface ExportComplaintParameters {
  id: string;
  type: COMPLAINT_TYPE;
  fileName: string;
  tz: string;
  attachments: any;
}
