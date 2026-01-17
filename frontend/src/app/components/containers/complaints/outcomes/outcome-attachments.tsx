import { FC, useCallback, useEffect, useState } from "react";
import { Attachments } from "@components/common/attachments-carousel";
import { COMSObject } from "@apptypes/coms/object";
import { handleAddAttachments, handleDeleteAttachments, handlePersistAttachments } from "@common/attachment-utils";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { openModal } from "@store/reducers/app";
import { useParams } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import AttachmentEnum from "@constants/attachment-enum";
import { BsExclamationCircleFill } from "react-icons/bs";
import { setIsInEdit } from "@/app/store/reducers/complaint-outcomes";
import { selectComplaintViewMode } from "@/app/store/reducers/complaints";
import { DismissToast, ToggleInformation } from "@/app/common/toast";
import { Id } from "react-toastify";

export const OutcomeAttachments: FC = () => {
  type ComplaintParams = {
    id: string;
    complaintType: string;
  };

  const { id = "" } = useParams<ComplaintParams>();

  const DISPLAY_STATE = 0;
  const EDIT_STATE = 1;

  const dispatch = useAppDispatch();
  const isInEdit = useAppSelector((state) => state.complaintOutcomes.isInEdit);
  const isReadOnly = useAppSelector(selectComplaintViewMode);

  const [attachmentsToAdd, setAttachmentsToAdd] = useState<File[] | null>(null);
  const [attachmentsToDelete, setAttachmentsToDelete] = useState<COMSObject[] | null>(null);
  const [outcomeAttachmentCount, setOutcomeAttachmentCount] = useState<number>(0);
  const [componentState, setComponentState] = useState<number>(DISPLAY_STATE);
  const [isPendingUpload, setIsPendingUpload] = useState<boolean>(false);
  const [attachmentRefreshKey, setAttachmentRefreshKey] = useState<number>(0);

  const hasAttachments = outcomeAttachmentCount > 0;
  const isEditing = componentState === EDIT_STATE;
  const shouldShowCard = hasAttachments || isEditing;

  const showSectionErrors = isEditing && hasAttachments && isInEdit.showSectionErrors;

  useEffect(() => {
    dispatch(setIsInEdit({ attachments: isEditing }));
  }, [dispatch, isEditing]);

  const handleSlideCountChange = useCallback((count: number) => {
    setOutcomeAttachmentCount((prev) => (prev === count ? prev : count));
  }, []);

  const onHandleAddAttachments = (selectedFiles: File[]) => {
    handleAddAttachments(setAttachmentsToAdd, selectedFiles);
  };

  const onHandleDeleteAttachment = (fileToDelete: COMSObject) => {
    handleDeleteAttachments(attachmentsToAdd, setAttachmentsToAdd, setAttachmentsToDelete, fileToDelete);
  };

  const saveButtonClick = async () => {
    let toastId: Id | undefined;

    if (attachmentsToAdd?.length) {
      toastId = ToggleInformation("Upload in progress, do not close the NatSuite application.", { autoClose: false });
    }

    await handlePersistAttachments({
      dispatch,
      attachmentsToAdd,
      attachmentsToDelete,
      identifier: id,
      subIdentifier: undefined,
      setAttachmentsToAdd,
      setAttachmentsToDelete,
      attachmentType: AttachmentEnum.OUTCOME_ATTACHMENT,
      isSynchronous: false,
    });

    if (toastId) DismissToast(toastId);
    setAttachmentRefreshKey((k) => k + 1);
    setComponentState(DISPLAY_STATE);
  };

  const cancelConfirmed = () => {
    if (!hasAttachments) {
      setComponentState(EDIT_STATE);
      return;
    }

    setAttachmentsToAdd([]);
    setAttachmentsToDelete([]);
    setIsPendingUpload(true);
    setComponentState(DISPLAY_STATE);
    setAttachmentRefreshKey((k) => k + 1);
  };

  const cancelButtonClick = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel changes?",
          description: "Your changes will be lost.",
          cancelConfirmed,
        },
      }),
    );
  };

  return (
    <section
      className="comp-details-section"
      id="outcome-attachments"
    >
      <div className="comp-details-section-header">
        <h3>Outcome attachments ({outcomeAttachmentCount})</h3>

        {componentState === DISPLAY_STATE && hasAttachments && (
          <div className="comp-details-section-header-actions">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setComponentState(EDIT_STATE)}
              disabled={isReadOnly}
            >
              <i className="bi bi-pencil" />
              <span>Edit</span>
            </Button>
          </div>
        )}
      </div>

      {!shouldShowCard && (
        <Button
          variant="primary"
          id="outcome-report-add-attachment"
          onClick={() => setComponentState(EDIT_STATE)}
          disabled={isReadOnly}
        >
          <i className="bi bi-plus-circle" />
          <span>Add attachments</span>
        </Button>
      )}

      <Card
        border={showSectionErrors ? "danger" : "default"}
        style={{ display: shouldShowCard ? "block" : "none" }}
      >
        <Card.Body>
          {showSectionErrors && (
            <div className="section-error-message mb-4">
              <BsExclamationCircleFill />
              <span>Save section before closing the complaint.</span>
            </div>
          )}

          <Attachments
            attachmentType={AttachmentEnum.OUTCOME_ATTACHMENT}
            identifier={id}
            allowUpload={isEditing}
            allowDelete={isEditing}
            cancelPendingUpload={isPendingUpload}
            setCancelPendingUpload={setIsPendingUpload}
            onFilesSelected={onHandleAddAttachments}
            onFileDeleted={onHandleDeleteAttachment}
            onSlideCountChange={handleSlideCountChange}
            disabled={isReadOnly}
            refreshKey={attachmentRefreshKey}
            showPreview={hasAttachments}
          />

          {isEditing && (
            <div className="comp-details-form-buttons">
              <Button
                variant="outline-primary"
                onClick={cancelButtonClick}
                disabled={isReadOnly}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={saveButtonClick}
                disabled={isReadOnly}
              >
                Save
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </section>
  );
};
