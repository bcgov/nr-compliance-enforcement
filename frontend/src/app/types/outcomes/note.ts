import { UUID } from "node:crypto";
import { CaseAction } from "./case-action";

export interface Note {
  id: UUID;
  note: string;
  outcomeAgencyCode: string;
  actions?: CaseAction[];
}
