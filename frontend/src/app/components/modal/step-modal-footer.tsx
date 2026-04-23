import { FC } from "react";
import { Button } from "react-bootstrap";

interface StepModalFooterProps {
  currentStep: number;
  totalSteps: number;
  isEdit: boolean;
  isSaving: boolean;
  showDeleteConfirm: boolean;
  onCancel: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export const StepModalFooter: FC<StepModalFooterProps> = ({
  currentStep,
  totalSteps,
  isEdit,
  isSaving,
  showDeleteConfirm,
  onCancel,
  onPrevious,
  onNext,
  onSave,
  onDelete,
}) => {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="comp-details-form-buttons w-100 d-flex justify-content-between">
      <div className="d-flex gap-2">
        {isEdit && (
          <Button
            variant="outline-danger"
            onClick={onDelete}
            disabled={showDeleteConfirm || isSaving}
          >
            <i className="bi bi-trash me-1" />
            <span>Delete</span>
          </Button>
        )}
        {currentStep > 0 && (
          <Button
            variant="outline-primary"
            onClick={onPrevious}
            disabled={showDeleteConfirm || isSaving}
          >
            <i className="bi bi-arrow-left-circle" />
            <span>Previous</span>
          </Button>
        )}
      </div>

      {/* Right side: Cancel + Next/Save */}
      <div className="d-flex gap-2">
        <Button
          variant="outline-primary"
          onClick={onCancel}
          disabled={showDeleteConfirm || isSaving}
        >
          Cancel
        </Button>
        {isLastStep ? (
          <Button
            variant="primary"
            onClick={onSave}
            disabled={showDeleteConfirm || isSaving}
          >
            <i className="bi bi-check-circle" />
            <span>Save</span>
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={onNext}
            disabled={showDeleteConfirm || isSaving}
          >
            <span>Next</span>
            <i className="bi bi-arrow-right-circle ms-1" />
          </Button>
        )}
      </div>
    </div>
  );
};
