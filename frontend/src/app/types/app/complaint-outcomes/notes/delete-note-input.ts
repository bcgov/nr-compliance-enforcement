import { BaseComplaintOutcomeUpdateInput } from "@/app/types/app/complaint-outcomes/base-case-file-input";
import { UUID } from "node:crypto";

export interface DeleteNoteInput extends BaseComplaintOutcomeUpdateInput {
  id: UUID;
}
