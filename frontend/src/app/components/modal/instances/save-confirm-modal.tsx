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

  const { title, warning, description, cancelText, saveText } = modalData;

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
        {warning && (
          <Alert
            variant="warning"
            className="comp-complaint-details-alert"
          >
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-info-circle" />
              <span>{warning}</span>
            </div>
          </Alert>
        )}
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
