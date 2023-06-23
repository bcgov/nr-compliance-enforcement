import { FC, useEffect, useState } from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { selectModalData } from "../../../store/reducers/app";
import ComplaintStatusSelect from "../../codes/complaint-status-select";
import { updateHwlcComplaintStatus } from "../../../store/reducers/hwcr-complaints";
import { updateAllegationComplaintStatus } from "../../../store/reducers/allegation-complaint";

import ComplaintType from "../../../constants/complaint-types";
import Option from "../../../types/app/option";


type ChangeStatusModalProps = {
  close: () => void,
  submit: () => void,
  sortColumn: string,
  sortOrder: string,
  complaint_identifier: string,
  complaint_type: number,
  natureOfComplaintFilter: Option | null,
  speciesCodeFilter: Option | null,
  startDateFilter: Date | undefined,
  endDateFilter: Date | undefined,
  complaintStatusFilter: Option | null,
  violationFilter: Option | null,
}

/**
 * A modal dialog box that allows users to change the status of a complaint
 * 
 */
export const ChangeStatusModal: FC<ChangeStatusModalProps> = ({ close, submit, complaint_type, sortColumn, sortOrder, natureOfComplaintFilter, speciesCodeFilter, violationFilter, startDateFilter, endDateFilter, complaintStatusFilter }) => {
  const modalData = useAppSelector(selectModalData);
  const dispatch = useAppDispatch();
  let [status, setStatus] = useState('');
  let selectedStatus = '';
  

  useEffect(() => {
    if (status.length > 1) {
      if (ComplaintType.HWCR_COMPLAINT === complaint_type) {
        dispatch(updateHwlcComplaintStatus(complaint_identifier, status, sortColumn, sortOrder, natureOfComplaintFilter, speciesCodeFilter, startDateFilter, endDateFilter, complaintStatusFilter ));
      } else {
        dispatch(updateAllegationComplaintStatus(complaint_identifier ,status, sortColumn, sortOrder, violationFilter, startDateFilter, endDateFilter, complaintStatusFilter ));
      }
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
        <Modal.Header closeButton={true} className="border-0">
          <Modal.Title style={{ fontSize: '20px' }}>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        <Row>
          <Col>
            <label className="modal_description_label">{description}</label>
          </Col>
        </Row>
        <Row>
          <Col>
            <ComplaintStatusSelect onSelectChange={handleSelectChange}/>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={close}>Cancel</Button>
        <Button id="update_complaint_status_button" onClick={handleSubmit}>Update</Button>
      </Modal.Footer>
    </>
  );
};
