import { FC, useState, useCallback, useEffect } from "react";
import { Alert, Modal, Button } from "react-bootstrap";
import { ActivityNote, ActivityNoteInput } from "@/generated/graphql";
import { ActivityNoteEditor } from "@/app/components/common/activity-note";
import { useAppSelector } from "@/app/hooks/hooks";
import { appUserGuid as selectAppUserGuid } from "@/app/store/reducers/app";
import { selectModalData } from "@/app/store/reducers/app";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";
import { SAVE_ACTIVITY_NOTE, DELETE_ACTIVITY_NOTE } from "@/app/components/common/activity-note";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";

type AddEditTaskActionModalProps = {
  close: () => void;
  submit: () => void;
};

export const AddEditTaskActionModal: FC<AddEditTaskActionModalProps> = ({ close, submit }) => {
  const modalData = useAppSelector(selectModalData);
  const { investigationGuid, taskIdentifier, taskAction, onDirtyChange } = modalData ?? {};
  const currentUserGuid = useAppSelector(selectAppUserGuid);

  const [editValues, setEditValues] = useState<Partial<ActivityNoteInput>>({});
  const [isValid, setIsValid] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { markDirty, markClean } = useFormDirtyState(onDirtyChange);

  const saveMutation = useGraphQLMutation(SAVE_ACTIVITY_NOTE, {
    onSuccess: () => {
      ToggleSuccess("Task action saved successfully");
      submit();
    },
    onError: () => {
      ToggleError("Failed to save task action");
    },
  });

  const deleteMutation = useGraphQLMutation(DELETE_ACTIVITY_NOTE, {
    onSuccess: () => {
      ToggleSuccess("Task action deleted successfully");
      submit();
    },
    onError: () => {
      ToggleError("Failed to delete task action");
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
    setEditValues({});
    setShowErrors(false);
  }, [taskAction?.activityNoteGuid]);

  const handleSave = async () => {
    setShowErrors(true);
    if (!isValid || !taskIdentifier) return;
    const input: ActivityNoteInput = {
      ...editValues,
      investigationGuid,
      taskGuid: taskIdentifier,
      activityNoteCode: "TASKACT",
      activityNoteGuid: taskAction?.activityNoteGuid ?? editValues.activityNoteGuid,
      reportedAppUserGuidRef: currentUserGuid,
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
    if (!taskAction?.activityNoteGuid) return;
    await deleteMutation.mutateAsync({ activityNoteGuid: taskAction.activityNoteGuid });
    setShowDeleteConfirm(false);
    setShowErrors(false);
    setEditValues({});
  };

  return (
    <>
      <Modal.Header closeButton className="pb-0">
        <Modal.Title>{taskAction ? "Edit task action" : "Add task action"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ActivityNoteEditor
          initialData={taskAction ?? undefined}
          onValuesChange={handleValuesChange}
          onValidationChange={handleValidationChange}
          onDirtyChange={(_index, dirty) => (dirty ? markDirty() : markClean())}
          showErrors={showErrors}
        />

        {taskAction && showDeleteConfirm && (
          <Alert variant="danger" className="comp-complaint-details-alert mt-3">
            <div className="d-flex align-items-start gap-2">
              <i className="bi bi-info-circle mt-2" />
              <span>
                <strong>Delete task action</strong>
                <p className="mb-3">
                  Are you sure you want to delete this task action? This action cannot be undone.
                </p>
              </span>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-primary" onClick={() => setShowDeleteConfirm(false)}>
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
          {taskAction && (
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
            <Button variant="outline-primary" onClick={handleClose} disabled={isSaving}>
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
