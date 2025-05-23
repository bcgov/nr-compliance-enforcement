import { UUID } from "crypto";
import { CaseAction } from "./case-action";

export interface Note {
  id: UUID;
  note: string;
  agencyCode: string;
  actions?: CaseAction[];
}
