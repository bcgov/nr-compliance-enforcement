import {
  deleteAttachments,
  getAttachments,
  saveAttachments,
} from "../store/reducers/attachments";
import { COMSObject } from "../types/coms/object";

// used to update the state of attachments that are to be added to a complaint
export const handleAddAttachments = (
  setAttachmentsToAdd: React.Dispatch<React.SetStateAction<File[] | null>>,
  selectedFiles: File[]
) => {
  setAttachmentsToAdd((prevFiles) =>
    prevFiles ? [...prevFiles, ...selectedFiles] : selectedFiles
  );
};

// used to update the state of attachments that are to be deleted from a complaint
export const handleDeleteAttachments = (
  attachmentsToAdd: File[] | null,
  setAttachmentsToAdd: React.Dispatch<React.SetStateAction<File[] | null>>,
  setAttachmentsToDelete: React.Dispatch<
    React.SetStateAction<COMSObject[] | null>
  >,
  fileToDelete: COMSObject,
) => {
  if (!fileToDelete.pendingUpload) {
    // a user is wanting to delete a previously uploaded attachment
    setAttachmentsToDelete((prevFiles) =>
      prevFiles ? [...prevFiles, fileToDelete] : [fileToDelete]
    );
  } else if (attachmentsToAdd) {
    // a user has added an attachment and deleted it, before the complaint was saved.  Let's make sure this file isn't uploaded, so remove it from the "attachmentsToAdd" state
    setAttachmentsToAdd((prevAttachments) =>
      prevAttachments
        ? prevAttachments.filter((file) => decodeURIComponent(file.name) !== decodeURIComponent(fileToDelete.name))
        : null
    );
  }
};

// Given a list of attachments to add/delete, call COMS to add/delete those attachments
export async function handlePersistAttachments(
  dispatch: any,
  attachmentsToAdd: File[] | null,
  attachmentsToDelete: COMSObject[] | null,
  complaintIdentifier: string,
  setAttachmentsToAdd: any,
  setAttachmentsToDelete: any,
  additionalHeader?: Record<string, string>
) {
  if (attachmentsToDelete) {
    await dispatch(deleteAttachments(attachmentsToDelete));
  }

  if (attachmentsToAdd) {
    await dispatch(saveAttachments(attachmentsToAdd, complaintIdentifier));
  }

  // refresh store
  await dispatch(getAttachments(complaintIdentifier));

  // Clear the attachments since they've been added or saved.
  setAttachmentsToAdd(null);
  setAttachmentsToDelete(null);
}
