import { FC, useEffect, useState } from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import ComplaintStatusSelect from "@components/codes/complaint-status-select";
import {
  updateAllegationComplaintStatus,
  updateWildlifeComplaintStatus,
  updateGeneralIncidentComplaintStatus,
} from "@store/reducers/complaints";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import { setIsInEdit } from "@/app/store/reducers/complaint-outcomes";
import useValidateComplaint from "@hooks/validate-complaint";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";

type ComplaintChangeStatusModalProps = {
  close: () => void;
  submit: () => void;
  complaint_type: string;
  complaint_status: string;
};

/**
 * A modal dialog box that allows users to change the status of a complaint
 *
 */
export const ComplaintChangeStatusModal: FC<ComplaintChangeStatusModalProps> = ({
  close,
  submit,
  complaint_type,
  complaint_status,
}) => {
  const modalData = useAppSelector(selectModalData);
  const { title, description, complaint_identifier, onDirtyChange } = modalData;
  const isReviewRequired = useAppSelector((state) => state.complaintOutcomes.isReviewRequired);
  const reviewCompleteAction = useAppSelector((state) => state.complaintOutcomes.reviewComplete);
  const [statusChangeDisabledInd, setStatusChangeDisabledInd] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const [selectedStatus, setSelectedStatus] = useState("");

  const { markDirty } = useFormDirtyState(onDirtyChange);

  useEffect(() => {
    setStatusChangeDisabledInd(isReviewRequired && !reviewCompleteAction?.actionCode && complaint_status === "PENDREV");
  }, [isReviewRequired, reviewCompleteAction, complaint_status]);

  const is_officer_assigned: boolean = modalData.is_officer_assigned;

  const handleSelectChange = (selectedValue: string) => {
    markDirty();
    setSelectedStatus(selectedValue);
  };

  const validationResults = useValidateComplaint();

  const dispatchStatusUpdate = () => {
    if (COMPLAINT_TYPES.HWCR === complaint_type) {
      dispatch(updateWildlifeComplaintStatus(complaint_identifier, selectedStatus));
    } else if (COMPLAINT_TYPES.ERS === complaint_type) {
      dispatch(updateAllegationComplaintStatus(complaint_identifier, selectedStatus));
    } else if (COMPLAINT_TYPES.GIR === complaint_type) {
      dispatch(updateGeneralIncidentComplaintStatus(complaint_identifier, selectedStatus));
    }
  };

  const handleSubmit = () => {
    if (selectedStatus === "CLOSED" && !validationResults.canCloseComplaint) {
      validationResults.scrollToErrors();
      dispatch(setIsInEdit({ showSectionErrors: true }));
    } else {
      dispatchStatusUpdate();
      dispatch(setIsInEdit({ showSectionErrors: false }));
    }
    submit();
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
        {!is_officer_assigned && selectedStatus === "CLOSED" ? (
          <Row className="status-change-subtext">
            <Col
              xs="auto"
              className="change_status_modal_icon"
            >
              <i className="bi bi-exclamation-circle"></i>
            </Col>
            <Col>
              <div>An officer must be assigned to the complaint before it can be closed.</div>
            </Col>
          </Row>
        ) : (
          !validationResults.validationDetails.referenceNumberCriteria &&
          selectedStatus === "CLOSED" && (
            <Row className="status-change-subtext">
              <Col
                xs="auto"
                className="change_status_modal_icon"
              >
                <i className="bi bi-exclamation-circle"></i>
              </Col>
              <Col>
                <div>COORS number is required before the complaint can be closed.</div>
              </Col>
            </Row>
          )
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
          active={!statusChangeDisabledInd && is_officer_assigned}
          id="update_complaint_status_button"
          onClick={handleSubmit}
          className={
            !statusChangeDisabledInd && (is_officer_assigned || selectedStatus === "OPEN") ? "" : "inactive-button"
          }
          disabled={
            !selectedStatus ||
            statusChangeDisabledInd ||
            ((!is_officer_assigned || !validationResults.validationDetails.referenceNumberCriteria) &&
              selectedStatus === "CLOSED")
          }
        >
          Update
        </Button>
      </Modal.Footer>
    </>
  );
};
