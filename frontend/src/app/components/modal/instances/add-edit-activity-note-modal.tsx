import { FC, useState, useCallback, useEffect } from "react";
import { Alert, Modal, Button } from "react-bootstrap";
import { ActivityNoteInput } from "@/generated/graphql";
import { useAppSelector } from "@/app/hooks/hooks";
import { appUserGuid as selectAppUserGuid, selectModalData } from "@/app/store/reducers/app";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";
import { SAVE_ACTIVITY_NOTE, DELETE_ACTIVITY_NOTE, ActivityNoteEditor } from "@/app/components/common/activity-note";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { ActivityNoteEnum } from "@/app/types/app/activity-note";

type AddEditActivityNoteModalProps = {
  close: () => void;
  submit: () => void;
};

export const AddEditActivityNoteModal: FC<AddEditActivityNoteModalProps> = ({ close, submit }) => {
  const modalData = useAppSelector(selectModalData);
  const { investigationGuid, taskIdentifier, activityNote, activityNoteCode, defaultAssignedUserGuid, onDirtyChange } =
    modalData ?? {};
  const currentUserGuid = useAppSelector(selectAppUserGuid);

  const [editValues, setEditValues] = useState<Partial<ActivityNoteInput>>({});
  const [isValid, setIsValid] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { markDirty, markClean } = useFormDirtyState(onDirtyChange);

  const activityNoteLabel = ActivityNoteEnum[activityNoteCode as keyof typeof ActivityNoteEnum] ?? "";

  const saveMutation = useGraphQLMutation(SAVE_ACTIVITY_NOTE, {
    onSuccess: () => {
      ToggleSuccess(`${activityNoteLabel} saved successfully`);
      submit();
    },
    onError: () => {
      ToggleError(`Failed to save ${activityNoteLabel.toLowerCase()}`);
    },
  });

  const deleteMutation = useGraphQLMutation(DELETE_ACTIVITY_NOTE, {
    onSuccess: () => {
      ToggleSuccess(`${activityNoteLabel} saved successfully`);
      submit();
    },
    onError: () => {
      ToggleError(`Failed to save ${activityNoteLabel.toLowerCase()}`);
    },
  });

  const isSaving = saveMutation.isPending || deleteMutation.isPending;

  const handleValuesChange = useCallback((values: Partial<ActivityNoteInput>) => {
    setEditValues(values);
  }, []);

  const handleValidationChange = useCallback((valid: boolean) => {
    setIsValid(valid);
  }, []);

  useEffect(() => {
    setShowErrors(false);
  }, [activityNote?.activityNoteGuid]);

  const handleSave = async () => {
    setShowErrors(true);

    // A task action must belong to a task; other activity notes (e.g. continuation report entries) have no task
    const isMissingTask = activityNoteCode === "TASKACT" && !taskIdentifier;
    if (!isValid || isMissingTask) return;

    const input: ActivityNoteInput = {
      ...editValues,
      investigationGuid,
      taskGuid: taskIdentifier,
      activityNoteCode,
      activityNoteGuid: activityNote?.activityNoteGuid ?? editValues.activityNoteGuid,
      // Keep the original reporter when editing; the editor is recorded in the edited fields below
      reportedAppUserGuidRef: activityNote?.reportedAppUserGuidRef ?? currentUserGuid,
      reportedTimestamp: activityNote?.reportedTimestamp ?? new Date(),
      ...(activityNote ? { editedTimestamp: new Date(), editedAppUserGuidRef: currentUserGuid } : {}),
    };
    await saveMutation.mutateAsync({ input });
  };

  const handleClose = () => {
    if (showDeleteConfirm) {
      setShowDeleteConfirm(false);
      return;
    }
    setShowErrors(false);
    setEditValues({});
    close();
  };

  const handleConfirmDelete = async () => {
    if (!activityNote?.activityNoteGuid) return;
    await deleteMutation.mutateAsync({ activityNoteGuid: activityNote.activityNoteGuid });
    setShowDeleteConfirm(false);
    setShowErrors(false);
    setEditValues({});
  };

  return (
    <>
      <Modal.Header
        closeButton
        className="pb-0"
      >
        <Modal.Title>
          {activityNote ? `Edit ${activityNoteLabel.toLowerCase()}` : `Add ${activityNoteLabel.toLowerCase()}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ActivityNoteEditor
          initialData={activityNote ?? undefined}
          onValuesChange={handleValuesChange}
          onValidationChange={handleValidationChange}
          onDirtyChange={(_index, dirty) => (dirty ? markDirty() : markClean())}
          showErrors={showErrors}
          defaultAssignedUserGuid={defaultAssignedUserGuid}
        />

        {activityNote && showDeleteConfirm && (
          <Alert
            variant="danger"
            className="comp-complaint-details-alert mt-3"
          >
            <div className="d-flex align-items-start gap-2">
              <i className="bi bi-info-circle mt-2" />
              <span>
                <strong>Delete {activityNoteLabel.toLowerCase()}</strong>
                <p className="mb-3">
                  Are you sure you want to delete this {activityNoteLabel.toLowerCase()}? This action cannot be undone.
                </p>
              </span>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-primary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                disabled={isSaving}
              >
                <i className="bi bi-trash me-1" />
                <span>Confirm Delete</span>
              </Button>
            </div>
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="comp-details-form-buttons w-100 d-flex justify-content-between">
          {activityNote && (
            <Button
              variant="outline-danger"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSaving || showDeleteConfirm}
            >
              <i className="bi bi-trash me-1" />
              <span>Delete</span>
            </Button>
          )}
          <div className="d-flex gap-2 ms-auto">
            <Button
              variant="outline-primary"
              onClick={handleClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving || showDeleteConfirm}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </>
  );
};
