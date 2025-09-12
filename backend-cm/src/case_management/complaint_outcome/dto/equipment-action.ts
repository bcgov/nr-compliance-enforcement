import { UUID } from "crypto";

export interface EquipmentActionItem {
  actionGuid: UUID;
  actor: string;
  date: Date;
  actionCode: string;
  activeIndicator: boolean;
}
