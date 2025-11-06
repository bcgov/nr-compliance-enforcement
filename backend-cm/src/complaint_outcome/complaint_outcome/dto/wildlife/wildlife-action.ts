import { UUID } from "node:crypto";

export interface WildlifeAction {
  id?: UUID;
  actor: string;
  date?: Date;
  action: string;
  activeIndicator: boolean;
}
