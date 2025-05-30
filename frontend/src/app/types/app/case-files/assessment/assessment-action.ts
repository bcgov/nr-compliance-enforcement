import { UUID } from "crypto";
export interface AssessmentActionDto {
  actor: UUID;
  date: Date;
  actionCode: string;
  shortDescription?: string;
  longDescription?: string;
  activeIndicator: boolean;
  isLegacy?: boolean;
}
