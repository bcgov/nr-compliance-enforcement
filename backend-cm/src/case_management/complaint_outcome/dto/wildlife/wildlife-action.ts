import { UUID } from "crypto";

export interface WildlifeAction {
  id?: UUID;
  actor: string;
  date?: Date;
  action: string;
  activeIndicator: boolean;
}
