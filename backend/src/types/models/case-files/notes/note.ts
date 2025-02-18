import { CaseAction } from "../case-action";

export interface Note {
  id: string;
  note: string;
  actions: CaseAction[];
}
