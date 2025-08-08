import { BaseComplaintOutcomeInput } from "../base-complaint-outcome-input";

export interface CreateNoteInput extends BaseComplaintOutcomeInput {
  note: string;
}
