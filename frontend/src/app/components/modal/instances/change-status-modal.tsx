import { FC, useEffect, useState } from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { closeModal, selectModalData } from "../../../store/reducers/app";
import ComplaintStatusSelect from "../../codes/complaint-status-select";
import { hwcrComplaints, updateComplaintStatus } from "../../../store/reducers/hwcr-complaints";


type ChangeStatusModalProps = {
  close: () => void;
  submit: () => void;
  complaint_identifier: string,
  complaint_status: string,
}

export const ChangeStatusModal: FC<ChangeStatusModalProps> = ({ close, submit, complaint_identifier, complaint_status }) => {
  const modalData = useAppSelector(selectModalData);
  const dispatch = useAppDispatch();
  let [status, setStatus] = useState('');
  let selectedStatus = '';

  useEffect(() => {
    if (status.length > 1) {
      dispatch(updateComplaintStatus('23-000065',status));
      submit();
    }
  }, [dispatch,status,submit]);
  

  const { title, description } = modalData;

  const handleSelectChange = (selectedValue: string) => {
    selectedStatus = selectedValue;
    // Do something with the selected value in the parent component
  };

  const handleSubmit = () => {
    setStatus(selectedStatus);
    // Do something with the selected value in the parent component
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
          <Col>
            <label>{description}</label>
          </Col>
        </Row>
        <Row>
          <Col>
            <ComplaintStatusSelect width={"458px"} height={"38px"} onSelectChange={handleSelectChange}/>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={close}>Cancel</Button>
        <Button onClick={handleSubmit}>Update</Button>
      </Modal.Footer>
    </>
  );
};
