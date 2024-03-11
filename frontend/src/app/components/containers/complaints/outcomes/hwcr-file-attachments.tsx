import { FC, useEffect, useState } from "react";
import { AttachmentsCarousel } from "../../../common/attachments-carousel";
import { COMSObject } from "../../../../types/coms/object";
import {
  handleAddAttachments,
  handleDeleteAttachments,
  handlePersistAttachments,
} from "../../../../common/attachment-utils";
import { CANCEL_CONFIRM } from "../../../../types/modal/modal-types";
import { useAppDispatch } from "../../../../hooks/hooks";
import { ToggleError } from "../../../../common/toast";
import { openModal } from "../../../../store/reducers/app";
import { useParams } from "react-router-dom";

export const HWCRFileAttachments: FC = () => {
  type ComplaintParams = {
    id: string;
    complaintType: string;
  };

  const { id = "" } = useParams<ComplaintParams>();

  const dispatch = useAppDispatch();

  // files to add to COMS when complaint is saved
  const [attachmentsToAdd, setAttachmentsToAdd] = useState<File[] | null>(null);
  // files to remove from COMS when complaint is saved
  const [attachmentsToDelete, setAttachmentsToDelete] = useState<COMSObject[] | null>(null);

  const saveButtonClick = async () => {
    if (!hasValidationErrors()) {
      const additionalHeader = {
        "x-amz-meta-is-case": "Y",
      };

      handlePersistAttachments(
        dispatch,
        attachmentsToAdd,
        attachmentsToDelete,
        id,
        setAttachmentsToAdd,
        setAttachmentsToDelete,
        additionalHeader,
      );
    } else {
      ToggleError("Errors in form");
    }
  };

  const resetErrorMessages = () => {
    setAttachmentsToAdd(null);
    setAttachmentsToDelete(null);
  };

  const cancelButtonClick = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel Changes?",
          description: "Your changes will be lost.",
          cancelConfirmed: resetErrorMessages,
        },
      }),
    );
  };

  const onHandleAddAttachments = (selectedFiles: File[]) => {
    handleAddAttachments(setAttachmentsToAdd, selectedFiles);
  };

  const onHandleDeleteAttachment = (fileToDelete: COMSObject) => {
    handleDeleteAttachments(attachmentsToAdd, setAttachmentsToAdd, setAttachmentsToDelete, fileToDelete);
  };

  const hasValidationErrors = () => {
    const noErrors = false;

    return noErrors;
  };

  return (
    <AttachmentsCarousel
      title={"Outcome attachments"}
      complaintIdentifier={id}
      allowUpload={true}
      allowDelete={true}
      onFilesSelected={onHandleAddAttachments}
      onFileDeleted={onHandleDeleteAttachment}
    />
  );
};
