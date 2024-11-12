import { FC, useEffect, useState } from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import ComplaintStatusSelect from "@components/codes/complaint-status-select";
import {
  getComplaintById,
  updateAllegationComplaintStatus,
  updateWildlifeComplaintStatus,
  updateGeneralIncidentComplaintStatus,
} from "@store/reducers/complaints";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import { setIsInEdit } from "@store/reducers/cases";
import useValidateComplaint from "@hooks/validate-complaint";

type ChangeStatusModalProps = {
  close: () => void;
  submit: () => void;
  complaint_type: string;
  complaint_status: string;
};

/**
 * A modal dialog box that allows users to change the status of a complaint
 *
 */
export const ChangeStatusModal: FC<ChangeStatusModalProps> = ({ close, submit, complaint_type, complaint_status }) => {
  const modalData = useAppSelector(selectModalData);
  const isReviewRequired = useAppSelector((state) => state.cases.isReviewRequired);
  const reviewCompleteAction = useAppSelector((state) => state.cases.reviewComplete);
  const [statusChangeDisabledInd, setStatusChangeDisabledInd] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  let [status, setStatus] = useState("");
  let selectedStatus = "";

  useEffect(() => {
    if (status.length > 1) {
      updateThunksSequentially();
      submit();
    }
  });

  useEffect(() => {
    setStatusChangeDisabledInd(isReviewRequired && !reviewCompleteAction?.actionCode && complaint_status === "PENDREV");
  }, [isReviewRequired, reviewCompleteAction, complaint_status]);

  // Since there are different reducers for updating the state of complaints for tables and details, we need to handle both
  // This will ensure that both are triggered, sequentially.
  const updateThunksSequentially = async () => {
    try {
      if (COMPLAINT_TYPES.HWCR === complaint_type) {
        dispatch(updateWildlifeComplaintStatus(complaint_identifier, status));
      } else if (COMPLAINT_TYPES.ERS === complaint_type) {
        dispatch(updateAllegationComplaintStatus(complaint_identifier, status));
      } else if (COMPLAINT_TYPES.GIR === complaint_type) {
        dispatch(updateGeneralIncidentComplaintStatus(complaint_identifier, status));
      }

      dispatch(getComplaintById(complaint_identifier, complaint_type));
    } catch (error) {
      // Handle any errors that occurred during the dispatch
      console.error("Error dispatching thunks:", error);
    }
  };

  const { title, description, complaint_identifier } = modalData;

  const handleSelectChange = (selectedValue: string) => {
    selectedStatus = selectedValue;
  };

  const validationResults = useValidateComplaint();

  const validateCloseStatus = () => {
    if (validationResults.canCloseComplaint) {
      setStatus(selectedStatus);
      dispatch(setIsInEdit({ showSectionErrors: false }));
    } else {
      validationResults.scrollToErrors();
      dispatch(setIsInEdit({ showSectionErrors: true }));
      close();
    }
  };

  const handleSubmit = () => {
    if (selectedStatus === "CLOSED") {
      validateCloseStatus();
    } else {
      setStatus(selectedStatus);
      dispatch(setIsInEdit({ showSectionErrors: false }));
    }
  };

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        {statusChangeDisabledInd && (
          <Row className="status-change-subtext">
            <Col
              xs="auto"
              className="change_status_modal_icon"
            >
              <i className="bi bi-exclamation-circle"></i>
            </Col>
            <Col>
              <div>Complaint is pending review.</div>
              <div>Complete or cancel review before updating status.</div>
            </Col>
          </Row>
        )}
        <label style={{ marginBottom: "8px" }}>{description}</label>
        <ComplaintStatusSelect
          isDisabled={statusChangeDisabledInd}
          onSelectChange={handleSelectChange}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={close}
        >
          Cancel
        </Button>
        <Button
          active={!statusChangeDisabledInd}
          id="update_complaint_status_button"
          onClick={handleSubmit}
          className={!statusChangeDisabledInd ? "" : "inactive-button"}
        >
          Update
        </Button>
      </Modal.Footer>
    </>
  );
};
