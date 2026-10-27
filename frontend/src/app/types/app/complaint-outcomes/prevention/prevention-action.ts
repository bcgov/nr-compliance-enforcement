import { UUID } from "node:crypto";
export interface PreventionActionDto {
  actor: UUID;
  date: string;
  actionCode: string;
  shortDescription: string;
  longDescription: string;
  activeIndicator: boolean;
}
