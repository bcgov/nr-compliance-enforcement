import { AttachmentsState } from "../state/attachments-state";

export interface ExportComplaintInput {
  id: string;
  type: string;
  tz: string;
  attachments: AttachmentsState;
}
