import { CaseFileAction } from "../../case_file_action/entities/case_file_action.entity";

export class Note {
  id: string;
  note: string;
  actions: CaseFileAction[];
  outcomeAgencyCode: string;
}
