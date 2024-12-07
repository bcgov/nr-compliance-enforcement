//--
//-- this modal should only be used in a standalone scenario
//-- where unable to use the global redux modals
//--

import { FC } from "react";
import { Button, Modal } from "react-bootstrap";

type props = {
  show: boolean;
  title: string;
  description: string;
  close: () => void | null;
  closeAndCancel: () => void | null;
};

export const StandaloneConfirmCancelModal: FC<props> = ({ show, title, description, close, closeAndCancel }) => {
  return (
    <Modal
      show={show}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body style={{ paddingTop: 0, paddingBottom: 0 }}>
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
        <Button onClick={closeAndCancel}>Yes, cancel changes</Button>
      </Modal.Footer>
    </Modal>
  );
};
