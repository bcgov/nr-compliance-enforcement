export interface ReviewCompleteAction {
  actor: string;
  date: string;
  actionCode: string;
  activeIndicator?: boolean;
  actionId?: string;
}
