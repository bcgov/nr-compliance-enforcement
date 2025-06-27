export class CaseFileAction {
  actionId: string;
  actor: string;
  activeIndicator: boolean;
  actionCode: string;
  date: Date;
  shortDescription: string;
  longDescription: string;
  actionTypeCode?: string;
  displayOrder?: number;
  isLegacy?: boolean;
}
