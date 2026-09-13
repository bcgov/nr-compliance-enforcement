import { FC, ReactNode, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectTaskStatus } from "@/app/store/reducers/code-table-selectors";
import { CompSelect } from "@/app/components/common/comp-select";
import type {
  CreateUpdateTaskInput,
  Inspection,
  Investigation,
  Task,
  UpdateInspectionInput,
  UpdateInvestigationInput,
} from "@/generated/graphql";

export type StatusChangeAdvisoryVariant = "blocked" | "confirm";

export interface StatusChangeAdvisoryDetail {
  id: string;
  content: ReactNode;
}

export interface StatusChangeAdvisory {
  variant: StatusChangeAdvisoryVariant;
  heading: ReactNode;
  subheading?: ReactNode;
  details?: StatusChangeAdvisoryDetail[];
}

interface ChangeStatusModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (
    input: UpdateInvestigationInput | CreateUpdateTaskInput | UpdateInspectionInput,
    investigationGuid?: string | null,
  ) => Promise<void>;
  data: Investigation | Task | Inspection | undefined;
  type: "investigation" | "task" | "inspection";
  isSaving: boolean;
  statusAdvisories?: Record<string, StatusChangeAdvisory>;
}

export const ChangeStatusModal: FC<ChangeStatusModalProps> = ({
  show,
  onHide,
  onSave,
  data,
  type,
  isSaving,
  statusAdvisories,
}) => {
  const taskStatuses = useAppSelector(selectTaskStatus);
  const statusOptions = taskStatuses.map((s) => ({
    value: String(s.value ?? ""),
    label: String(s.label ?? ""),
  }));

  const [selectedStatus, setSelectedStatus] = useState<string>("");
  let initialStatus = "";
  switch (type) {
    case "investigation":
      initialStatus = (data as Investigation)?.investigationStatus?.investigationStatusCode ?? "";
      break;
    case "task":
      initialStatus = (data as Task)?.taskStatusCode ?? "";
      break;
    case "inspection":
      initialStatus = (data as Inspection)?.inspectionStatus?.inspectionStatusCode ?? "";
      break;
  }
  const isDirty = selectedStatus !== initialStatus;

  // Only show guidance once the user has moved away from the current status.
  const activeAdvisory = isDirty ? statusAdvisories?.[selectedStatus] : undefined;
  const isBlocked = activeAdvisory?.variant === "blocked";

  useEffect(() => {
    if (show) {
      setSelectedStatus(initialStatus);
    } else {
      setSelectedStatus("");
    }
  }, [show, initialStatus]);

  const handleClose = () => {
    if (isDirty) {
      const confirmed = globalThis.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirmed) return;
    }
    setSelectedStatus(initialStatus);
    onHide();
  };

  const handleSave = async () => {
    switch (type) {
      case "investigation":
        if ((data as Investigation)?.investigationGuid) {
          const input: UpdateInvestigationInput = {
            investigationStatus: selectedStatus || undefined,
          };
          await onSave(input, (data as Investigation)?.investigationGuid);
        }
        break;
      case "task": {
        const input: CreateUpdateTaskInput = {
          taskIdentifier: (data as Task)?.taskIdentifier,
          investigationIdentifier: (data as Task)?.investigationIdentifier,
          taskStatusCode: selectedStatus || undefined,
          assignedUserIdentifier: (data as Task)?.assignedUserIdentifier ?? undefined,
          appUserIdentifier: (data as Task)?.createdByUserIdentifier ?? undefined,
          description: (data as Task)?.description ?? undefined,
        };
        await onSave(input);
        break;
      }
      case "inspection":
        if ((data as Inspection)?.inspectionGuid) {
          const input: UpdateInspectionInput = {
            inspectionStatus: selectedStatus || undefined,
          };
          await onSave(input, (data as Inspection)?.inspectionGuid);
        }
        break;
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header
        closeButton
        className="pb-0"
      >
        <Modal.Title>Update status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label
            htmlFor="task-status-select"
            className="form-label"
          >
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
            showInactive={false}
            enableValidation={false}
          />
        </div>
        {activeAdvisory && (
          <>
            <div
              className="alert alert-warning d-flex gap-2"
              role="alert"
            >
              <i
                className="bi bi-check-circle-fill"
                aria-hidden="true"
              />
              <div>
                <div>{activeAdvisory.heading}</div>
                {activeAdvisory.subheading && <div>{activeAdvisory.subheading}</div>}
              </div>
            </div>
            {activeAdvisory.details?.map((detail) => (
              <div
                key={detail.id}
                className="comp-status-advisory-detail"
              >
                {detail.content}
              </div>
            ))}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
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
          disabled={isSaving || !selectedStatus || isBlocked}
        >
          {isSaving ? "Updating..." : "Update"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
