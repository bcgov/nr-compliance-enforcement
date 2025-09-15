import { CaseFileAction } from "../../case_file_action/entities/case_file_action.entity";

export class Equipment {
  id: string;
  typeCode: string;
  typeShortDescription?: string;
  typeLongDescription?: string;
  activeIndicator: boolean;
  address?: string;
  xCoordinate?: string;
  yCoordinate?: string;
  createDate: Date;
  actions: CaseFileAction[];
  wasAnimalCaptured: string;
  quantity?: number;
}
