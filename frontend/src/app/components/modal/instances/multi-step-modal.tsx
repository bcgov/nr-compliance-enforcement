import { FC, useCallback, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import { StepModalFooter } from "@/app/components/modal/step-modal-footer";

type MultiStepModalProps = {
  close: () => void;
  submit: () => void;
};

export const MultiStepModal: FC<MultiStepModalProps> = ({ close, submit }) => {
  const modalData = useAppSelector(selectModalData);
  const { titles, totalSteps, content, isEdit } = modalData;

  const [currentStep, setCurrentStep] = useState(0);
  const [validateFn, setValidateFn] = useState<((step: number) => Promise<boolean>) | null>(null);
  const [saveFn, setSaveFn] = useState<(() => Promise<void>) | null>(null);
  const [deleteFn, setDeleteFn] = useState<(() => Promise<void>) | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const title = titles?.[currentStep] ?? titles?.[0] ?? "";

  const handleNext = async () => {
    const isValid = await validateFn?.(currentStep);
    if (isValid) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSave = async () => {
    await saveFn?.();
  };

  const handleDeleteConfirmed = async () => {
    await deleteFn?.();
  };

  const handleRequestValidate = useCallback((fn: (step: number) => Promise<boolean>) => {
    setValidateFn(() => fn);
  }, []);

  const handleRequestSave = useCallback((fn: () => Promise<void>) => {
    setSaveFn(() => fn);
  }, []);

  const handleRequestDelete = useCallback((fn: () => Promise<void>) => {
    setDeleteFn(() => fn);
  }, []);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title as="h3">{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {content?.(currentStep, handleRequestValidate, handleRequestSave, handleRequestDelete, submit)}

        {showDeleteConfirm && (
          <Alert
            variant="danger"
            className="comp-complaint-details-alert mt-3"
          >
            <div className="d-flex align-items-start gap-2">
              <i className="bi bi-info-circle mt-2" />
              <span>
                <strong>Delete contravention</strong>
                <p className="mb-3">
                  Are you sure you want to delete this contravention? This action cannot be undone.
                </p>
              </span>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-primary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteConfirmed}
              >
                <i className="bi bi-trash me-1" />
                <span>Confirm delete</span>
              </Button>
            </div>
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        <StepModalFooter
          currentStep={currentStep}
          totalSteps={totalSteps}
          isEdit={!!isEdit}
          showDeleteConfirm={showDeleteConfirm}
          onCancel={close}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSave={handleSave}
          onDelete={() => setShowDeleteConfirm(true)}
        />
      </Modal.Footer>
    </>
  );
};
