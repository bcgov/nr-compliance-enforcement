import { BaseCaseFileInput } from "../base-case-file-input";

export interface UpdateNoteInput extends BaseCaseFileInput {
  id: string;
  note: string;
}
