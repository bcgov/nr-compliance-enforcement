import { FC } from "react";
import { Modal, Button } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";

type RemoveActivityFromCaseProps = {
  close: () => void;
  submit: () => void;
};

export const RemoveActivityFromCaseModal: FC<RemoveActivityFromCaseProps> = ({ close, submit }) => {
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
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
        >
          Save and close
        </Button>
      </Modal.Footer>
    </>
  );
};
