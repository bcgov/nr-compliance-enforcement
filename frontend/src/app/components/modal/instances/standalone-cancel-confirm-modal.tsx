//--
//-- this modal should only be used in a standalone scenario
//-- where unable to use the global redux modals
//--

import { FC, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";

type props = {
  show: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  confirm: () => void | null;
  cancel: () => void | null;
};

export const StandaloneConfirmCancelModal: FC<props> = ({
  show,
  title,
  description,
  confirmText,
  cancelText,
  confirm,
  cancel,
}) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(show);
  }, [show]);

  const handleClose = () => {
    cancel();
  };

  return (
    <Modal
      show={showModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={handleClose}
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
          onClick={confirm}
        >
          {confirmText}
        </Button>
        <Button onClick={cancel}>{cancelText}</Button>
      </Modal.Footer>
    </Modal>
  );
};
