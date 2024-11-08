import { FC, useEffect, useState } from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { selectModalData } from "../../../store/reducers/app";
import ComplaintStatusSelect from "../../codes/complaint-status-select";
import {
  getComplaintById,
  updateAllegationComplaintStatus,
  updateWildlifeComplaintStatus,
  updateGeneralIncidentComplaintStatus,
} from "../../../store/reducers/complaints";
import COMPLAINT_TYPES from "../../../types/app/complaint-types";
import Option from "../../../types/app/option";
import { setIsInEdit } from "../../../store/reducers/cases";
import { EquipmentDetailsDto } from "../../../types/app/case-files/equipment-details";
import { AnimalOutcomeSubject } from "../../../types/state/cases-state";
import useValidateComplaint from "@hooks/validate-complaint";

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
  complaint_status: string;
};

/**
 * A modal dialog box that allows users to change the status of a complaint
 *
 */
export const ChangeStatusModal: FC<ChangeStatusModalProps> = ({ close, submit, complaint_type, complaint_status }) => {
  const modalData = useAppSelector(selectModalData);
  const cases = useAppSelector((state) => state.cases);
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
        await dispatch(updateWildlifeComplaintStatus(complaint_identifier, status));
      } else if (COMPLAINT_TYPES.ERS === complaint_type) {
        await dispatch(updateAllegationComplaintStatus(complaint_identifier, status));
      } else if (COMPLAINT_TYPES.GIR === complaint_type) {
        await dispatch(updateGeneralIncidentComplaintStatus(complaint_identifier, status));
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

  const {
    noEditSections,
    assessmentCriteria,
    preventionCriteria,
    equipmentCriteria,
    animalCriteria,
    fileReviewCriteria,
  } = useValidateComplaint();

  const canCloseComplaint =
    noEditSections && assessmentCriteria && equipmentCriteria && animalCriteria && fileReviewCriteria;

  const validateCloseStatus = () => {
    if (canCloseComplaint) {
      setStatus(selectedStatus);
      dispatch(setIsInEdit({ showSectionErrors: false }));
    } else {
      scrollToErrorSection(
        assessmentCriteria,
        preventionCriteria,
        equipmentCriteria,
        animalCriteria,
        fileReviewCriteria,
      );
      dispatch(setIsInEdit({ showSectionErrors: true }));
      close();
    }
  };

  const scrollToErrorSection = (
    assessmentCriteria: boolean,
    preventionCriteria: boolean,
    equipmentCriteria: boolean,
    animalCriteria: boolean,
    fileReviewCriteria: boolean,
  ) => {
    const { assessment, prevention, equipment, animal, note, attachments, fileReview } = cases.isInEdit;
    if (!assessmentCriteria || assessment) {
      document.getElementById("outcome-assessment")?.scrollIntoView({ block: "end" });
    } else if (!preventionCriteria || prevention) {
      document.getElementById("outcome-prevention-education")?.scrollIntoView({ block: "end" });
    } else if (!equipmentCriteria || equipment) {
      document.getElementById("outcome-equipment")?.scrollIntoView({ block: "end" });
    } else if (!animalCriteria || animal) {
      document.getElementById("outcome-animal")?.scrollIntoView({ block: "end" });
    } else if (note) {
      document.getElementById("outcome-note")?.scrollIntoView({ block: "end" });
    } else if (attachments) {
      document.getElementById("outcome-attachments")?.scrollIntoView({ block: "end" });
    } else if (!fileReviewCriteria || fileReview) {
      document.getElementById("outcome-file-review")?.scrollIntoView({ block: "end" });
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
