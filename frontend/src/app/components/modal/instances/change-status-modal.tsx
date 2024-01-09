import { FC, useEffect, useState } from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { selectModalData } from "../../../store/reducers/app";
import ComplaintStatusSelect from "../../codes/complaint-status-select";
import {
  getComplaintById,
  updateAllegationComplaintStatus,
  updateWildlifeComplaintStatus,
} from "../../../store/reducers/complaints";
import COMPLAINT_TYPES from "../../../types/app/complaint-types";
import Option from "../../../types/app/option";

type ChangeStatusModalProps = {
  close: () => void;
  submit: () => void;
  sortColumn: string;
  sortOrder: string;
  complaint_identifier: string;
  complaint_type: string;
  natureOfComplaintFilter: Option | null;
  speciesCodeFilter: Option | null;
  startDateFilter: Date | undefined;
  endDateFilter: Date | undefined;
  complaintStatusFilter: Option | null;
};

/**
 * A modal dialog box that allows users to change the status of a complaint
 *
 */
export const ChangeStatusModal: FC<ChangeStatusModalProps> = ({ close, submit, complaint_type }) => {
  const modalData = useAppSelector(selectModalData);
  const dispatch = useAppDispatch();
  let [status, setStatus] = useState("");
  let selectedStatus = "";

  useEffect(() => {
    if (status.length > 1) {
      updateThunksSequentially();
      submit();
    }
  });

  // Since there are different reducers for updating the state of complaints for tables and details, we need to handle both
  // This will ensure that both are triggered, sequentially.
  const updateThunksSequentially = async () => {
    try {
      if (COMPLAINT_TYPES.HWCR === complaint_type) {
        await dispatch(updateWildlifeComplaintStatus(complaint_identifier, status));
      } else {
        await dispatch(updateAllegationComplaintStatus(complaint_identifier, status));
      }

      await dispatch(getComplaintById(complaint_identifier, complaint_type));
    } catch (error) {
      // Handle any errors that occurred during the dispatch
      console.error("Error dispatching thunks:", error);
    }
  };

  const { title, description, complaint_identifier } = modalData;

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
          <Modal.Title style={{ fontSize: "20px" }}>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        <div className="change_status_modal">
          <Row>
            <Col>
              <label className="modal_description_label">{description}</label>
            </Col>
          </Row>
          <Row>
            <Col>
              <ComplaintStatusSelect onSelectChange={handleSelectChange} />
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={close}>
          Cancel
        </Button>
        <Button id="update_complaint_status_button" onClick={handleSubmit}>
          Update
        </Button>
      </Modal.Footer>
    </>
  );
};
