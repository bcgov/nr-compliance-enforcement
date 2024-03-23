import { UUID } from "crypto";

export interface BaseCaseFileInput { 
  caseIdentifier: UUID;
  leadIdentifier: string;
  createUserId: string;
  agencyCode: string;
  caseCode: string;
  updateUserId: string
}