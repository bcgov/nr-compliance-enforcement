import { Attachment } from "src/types/models/general/attachment";

export interface ExportTaskParameters {
  investigationGuid: string;
  taskId: string;
  fileName: string;
  tz: string;
  attachments: Attachment[];
}
