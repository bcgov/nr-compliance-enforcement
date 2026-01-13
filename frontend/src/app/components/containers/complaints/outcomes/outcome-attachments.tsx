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
  const [componentState, setComponentState] = useState<number>(EDIT_STATE);
  const [isPendingUpload, setIsPendingUpload] = useState<boolean>(false);
  const [attachmentRefreshKey, setAttachmentRefreshKey] = useState<number>(0);

  // state to manage the visibility of the card.  Default to true and hide in use effects
  const [isCardVisible, setIsCardVisible] = useState<boolean>(true);

  const showSectionErrors = componentState === EDIT_STATE && outcomeAttachmentCount > 0 && isInEdit.showSectionErrors;

  // Manage reduxState which is used for validation of closed complaints
  useEffect(() => {
    dispatch(setIsInEdit({ attachments: componentState === EDIT_STATE }));
  }, [dispatch, componentState]);

  // Manage component State which controls which buttons are visible
  useEffect(() => {
    // When attachments load from server and count > 0, switch to DISPLAY_STATE
    // But only if there are no pending uploads or deletions
    if (
      outcomeAttachmentCount > 0 &&
      componentState === EDIT_STATE &&
      (!attachmentsToAdd || attachmentsToAdd.length === 0) &&
      (!attachmentsToDelete || attachmentsToDelete.length === 0)
    ) {
      setComponentState(DISPLAY_STATE);
    }
  }, [outcomeAttachmentCount, attachmentsToAdd, attachmentsToDelete]);

  // Manages the Add buton behavior for differences between CEEB and COS attachments
  useEffect(() => {
    if (showAddButton) {
      // When showAddButton is true, show the card if attachments exist
      if (outcomeAttachmentCount > 0) {
        setIsCardVisible(true);
      }
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
    let toastId: Id;

    if (attachmentsToAdd) {
      toastId = ToggleInformation("Upload in progress, do not close the NatSuite application.", {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
      });
    }

    handlePersistAttachments({
      dispatch,
      attachmentsToAdd,
      attachmentsToDelete,
      identifier: id,
      subIdentifier: undefined,
      setAttachmentsToAdd,
      setAttachmentsToDelete,
      attachmentType: AttachmentEnum.OUTCOME_ATTACHMENT,
      isSynchronous: false,
    }).then(() => {
      if (attachmentsToAdd) {
        DismissToast(toastId);
      }
      setAttachmentRefreshKey((k) => k + 1);
    });

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
            <Attachments
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
              showPreview={true}
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
