import { UUID } from "crypto";
export interface PreventionActionDto {
  actor: UUID;
  date: Date;
  actionCode: string;
  shortDescription: string;
  longDescription: string;
  activeIndicator: boolean;
}