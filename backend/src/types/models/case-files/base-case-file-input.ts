import { UUID } from "crypto";

export interface BaseCaseFileInput {
  caseIdentifier: UUID;
  leadIdentifier: string;

  agencyCode: string;
  caseCode: string;

  actor: UUID;

  createUserId: string;
  updateUserId: string;

  actionId?: string;
}
