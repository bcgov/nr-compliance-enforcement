export interface ReviewCompleteAction {
  actor: string;
  date: Date;
  actionCode: string;
  activeIndicator?: boolean;
  actionId?: string;
}
