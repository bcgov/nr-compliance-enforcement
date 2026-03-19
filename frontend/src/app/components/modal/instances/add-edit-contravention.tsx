import { FC, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import { ContraventionForm } from "@/app/components/containers/investigations/details/investigation-contravention/contravention-form";
import { Contravention, InvestigationParty } from "@/generated/graphql";

type AddEditContraventionModalProps = {
  close: () => void;
  submit: () => void;
};

export const AddEditContraventionModal: FC<AddEditContraventionModalProps> = ({ close, submit }) => {
  const modalData = useAppSelector(selectModalData);
  const { activityGuid, parties, contravention, contraventionNumber, onDirtyChange } = modalData;

  const [submitFn, setSubmitFn] = useState<(() => Promise<void>) | null>(null);

  const isEditMode = !!contravention;
  const title = isEditMode ? `Edit contravention ${contraventionNumber}` : "Add contravention";

  const handleSave = async () => {
    await submitFn?.();
  };

  const handleCancel = async () => {
    close();
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title as="h3">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ContraventionForm
          activityGuid={activityGuid}
          parties={parties as InvestigationParty[]}
          contravention={contravention as Contravention}
          contraventionNumber={contraventionNumber}
          onDirtyChange={onDirtyChange}
          onClose={close}
          onRequestSubmit={(fn) => setSubmitFn(() => fn)}
        />
      </Modal.Body>
      <Modal.Footer>
        <div className="comp-details-form-buttons w-100 d-flex justify-content-end gap-2">
          <Button
            variant="outline-primary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
          >
            <i className="bi bi-check-circle" />
            <span>Save</span>
          </Button>
        </div>
      </Modal.Footer>
    </>
  );
};
