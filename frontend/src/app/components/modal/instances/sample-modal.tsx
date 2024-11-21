import { FC } from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";

type SampleModalProps = {
  close: () => void;
  submit: () => void;
};

export const SampleModal: FC<SampleModalProps> = ({ close, submit }) => {
  const modalData = useAppSelector(selectModalData);

  const { title, description } = modalData;

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          {" "}
          {/* set true / false to display the close button */}
          <Modal.Title>{title}</Modal.Title>
          {/* <!-- additional header content should go here --> */}
        </Modal.Header>
      )}
      <Modal.Body>
        {/* <!-- there are no constraints on what can be used in the Modal.Body --> */}
        <Row>
          <Col>
            <label>{description}</label>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={close}
        >
          Close
        </Button>
        <Button onClick={submit}>OK</Button>
      </Modal.Footer>
    </>
  );
};
