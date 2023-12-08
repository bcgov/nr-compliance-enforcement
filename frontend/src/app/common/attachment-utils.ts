// attachmentUtils.ts

import {
  deleteAttachments,
  saveAttachments,
} from "../store/reducers/attachments";
import { COMSObject } from "../types/coms/object";

// Given a list of attachments to add/delete, call COMS to add/delete those attachments
export function handleAttachments(
  dispatch: any,
  attachmentsToAdd: File[] | null,
  attachmentsToDelete: COMSObject[] | null,
  id: string,
  setAttachmentsToAdd: any,
  setAttachmentsToDelete: any
) {
  if (attachmentsToAdd) {
    dispatch(saveAttachments(attachmentsToAdd, id));
  }

  if (attachmentsToDelete) {
    dispatch(deleteAttachments(attachmentsToDelete));
  }

  // Clear the attachments since they've been added or saved.
  setAttachmentsToAdd(null);
  setAttachmentsToDelete(null);
}
