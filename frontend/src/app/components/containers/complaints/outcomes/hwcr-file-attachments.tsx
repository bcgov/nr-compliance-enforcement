import { FC, useState } from "react";
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
import { Button } from "react-bootstrap";
import AttachmentEnum from "../../../../constants/attachment-enum";
import { clearAttachments, getAttachments } from "../../../../store/reducers/attachments";

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

  const [outcomeAttachmentCount, setOutcomeAttachmentCount] = useState<number>(0);

  const handleSlideCountChange = (count: number) => {
    setOutcomeAttachmentCount(count);
  };

  const saveButtonClick = async () => {
    if (!hasValidationErrors()) {
      handlePersistAttachments(
        dispatch,
        attachmentsToAdd,
        attachmentsToDelete,
        id,
        setAttachmentsToAdd,
        setAttachmentsToDelete,
        AttachmentEnum.OUTCOME_ATTACHMENT,
      );
    } else {
      ToggleError("Errors in form");
    }
  };

  const cancelConfirmed = () => {
    setAttachmentsToAdd([]);
    setAttachmentsToDelete([]);
    dispatch(clearAttachments);
    dispatch(getAttachments(id, AttachmentEnum.OUTCOME_ATTACHMENT));
  };

  const cancelButtonClick = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel Changes?",
          description: "Your changes will be lost.",
          cancelConfirmed,
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
    <div className="comp-outcome-report-block" id="outcome_attachments_div_id">
      <h6>Outcome attachments ({outcomeAttachmentCount})</h6>
      <div className="comp-outcome-report-complaint-attachments">
        <AttachmentsCarousel
          attachmentType={AttachmentEnum.OUTCOME_ATTACHMENT}
          complaintIdentifier={id}
          allowUpload={true}
          allowDelete={true}
          onFilesSelected={onHandleAddAttachments}
          onFileDeleted={onHandleDeleteAttachment}
          onSlideCountChange={handleSlideCountChange}
        />
        <div className="comp-outcome-report-block">
          <div className="comp-outcome-report-container">
            <div className="comp-outcome-report-actions">
              <Button
                id="outcome-cancel-button"
                title="Cancel Outcome"
                className="comp-outcome-cancel"
                onClick={cancelButtonClick}
              >
                Cancel
              </Button>
              <Button
                id="outcome-save-button"
                title="Save Outcome"
                className="comp-outcome-save"
                onClick={saveButtonClick}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
