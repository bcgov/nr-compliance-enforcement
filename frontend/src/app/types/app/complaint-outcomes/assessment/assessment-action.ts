import { UUID } from "node:crypto";
export interface AssessmentActionDto {
  actor: UUID;
  date: string;
  actionCode: string;
  shortDescription?: string;
  longDescription?: string;
  activeIndicator: boolean;
  isLegacy?: boolean;
}
