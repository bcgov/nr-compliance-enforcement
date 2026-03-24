import { FC } from "react";
import { Button } from "react-bootstrap";

interface StepModalFooterProps {
  currentStep: number;
  totalSteps: number;
  onCancel: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
}

export const StepModalFooter: FC<StepModalFooterProps> = ({
  currentStep,
  totalSteps,
  onCancel,
  onPrevious,
  onNext,
  onSave,
}) => {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="comp-details-form-buttons w-100 d-flex justify-content-between">
      <div>
        {currentStep > 0 && (
          <Button
            variant="outline-primary"
            onClick={onPrevious}
          >
            <i className="bi bi-arrow-left-circle" />
            <span>Previous</span>
          </Button>
        )}
      </div>
      <div className="d-flex gap-2">
        <Button
          variant="outline-primary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        {isLastStep ? (
          <Button
            variant="primary"
            onClick={onSave}
          >
            <i className="bi bi-check-circle" />
            <span>Save</span>
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={onNext}
          >
            <span>Next</span>
            <i className="bi bi-arrow-right-circle ms-1" />
          </Button>
        )}
      </div>
    </div>
  );
};
