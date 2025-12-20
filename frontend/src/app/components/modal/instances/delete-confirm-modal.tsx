import { FC } from "react";
import { Modal, Button } from "react-bootstrap";

type DeleteConfirmModalProps = {
  show: boolean;
  title: string;
  content: string;
  onDelete: () => void | null;
  onHide: () => void | null;
  confirmText: string;
};

export const DeleteConfirmModal: FC<DeleteConfirmModalProps> = (props) => {
  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header
        closeButton
        className="pb-0"
      >
        <Modal.Title id="contained-modal-title-vcenter">{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pb-0">
        <div className="cancel_confirm_modal_description">
          <p>{props.content}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={props.onHide}
        >
          No, go back
        </Button>
        <Button onClick={props.onDelete}>{props.confirmText}</Button>
      </Modal.Footer>
    </Modal>
  );
};
