import { FC } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";

type SaveConfirmProps = {
  close: () => void;
  submit: () => void;
};

export const SaveConfirmModal: FC<SaveConfirmProps> = ({ close, submit }) => {
  const modalData = useAppSelector(selectModalData);

  const { title, warning, warnings, description, cancelText, saveText } = modalData;

  // `warnings` (plural) stacks multiple alerts in order; `warning` (singular) remains for
  // existing single-message callers.
  const warningList: string[] = warnings ?? (warning ? [warning] : []);

  const handleConfirm = () => {
    submit();
    close();
  };

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        {warningList.map((warningText) => (
          <Alert
            key={warningText}
            variant="warning"
            className="comp-complaint-details-alert"
          >
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-info-circle" />
              <span>{warningText}</span>
            </div>
          </Alert>
        ))}
        <p>{description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={close}
        >
          {cancelText}
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
        >
          {saveText}
        </Button>
      </Modal.Footer>
    </>
  );
};
