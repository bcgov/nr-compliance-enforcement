import { FC } from "react";
import { Modal, Button } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";

type RemovePartyProps = {
  close: () => void;
  submit: () => void;
};

export const RemovePartyModal: FC<RemovePartyProps> = ({ close, submit }) => {
  const modalData = useAppSelector(selectModalData);

  const { title, description } = modalData;

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
        <p>{description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={close}
        >
          No, go back
        </Button>
        <Button
          variant="danger"
          onClick={handleConfirm}
        >
          Yes, remove party
        </Button>
      </Modal.Footer>
    </>
  );
};
