import { FC, useEffect, useState } from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { selectModalData } from "../../../store/reducers/app";
import ComplaintStatusSelect from "../../codes/complaint-status-select";
import { updateComplaintStatus } from "../../../store/reducers/hwcr-complaints";


type ChangeStatusModalProps = {
  close: () => void;
  submit: () => void;
  complaint_identifier: string
}

/**
 * A modal dial box that allows users to change the status of a complaint
 * 
 */
export const ChangeStatusModal: FC<ChangeStatusModalProps> = ({ close, submit }) => {
  const modalData = useAppSelector(selectModalData);
  const dispatch = useAppDispatch();
  let [status, setStatus] = useState('');
  let selectedStatus = '';
  

  useEffect(() => {
    if (status.length > 1) {
      dispatch(updateComplaintStatus(complaint_identifier,status));
      submit();
    }
  }, [dispatch,status,submit]);
  

  const { title, description,complaint_identifier } = modalData;

  const handleSelectChange = (selectedValue: string) => {
    selectedStatus = selectedValue;
  };

  const handleSubmit = () => {
    setStatus(selectedStatus);
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
