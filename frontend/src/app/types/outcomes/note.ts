import { UUID } from "crypto";
import { CaseAction } from "./case-action";

export interface Note {
  id: UUID;
  note: string;
  actions?: CaseAction[];
}
