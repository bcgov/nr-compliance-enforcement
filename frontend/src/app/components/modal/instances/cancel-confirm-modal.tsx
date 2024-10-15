import { FC } from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { useAppSelector } from "../../../hooks/hooks";
import { selectModalData } from "../../../store/reducers/app";

type CancelConfirmProps = {
  close: () => void;
  submit: () => void;
  cancelConfirmed: () => void;
};

export const CancelConfirmModal: FC<CancelConfirmProps> = ({ close, submit, cancelConfirmed }) => {
  const modalData = useAppSelector(selectModalData);

  const { title, description } = modalData;

  const closeAndCancel = () => {
    cancelConfirmed();
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
        <p>{description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={close}
        >
          No, go back
        </Button>
        <Button onClick={closeAndCancel}>Yes, cancel changes</Button>
      </Modal.Footer>
    </>
  );
};
