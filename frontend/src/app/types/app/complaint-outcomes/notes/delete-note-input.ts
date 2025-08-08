import { BaseComplaintOutcomeUpdateInput } from "@/app/types/app/complaint-outcomes/base-case-file-input";
import { UUID } from "crypto";

export interface DeleteNoteInput extends BaseComplaintOutcomeUpdateInput {
  id: UUID;
}
