import { BaseComplaintOutcomeInput } from "../base-complaint-outcome-input";

export interface UpdateNoteInput extends BaseComplaintOutcomeInput {
  id: string;
  note: string;
}
