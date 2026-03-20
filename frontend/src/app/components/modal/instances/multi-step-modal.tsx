import { FC, useCallback, useState } from "react";
import { Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { openModal, selectModalData } from "@store/reducers/app";
import { CANCEL_CONFIRM } from "@/app/types/modal/modal-types";
import { StepModalFooter } from "@/app/components/modal/step-modal-footer";

type MultiStepModalProps = {
  close: () => void;
  submit: () => void;
};

export const MultiStepModal: FC<MultiStepModalProps> = ({ close, submit }) => {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  const { titles, totalSteps, content } = modalData;

  const [currentStep, setCurrentStep] = useState(0);
  const [validateFn, setValidateFn] = useState<((step: number) => Promise<boolean>) | null>(null);
  const [saveFn, setSaveFn] = useState<(() => Promise<void>) | null>(null);

  const title = titles?.[currentStep] ?? titles?.[0] ?? "";

  const handleNext = async () => {
    const isValid = await validateFn?.(currentStep);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSave = async () => {
    await saveFn?.();
  };

  // Wire up validate and save callbacks from child
  const handleRequestValidate = useCallback((fn: (step: number) => Promise<boolean>) => {
    setValidateFn(() => fn);
  }, []);

  const handleRequestSave = useCallback((fn: () => Promise<void>) => {
    setSaveFn(() => fn);
  }, []);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title as="h3">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{content?.(currentStep, handleRequestValidate, handleRequestSave, submit)}</Modal.Body>
      <Modal.Footer>
        <StepModalFooter
          currentStep={currentStep}
          totalSteps={totalSteps}
          onCancel={close}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSave={handleSave}
        />
      </Modal.Footer>
    </>
  );
};
