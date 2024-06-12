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
import { setIsInEdit } from "../../../store/reducers/cases";
import { EquipmentDetailsDto } from "../../../types/app/case-files/equipment-details";
import { AnimalOutcomeSubject } from "../../../types/state/cases-state";

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
  const cases = useAppSelector((state) => state.cases);

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

  const validateCloseStatus = () => {
    const { assessment, prevention, equipment, animal, note, attachments, fileReview } = cases.isInEdit;
    const noEditSections = !assessment && !prevention && !equipment && !animal && !note && !attachments && !fileReview;

    //check Assessment section must be filled out
    const assessmentCriteria = Object.keys(cases.assessment).length !== 0;

    //check Prevention must be filled out if action required is Yes
    const preventionCriteria =
      cases.assessment.action_required === "Yes" ? Object.keys(cases.prevention).length !== 0 : true;

    //check Equipment must have removed date, except for Signage and Trail
    const equipmentCriteria =
      cases.equipment?.find(
        (item: EquipmentDetailsDto) =>
          item.wasAnimalCaptured === "U" && item.typeCode !== "SIGNG" && item.typeCode !== "TRCAM",
      ) === undefined;

    //check Animal has outcome, officer and date
    const animalCriteria =
      //@ts-ignore
      cases.subject?.find((item: AnimalOutcomeSubject) => !item.outcome && !item.actions) === undefined;

    //check if file review is required, review must be completed
    const fileReviewCriteria =
      (cases.isReviewRequired && cases.reviewComplete !== null) ||
      (!cases.isReviewRequired && cases.reviewComplete === null);

    if (
      noEditSections &&
      assessmentCriteria &&
      preventionCriteria &&
      equipmentCriteria &&
      animalCriteria &&
      fileReviewCriteria
    ) {
      setStatus(selectedStatus);
      dispatch(setIsInEdit({ showSectionErrors: false }));
    } else {
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
        <Modal.Header
          closeButton={true}
          className="border-0"
        >
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
        <Button
          variant="outline-primary"
          onClick={close}
        >
          Cancel
        </Button>
        <Button
          id="update_complaint_status_button"
          onClick={handleSubmit}
        >
          Update
        </Button>
      </Modal.Footer>
    </>
  );
};
