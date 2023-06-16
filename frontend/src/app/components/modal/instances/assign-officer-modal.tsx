import { FC } from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { useAppSelector } from "../../../hooks/hooks";
import { selectModalData } from "../../../store/reducers/app";

type AssignOfficerModalProps = {
  close: () => void;
  submit: () => void;
};

export const AssignOfficerModal: FC<AssignOfficerModalProps> = ({ close, submit }) => {
  const modalData = useAppSelector(selectModalData);
  const { title, description } = modalData;

  const handleSelectChange = (selectedValue: string) => {
    // to be filled in on assign-officer story
  };

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title style={{ fontSize: '20px' }}>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        <Row>
          <Col className="assign_officer_modal_avatar">
          <div
                        data-initials="BF"
                        className="comp-profile-avatar"
                      ></div>
          </Col>
          <Col className="assign_officer_modal_name">
            <Row><Col>Barrett</Col></Row>
            <Row><Col>Officer</Col></Row>
          </Col>
          <Col>
            <Button onClick={submit}>Self Assign</Button>
          </Col>
        </Row>
        <Row>
          <Col>
          
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={close}>Cancel</Button>
        <Button onClick={submit}>Assign</Button>
      </Modal.Footer>
    </>
  );
};
