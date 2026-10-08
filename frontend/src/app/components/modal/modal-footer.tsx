import { FC } from "react";
import { Button } from "react-bootstrap";

interface ModalFooterProps {
  currentStep?: number;
  totalSteps?: number;
  isEdit: boolean;
  isSaving?: boolean;
  deleteFromStep?: number; // When set, Delete is only shown for currentStep >= deleteFromStep
  showDeleteConfirm: boolean;
  onCancel: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onSave: () => void;
  onDelete: () => void;
  onConfirmDelete: () => void;
  nextButtonLabel?: string; // When set, replaces the default "Next" label
  hidePreviousButton?: boolean;
  isReadOnly?: boolean;
  isBlocked?: boolean; // When true, Save/Next are disabled pending a decision inside the step content
}

export const ModalFooter: FC<ModalFooterProps> = ({
  currentStep = 0,
  totalSteps = 1,
  isEdit,
  isSaving,
  deleteFromStep = 0,
  showDeleteConfirm,
  onCancel,
  onPrevious,
  onNext,
  onSave,
  onDelete,
  onConfirmDelete,
  nextButtonLabel,
  hidePreviousButton,
  isReadOnly,
  isBlocked,
}) => {
  const isLastStep = currentStep === totalSteps - 1;
  const showDelete = !isReadOnly && isEdit && currentStep >= deleteFromStep;

  return (
    <div className="comp-details-form-buttons w-100 d-flex justify-content-between  mt-0">
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
          disabled={isBlocked || isSaving}
        >
          {isReadOnly ? "Close" : "Cancel"}
        </Button>
        {/* While the delete warning is showing, Confirm Delete replaces Next/Save */}
        {!isReadOnly && showDeleteConfirm && (
          <Button
            variant="danger"
            onClick={onConfirmDelete}
            disabled={isSaving}
          >
            <i className="bi bi-trash me-1" />
            <span>Confirm delete</span>
          </Button>
        )}
        {!isReadOnly &&
          !showDeleteConfirm &&
          (isLastStep ? (
            <Button
              variant="primary"
              onClick={onSave}
              disabled={isSaving || isBlocked}
            >
              <i className="bi bi-check-circle" />
              <span>Save</span>
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={onNext}
              disabled={isSaving || isBlocked}
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
          ))}
      </div>
    </div>
  );
};
