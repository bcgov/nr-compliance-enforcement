import { FC, useCallback, useEffect, useState } from "react";
import { AttachmentsCarousel } from "@components/common/attachments-carousel";
import { COMSObject } from "@apptypes/coms/object";
import { handleAddAttachments, handleDeleteAttachments, handlePersistAttachments } from "@common/attachment-utils";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { openModal } from "@store/reducers/app";
import { useParams } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import AttachmentEnum from "@constants/attachment-enum";
import { clearAttachments } from "@store/reducers/attachments";
import { BsExclamationCircleFill } from "react-icons/bs";
import { setIsInEdit } from "@/app/store/reducers/complaint-outcomes";
import { selectComplaintViewMode } from "@/app/store/reducers/complaints";

type props = {
  showAddButton?: boolean;
};

export const OutcomeAttachments: FC<props> = ({ showAddButton = false }) => {
  type ComplaintParams = {
    id: string;
    complaintType: string;
  };

  const { id = "", complaintType = "" } = useParams<ComplaintParams>();

  const DISPLAY_STATE = 0;
  const EDIT_STATE = 1;

  const dispatch = useAppDispatch();
  const isInEdit = useAppSelector((state) => state.complaintOutcomes.isInEdit);
  const isReadOnly = useAppSelector(selectComplaintViewMode);

  // files to add to COMS when complaint is saved
  const [attachmentsToAdd, setAttachmentsToAdd] = useState<File[] | null>(null);
  // files to remove from COMS when complaint is saved
  const [attachmentsToDelete, setAttachmentsToDelete] = useState<COMSObject[] | null>(null);
  const [outcomeAttachmentCount, setOutcomeAttachmentCount] = useState<number>(0);
  const [componentState, setComponentState] = useState<number>(outcomeAttachmentCount > 0 ? DISPLAY_STATE : EDIT_STATE);
  const [isPendingUpload, setIsPendingUpload] = useState<boolean>(false);
  const [attachmentRefreshKey, setAttachmentRefreshKey] = useState<number>(0);

  // state to manage the visibility of the card when showAddButton is true
  const [isCardVisible, setIsCardVisible] = useState<boolean>(!showAddButton);

  const showSectionErrors = componentState === EDIT_STATE && outcomeAttachmentCount > 0 && isInEdit.showSectionErrors;

  useEffect(() => {
    dispatch(setIsInEdit({ attachments: componentState === EDIT_STATE }));
  }, [dispatch, componentState]);

  useEffect(() => {
    if (showAddButton) {
      return;
    }

    setIsCardVisible(componentState === EDIT_STATE || outcomeAttachmentCount > 0);
  }, [componentState, outcomeAttachmentCount, showAddButton]);

  const handleSlideCountChange = useCallback(
    (count: number) => {
      setOutcomeAttachmentCount(count);
    },
    [setOutcomeAttachmentCount],
  );

  const saveButtonClick = async () => {
    //initial state when there is no attachments
    if (outcomeAttachmentCount === 0) {
      if (showAddButton) setIsCardVisible(false);
      setComponentState(EDIT_STATE);
      return;
    }

    await handlePersistAttachments({
      dispatch,
      attachmentsToAdd,
      attachmentsToDelete,
      identifier: id,
      setAttachmentsToAdd,
      setAttachmentsToDelete,
      attachmentType: AttachmentEnum.OUTCOME_ATTACHMENT,
      complaintType,
    });
    setAttachmentRefreshKey((k) => k + 1);
    if (outcomeAttachmentCount === 0) {
      if (showAddButton) setIsCardVisible(false);
      setComponentState(EDIT_STATE);
    } else {
      setComponentState(DISPLAY_STATE);
    }
  };

  const cancelConfirmed = () => {
    //initial state when there is no attachments
    if (outcomeAttachmentCount === 0) {
      setComponentState(EDIT_STATE);
      if (showAddButton) setIsCardVisible(false);
      return;
    }

    if (outcomeAttachmentCount > 0) {
      setAttachmentsToAdd([]);
      dispatch(clearAttachments());
      setIsPendingUpload(true);
    }
    if (outcomeAttachmentCount > 0) {
      setComponentState(DISPLAY_STATE);
    } else {
      if (showAddButton) setIsCardVisible(false);
      setComponentState(EDIT_STATE);
    }
    setAttachmentsToDelete([]);
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

  const onHandleAddAttachments = (selectedFiles: File[]) => {
    handleAddAttachments(setAttachmentsToAdd, selectedFiles);
  };

  const onHandleDeleteAttachment = (fileToDelete: COMSObject) => {
    handleDeleteAttachments(attachmentsToAdd, setAttachmentsToAdd, setAttachmentsToDelete, fileToDelete);
  };

  return (
    <section
      className="comp-details-section"
      id="outcome-attachments"
    >
      <div className="comp-details-section-header">
        <h3>Outcome attachments ({outcomeAttachmentCount})</h3>

        {componentState === DISPLAY_STATE && (
          <div className="comp-details-section-header-actions">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={(e) => {
                setComponentState(EDIT_STATE);
              }}
              disabled={isReadOnly}
            >
              <i className="bi bi-pencil"></i>
              <span>Edit</span>
            </Button>
          </div>
        )}
      </div>

      {!isCardVisible && showAddButton && (
        <Button
          variant="primary"
          id="outcome-report-add-attachment"
          title="Add attachments"
          onClick={() => {
            setIsCardVisible(true);
          }}
          disabled={isReadOnly}
        >
          <i className="bi bi-plus-circle" />
          <span>Add attachments</span>
        </Button>
      )}

      {isCardVisible && (
        <Card border={showSectionErrors ? "danger" : "default"}>
          <Card.Body>
            {showSectionErrors && (
              <div className="section-error-message mb-4">
                <BsExclamationCircleFill />
                <span>Save section before closing the complaint.</span>
              </div>
            )}
            <AttachmentsCarousel
              attachmentType={AttachmentEnum.OUTCOME_ATTACHMENT}
              identifier={id}
              allowUpload={componentState === EDIT_STATE}
              allowDelete={componentState === EDIT_STATE}
              cancelPendingUpload={isPendingUpload}
              setCancelPendingUpload={setIsPendingUpload}
              onFilesSelected={onHandleAddAttachments}
              onFileDeleted={onHandleDeleteAttachment}
              onSlideCountChange={handleSlideCountChange}
              disabled={isReadOnly}
              refreshKey={attachmentRefreshKey}
            />
            {componentState === EDIT_STATE && (
              <div className="comp-details-form-buttons">
                <Button
                  variant="outline-primary"
                  id="outcome-cancel-button"
                  title="Cancel Outcome"
                  onClick={cancelButtonClick}
                  disabled={isReadOnly}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  id="outcome-save-button"
                  title="Save Outcome"
                  onClick={saveButtonClick}
                  disabled={isReadOnly}
                >
                  Save
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </section>
  );
};
