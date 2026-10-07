import { FC, useState, useCallback, useEffect } from "react";
import { Alert, Modal } from "react-bootstrap";
import { ActivityNoteInput } from "@/generated/graphql";
import { useAppSelector } from "@/app/hooks/hooks";
import { appUserGuid as selectAppUserGuid, selectModalData } from "@/app/store/reducers/app";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";
import { SAVE_ACTIVITY_NOTE, DELETE_ACTIVITY_NOTE, ActivityNoteEditor } from "@/app/components/common/activity-note";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { ActivityNoteEnum } from "@/app/types/app/activity-note";
import { ModalFooter } from "@/app/components/modal/modal-footer";

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
      ToggleSuccess(`${activityNoteLabel} deleted successfully`);
      submit();
    },
    onError: () => {
      ToggleError(`Failed to delete ${activityNoteLabel.toLowerCase()}`);
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
                <p className="mb-0">
                  Are you sure you want to delete this {activityNoteLabel.toLowerCase()}? This action cannot be undone.
                </p>
              </span>
            </div>
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <ModalFooter
          isEdit={activityNote}
          showDeleteConfirm={showDeleteConfirm}
          isSaving={isSaving}
          onCancel={handleClose}
          onSave={handleSave}
          onDelete={() => setShowDeleteConfirm(true)}
          onConfirmDelete={handleConfirmDelete}
        />
      </Modal.Footer>
    </>
  );
};
