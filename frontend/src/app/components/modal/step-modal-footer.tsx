import { FC } from "react";
import { Button } from "react-bootstrap";

interface StepModalFooterProps {
  currentStep: number;
  totalSteps: number;
  isEdit: boolean;
  isSaving: boolean;
  deleteFromStep?: number; // When set, Delete is only shown for currentStep >= deleteFromStep
  showDeleteConfirm: boolean;
  onCancel: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
  onDelete: () => void;
  nextButtonLabel?: string; // When set, replaces the default "Next" label
  hidePreviousButton?: boolean;
}

export const StepModalFooter: FC<StepModalFooterProps> = ({
  currentStep,
  totalSteps,
  isEdit,
  isSaving,
  deleteFromStep = 0,
  showDeleteConfirm,
  onCancel,
  onPrevious,
  onNext,
  onSave,
  onDelete,
  nextButtonLabel,
  hidePreviousButton,
}) => {
  const isLastStep = currentStep === totalSteps - 1;
  const showDelete = isEdit && currentStep >= deleteFromStep;

  return (
    <div className="comp-details-form-buttons w-100 d-flex justify-content-between">
      <div className="d-flex gap-2">
        {showDelete && (
          <Button
            variant="outline-danger"
            onClick={onDelete}
            disabled={showDeleteConfirm || isSaving}
          >
            <i className="bi bi-trash me-1" />
            <span>Delete</span>
          </Button>
        )}
        {currentStep > 0 && !hidePreviousButton && (
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
            {nextButtonLabel ? (
              <span>{nextButtonLabel}</span>
            ) : (
              <>
                <span>Next</span>
                <i className="bi bi-arrow-right-circle ms-1" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
