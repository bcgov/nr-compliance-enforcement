import { BaseComplaintOutcomeCreateInput } from "@/app/types/app/complaint-outcomes/base-case-file-input";

export interface CreateNoteInput extends BaseComplaintOutcomeCreateInput {
  note: string;
}
