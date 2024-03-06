import { FC } from "react";
import { Modal, Button } from 'react-bootstrap';

type DeleteConfirmModalProps = {
  show: boolean,
  title: string,
  content: string,
  onDelete: () => void | null,
  onHide: () => void | null
}

export const DeleteConfirmModal: FC<DeleteConfirmModalProps> = (props) => {  
    return (
      <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="cancel_confirm_modal_description">
          {props.content}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={props.onHide}>No, go back</Button>
        <Button onClick={props.onDelete}>Yes, delete equipment</Button>
      </Modal.Footer>
    </Modal>
    );
  };