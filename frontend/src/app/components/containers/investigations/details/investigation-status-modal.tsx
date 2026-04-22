import { FC, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectTaskStatus } from "@/app/store/reducers/code-table-selectors";
import { CompSelect } from "@/app/components/common/comp-select";
import type { Investigation, UpdateInvestigationInput } from "@/generated/graphql";

interface InvestigationStatusModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (investigationGuid: string, input: UpdateInvestigationInput) => Promise<void>;
  investigation: Investigation | undefined;
  isSaving: boolean;
}

export const InvestigationStatusModal: FC<InvestigationStatusModalProps> = ({
  show,
  onHide,
  onSave,
  investigation,
  isSaving,
}) => {
  const taskStatuses = useAppSelector(selectTaskStatus);
  const statusOptions = taskStatuses.map((s) => ({
    value: String(s.value ?? ""),
    label: String(s.label ?? ""),
  }));

  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const initialStatus = investigation?.investigationStatus?.investigationStatusCode ?? "";
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
      const confirmed = globalThis.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirmed) return;
    }
    setSelectedStatus(initialStatus);
    onHide();
  };

  const handleSave = async () => {
    if (investigation?.investigationGuid) {
      const input: UpdateInvestigationInput = {
        investigationStatus: selectedStatus || undefined,
      };
      await onSave(investigation?.investigationGuid, input);
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
          disabled={isSaving || !selectedStatus}
        >
          {isSaving ? "Updating..." : "Update"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
