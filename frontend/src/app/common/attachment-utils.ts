import {
  deleteAttachments,
  saveAttachments,
} from "../store/reducers/attachments";
import { COMSObject } from "../types/coms/object";

export const handleAddAttachments = (
    setAttachmentsToAdd: React.Dispatch<React.SetStateAction<File[] | null>>, 
    selectedFiles: File[]
) => {
    setAttachmentsToAdd(prevFiles => prevFiles ? [...prevFiles, ...selectedFiles] : selectedFiles);
};

export const handleDeleteAttachments = (
    attachmentsToAdd: File[] | null,
    setAttachmentsToAdd: React.Dispatch<React.SetStateAction<File[] | null>>,
    setAttachmentsToDelete: React.Dispatch<React.SetStateAction<COMSObject[] | null>>,
    fileToDelete: COMSObject
) => {
    if (!fileToDelete.pendingUpload) {
        setAttachmentsToDelete(prevFiles => prevFiles ? [...prevFiles, fileToDelete] : [fileToDelete]);
    } else if (attachmentsToAdd) {
        setAttachmentsToAdd(prevAttachments => prevAttachments ? prevAttachments.filter(file => file.name !== fileToDelete.name) : null);     
    }
};

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
