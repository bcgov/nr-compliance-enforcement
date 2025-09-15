import { CaseFileAction } from "../../case_file_action/entities/case_file_action.entity";

export class Prevention {
  id: string;
  outcomeAgencyCode: string;
  actions: CaseFileAction[];
}
