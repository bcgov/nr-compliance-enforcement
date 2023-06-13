import { title } from "process";
import { FC } from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { text } from "stream/consumers";
import { useAppSelector } from "../../../hooks/hooks";
import { selectModalData } from "../../../store/reducers/app";

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
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body className={`pb-20 ${title ? "" : "pt-20"}`}>
        <Row>
          <Col>
            {title && <hr className="mb-20" />}
            <label className="text-center mb-0">{description}</label>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button
        //   refProp={noButtonRef}
          onClick={close}
        >OK</Button>
      </Modal.Footer>
    </>
  );
};
