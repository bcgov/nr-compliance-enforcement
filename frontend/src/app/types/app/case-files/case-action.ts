import { UUID } from "crypto";
export interface CaseActionDto {
  actionId: UUID;
  actor: UUID;
  date: Date;
  actionCode: string;
  shortDescription: string;
  longDescription: string;
  activeIndicator: boolean;
}
