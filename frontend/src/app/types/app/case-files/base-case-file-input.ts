import { UUID } from "crypto";

export interface BaseCaseFileCreateInput {
  leadIdentifier: string;
  agencyCode: string;
  caseCode: string;
  actor?: string;
  createUserId: string;
}

export interface BaseCaseFileUpdateInput {
  caseIdentifier: UUID | string;
  leadIdentifier: string;
  actor?: string;
  updateUserId: string;
  actionId?: string;
}
