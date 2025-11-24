import { FC } from "react";
import { Modal, Button } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";

type CancelConfirmProps = {
  close: () => void;
  submit: () => void;
  deleteConfirmed: () => void;
};

export const DeleteConfirmModalV2: FC<CancelConfirmProps> = ({ close, submit, deleteConfirmed }) => {
  const modalData = useAppSelector(selectModalData);

  const { title, description, confirmText } = modalData;

  const deleteAndCancel = () => {
    deleteConfirmed();
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
        <div className="cancel_confirm_modal_description">
          <p>{description}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={close}
        >
          No, go back
        </Button>
        <Button onClick={deleteAndCancel}>Yes, {!confirmText ? "delete item" : confirmText}</Button>
      </Modal.Footer>
    </>
  );
};
