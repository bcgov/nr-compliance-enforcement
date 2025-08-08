import { UUID } from "crypto";
export interface CaseActionDto {
  actionGuid: UUID;
  actor: UUID;
  date: Date;
  actionCode: string;
  shortDescription: string;
  longDescription: string;
  activeIndicator: boolean;
}
