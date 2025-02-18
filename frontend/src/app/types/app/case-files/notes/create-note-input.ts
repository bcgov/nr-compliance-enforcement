import { BaseCaseFileCreateInput } from "@apptypes/app/case-files/base-case-file-input";

export interface CreateNoteInput extends BaseCaseFileCreateInput {
  note: string;
}
