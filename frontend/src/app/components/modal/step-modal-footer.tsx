import { FC } from "react";
import { Button } from "react-bootstrap";

interface StepModalFooterProps {
  currentStep: number;
  totalSteps: number;
  isEdit: boolean;
  /** When set, Delete is only shown for `currentStep >= deleteFromStep` (e.g. hide on read-only step 0). */
  deleteFromStep?: number;
  showDeleteConfirm: boolean;
  onCancel: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
  onDelete: () => void;
  /** When set, replaces the default "Next" label (non-terminal steps only). */
  nextButtonLabel?: string;
  /** When true, the Previous button is never shown (e.g. contravention view → edit flow). */
  hidePreviousButton?: boolean;
}

export const StepModalFooter: FC<StepModalFooterProps> = ({
  currentStep,
  totalSteps,
  isEdit,
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
            disabled={showDeleteConfirm}
          >
            <i className="bi bi-trash me-1" />
            <span>Delete</span>
          </Button>
        )}
        {currentStep > 0 && !hidePreviousButton && (
          <Button
            variant="outline-primary"
            onClick={onPrevious}
            disabled={showDeleteConfirm}
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
          disabled={showDeleteConfirm}
        >
          Cancel
        </Button>
        {isLastStep ? (
          <Button
            variant="primary"
            onClick={onSave}
            disabled={showDeleteConfirm}
          >
            <i className="bi bi-check-circle" />
            <span>Save</span>
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={onNext}
            disabled={showDeleteConfirm}
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
