export interface CaseAction {
  actor: string;
  date: Date;
  actionTime?: Date;
  actionCode: string;
  actionId: string;
  activeIndicator: boolean;
}
