import { UUID } from "node:crypto";

export interface DelegateDto {
  xrefId: UUID;
  isActive: boolean;
  type: string; // -- this can be an ASSIGNEE, SUSPECT, etc
  appUserGuid: UUID;
}
