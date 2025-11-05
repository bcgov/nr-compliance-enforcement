import { UUID } from "node:crypto";
export class PreventionActionDto {
  actor: UUID;
  date: Date;
  actionCode: string;
  shortDescription: string;
  longDescription: string;
  activeIndicator: boolean;
}
