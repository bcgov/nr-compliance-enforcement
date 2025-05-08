import { UUID } from "crypto";
export class AssessmentActionDto {
  actor: UUID;
  date: Date;
  actionCode: string;
  shortDescription?: string;
  longDescription?: string;
  activeIndicator: boolean;
}
