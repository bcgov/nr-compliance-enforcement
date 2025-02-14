import { BaseCaseFileUpdateInput } from "@apptypes/app/case-files/base-case-file-input";
import { UUID } from "crypto";

export interface UpdateNoteInput extends BaseCaseFileUpdateInput {
  id: UUID;
  note: string;
}
