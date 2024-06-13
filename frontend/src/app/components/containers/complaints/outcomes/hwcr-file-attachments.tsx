import { FC, useEffect, useState } from "react";
import { AttachmentsCarousel } from "../../../common/attachments-carousel";
import { COMSObject } from "../../../../types/coms/object";
import {
  handleAddAttachments,
  handleDeleteAttachments,
  handlePersistAttachments,
} from "../../../../common/attachment-utils";
import { CANCEL_CONFIRM } from "../../../../types/modal/modal-types";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { ToggleError } from "../../../../common/toast";
import { openModal } from "../../../../store/reducers/app";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import AttachmentEnum from "../../../../constants/attachment-enum";
import { clearAttachments, getAttachments, selectAttachments } from "../../../../store/reducers/attachments";
import { CompTextIconButton } from "../../../common/comp-text-icon-button";
import { BsPencil } from "react-icons/bs";

export const HWCRFileAttachments: FC = () => {
  type ComplaintParams = {
    id: string;
    complaintType: string;
  };

  const { id = "" } = useParams<ComplaintParams>();

  const DISPLAY_STATE = 0;
  const EDIT_STATE = 1;

  const dispatch = useAppDispatch();
  const carouselData = useAppSelector(selectAttachments(AttachmentEnum.OUTCOME_ATTACHMENT));

  // files to add to COMS when complaint is saved
  const [attachmentsToAdd, setAttachmentsToAdd] = useState<File[] | null>(null);
  // files to remove from COMS when complaint is saved
  const [attachmentsToDelete, setAttachmentsToDelete] = useState<COMSObject[] | null>(null);
  const [outcomeAttachmentCount, setOutcomeAttachmentCount] = useState<number>(0);
  const [componentState, setComponentState] = useState<number>(DISPLAY_STATE);
  const [cancelPendingUpload, setCancelPendingUpload] = useState<boolean>(false);

  useEffect(() => {
    if (carouselData.length > 0) {
      setComponentState(DISPLAY_STATE);
    } else setComponentState(EDIT_STATE);
  }, [carouselData]);

  const handleSlideCountChange = (count: number) => {
    setOutcomeAttachmentCount(count);
  };

  const saveButtonClick = async () => {
    //initial state when there is no attachments
    if (outcomeAttachmentCount === 0 && carouselData.length === 0) {
      setComponentState(EDIT_STATE);
      return;
    }

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
      if (outcomeAttachmentCount === 0) {
        setComponentState(EDIT_STATE);
      } else setComponentState(DISPLAY_STATE);
    } else {
      ToggleError("Errors in form");
    }
  };

  const cancelConfirmed = () => {
    //initial state when there is no attachments
    if (outcomeAttachmentCount === 0 && carouselData.length === 0) {
      setComponentState(EDIT_STATE);
      return;
    }

    if (outcomeAttachmentCount > 0) {
      setAttachmentsToAdd([]);
      dispatch(clearAttachments);
      setCancelPendingUpload(true);
    }
    if (carouselData.length > 0) {
      setComponentState(DISPLAY_STATE);
    } else {
      setComponentState(EDIT_STATE);
    }
    setAttachmentsToDelete([]);
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
    <section
      className="comp-details-section comp-outcome-report-block"
      id="outcome_attachments_div_id"
    >
      <h3>Outcome attachments ({outcomeAttachmentCount})</h3>
      <div className="comp-outcome-report-complaint-attachments">
        <div className="comp-details-edit-container">
          <div
            className="comp-details-edit-column"
            style={{ marginRight: "0px" }}
          >
            <AttachmentsCarousel
              attachmentType={AttachmentEnum.OUTCOME_ATTACHMENT}
              complaintIdentifier={id}
              allowUpload={componentState === EDIT_STATE}
              allowDelete={componentState === EDIT_STATE}
              cancelPendingUpload={cancelPendingUpload}
              setCancelPendingUpload={setCancelPendingUpload}
              onFilesSelected={onHandleAddAttachments}
              onFileDeleted={onHandleDeleteAttachment}
              onSlideCountChange={handleSlideCountChange}
            />
          </div>
          {componentState === DISPLAY_STATE && (
            <div
              className="comp-details-right-column"
              style={{ marginTop: "24px" }}
            >
              <CompTextIconButton
                buttonClasses="button-text"
                text="Edit"
                icon={BsPencil}
                click={(e) => setComponentState(EDIT_STATE)}
              />
            </div>
          )}
        </div>
        {componentState === EDIT_STATE && (
          <div
            className="comp-outcome-report-container"
            style={{ marginBottom: "24px" }}
          >
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
        )}
      </div>
    </section>
  );
};
