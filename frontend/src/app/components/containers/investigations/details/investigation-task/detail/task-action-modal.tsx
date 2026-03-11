import { FC, useState, useCallback, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { ActivityNote, ActivityNoteInput } from "@/generated/graphql";
import { ActivityNoteEditor } from "@/app/components/common/activity-note";
import { useAppSelector } from "@/app/hooks/hooks";
import { appUserGuid as selectAppUserGuid } from "@/app/store/reducers/app";

interface TaskActionModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (input: ActivityNoteInput) => Promise<void>;
  investigationGuid: string;
  taskIdentifier: string;
  taskAction: ActivityNote | null;
  isSaving: boolean;
}

export const TaskActionModal: FC<TaskActionModalProps> = ({
  show,
  onHide,
  onSave,
  investigationGuid,
  taskIdentifier,
  taskAction,
  isSaving,
}) => {
  const currentUserGuid = useAppSelector(selectAppUserGuid);
  const [editValues, setEditValues] = useState<Partial<ActivityNoteInput>>({});
  const [isValid, setIsValid] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const handleValuesChange = useCallback((values: Partial<ActivityNoteInput>) => {
    setEditValues(values);
  }, []);

  useEffect(() => {
    if (show) {
      setEditValues({});
      setShowErrors(false);
    }
  }, [show, taskAction?.activityNoteGuid]);

  const handleValidationChange = useCallback((valid: boolean) => {
    setIsValid(valid);
  }, []);

  const handleSave = async () => {
    setShowErrors(true);
    if (!isValid) return;
    const input: ActivityNoteInput = {
      ...editValues,
      investigationGuid,
      taskGuid: taskIdentifier,
      activityNoteCode: "TASKACT",
      activityNoteGuid: taskAction?.activityNoteGuid ?? editValues.activityNoteGuid,
      reportedAppUserGuidRef: currentUserGuid,
    };
    await onSave(input);
  };

  const handleClose = () => {
    setShowErrors(false);
    setEditValues({});
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton className="pb-0">
        <Modal.Title>{taskAction ? "Edit task action" : "Add task action"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ActivityNoteEditor
          initialData={taskAction ?? undefined}
          onValuesChange={handleValuesChange}
          onValidationChange={handleValidationChange}
          showErrors={showErrors}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={handleClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
