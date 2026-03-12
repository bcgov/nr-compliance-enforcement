import { FC, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectTaskStatus } from "@/app/store/reducers/code-table-selectors";
import { CompSelect } from "@/app/components/common/comp-select";
import { Task } from "@/generated/graphql";
import type { CreateUpdateTaskInput } from "@/generated/graphql";

interface TaskStatusModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (input: CreateUpdateTaskInput) => Promise<void>;
  task: Task | undefined;
  investigationGuid: string;
  isSaving: boolean;
}

export const TaskStatusModal: FC<TaskStatusModalProps> = ({
  show,
  onHide,
  onSave,
  task,
  investigationGuid,
  isSaving,
}) => {
  const taskStatuses = useAppSelector(selectTaskStatus);
  const statusOptions = taskStatuses.map((s) => ({
    value: String(s.value ?? ""),
    label: String(s.label ?? ""),
  }));

  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const initialStatus = task?.taskStatusCode ?? "";
  const isDirty = selectedStatus !== initialStatus;

  useEffect(() => {
    if (show) {
      setSelectedStatus(initialStatus);
    } else {
      setSelectedStatus("");
    }
  }, [show, initialStatus]);

  const handleClose = () => {
    if (isDirty) {
      const confirmed = globalThis.confirm(
        "You have unsaved changes. Are you sure you want to leave?",
      );
      if (!confirmed) return;
    }
    setSelectedStatus(initialStatus);
    onHide();
  };

  const handleSave = async () => {
    const input: CreateUpdateTaskInput = {
      taskIdentifier: task?.taskIdentifier,
      investigationIdentifier: investigationGuid,
      taskTypeCode: task?.taskTypeCode ?? undefined,
      taskStatusCode: selectedStatus || undefined,
      assignedUserIdentifier: task?.assignedUserIdentifier ?? undefined,
      appUserIdentifier: task?.createdByUserIdentifier ?? undefined,
      description: task?.description ?? undefined,
    };
    await onSave(input);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="pb-0">
        <Modal.Title>Update status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label htmlFor="task-status-select" className="form-label">
            Status
          </label>
          <CompSelect
            id="task-status-select"
            classNamePrefix="comp-select"
            className="comp-details-input"
            options={statusOptions}
            value={statusOptions.find((opt) => opt.value === selectedStatus)}
            onChange={(option) => setSelectedStatus(option?.value ?? "")}
            placeholder="Select status"
            isClearable
            showInactive={false}
            enableValidation={false}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={handleClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving || !selectedStatus}
        >
          {isSaving ? "Updating..." : "Update"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

