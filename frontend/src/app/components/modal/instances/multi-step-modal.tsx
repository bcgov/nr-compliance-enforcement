import { FC, useCallback, useState } from "react";
import { Alert, Modal } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import { ModalFooter } from "@/app/components/modal/modal-footer";

type MultiStepModalProps = {
  close: () => void;
  submit: () => void;
};

export const MultiStepModal: FC<MultiStepModalProps> = ({ close, submit }) => {
  const modalData = useAppSelector(selectModalData);
  const {
    titles,
    totalSteps,
    content,
    isEdit,
    deleteFromStep,
    skipValidateForSteps,
    nextButtonLabel,
    hidePreviousButton,
    isReadOnly,
    deleteEntityLabel = "item",
  } = modalData;

  const [currentStep, setCurrentStep] = useState(0);
  const [validateFn, setValidateFn] = useState<((step: number) => Promise<boolean>) | null>(null);
  const [saveFn, setSaveFn] = useState<(() => Promise<void>) | null>(null);
  const [deleteFn, setDeleteFn] = useState<(() => Promise<void>) | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const title = titles?.[currentStep] ?? titles?.[0] ?? "";

  const handleNext = async () => {
    const skipValidate = skipValidateForSteps?.includes(currentStep);
    if (!skipValidate) {
      const isValid = await validateFn?.(currentStep);
      if (!isValid) return;
    }
    setCurrentStep((prev) => prev + 1);
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

  const handleIsSavingChange = useCallback((saving: boolean) => {
    setIsSaving(saving);
  }, []);

  const handleIsBlockedChange = useCallback((blocked: boolean) => {
    setIsBlocked(blocked);
  }, []);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title as="h3">{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {content?.(
          currentStep,
          handleRequestValidate,
          handleRequestSave,
          handleRequestDelete,
          submit,
          handleIsSavingChange,
          handleIsBlockedChange,
        )}

        {showDeleteConfirm && (
          <Alert
            variant="danger"
            className="comp-complaint-details-alert mt-3 mb-0"
          >
            <div className="d-flex align-items-start gap-2">
              <i className="bi bi-info-circle" />
              <span>
                <strong>Delete {deleteEntityLabel}</strong>
                <p className="mb-0">
                  Are you sure you want to delete this {deleteEntityLabel}? This action cannot be undone.
                </p>
              </span>
            </div>
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        <ModalFooter
          currentStep={currentStep}
          totalSteps={totalSteps}
          isEdit={!!isEdit}
          deleteFromStep={deleteFromStep}
          showDeleteConfirm={showDeleteConfirm}
          isSaving={isSaving}
          onCancel={close}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSave={handleSave}
          onDelete={() => setShowDeleteConfirm(true)}
          onConfirmDelete={handleDeleteConfirmed}
          nextButtonLabel={nextButtonLabel}
          hidePreviousButton={hidePreviousButton}
          isReadOnly={isReadOnly}
          isBlocked={isBlocked}
        />
      </Modal.Footer>
    </>
  );
};
