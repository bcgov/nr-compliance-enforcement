import { FC, memo, useEffect } from "react";
import { Modal, Spinner, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@hooks/hooks";
import { selectModalData, isLoading } from "@store/reducers/app";
import { selectComplaint, refreshComplaints } from "@store/reducers/complaints";
import { setIsInEdit } from "@store/reducers/cases";
import {
  selectAssessment,
  selectPrevention,
  selectEquipment,
  selectSubject,
  selectSupplementalNote,
  selectIsReviewRequired,
  selectReviewComplete,
} from "@store/reducers/case-selectors";
import { HWCRComplaintAssessment } from "@components/containers/complaints/outcomes/hwcr-complaint-assessment";
import useValidateComplaint from "@/app/hooks/validate-complaint";

const ModalLoading: FC = memo(() => (
  <div className="modal-loader">
    <div className="comp-overlay-content d-flex align-items-center justify-content-center">
      <Spinner
        animation="border"
        role="loading"
        id="modal-loader"
      />
    </div>
  </div>
));

type AssessedOrClosedAlertProps = {
  hasOutcomeData: boolean;
  isClosed: boolean;
  canQuickCloseComplaint: boolean;
  complaint_identifier: string;
  close: () => void;
};
const AssessedOrClosedAlert: FC<AssessedOrClosedAlertProps> = memo(
  ({ isClosed, hasOutcomeData, canQuickCloseComplaint, complaint_identifier, close }) =>
    hasOutcomeData || isClosed || !canQuickCloseComplaint ? (
      <Alert
        variant="warning"
        className="comp-complaint-details-alert"
        id={`complaint-unmapped-notification`}
      >
        <div>
          <i className="bi bi-info-circle-fill"></i>
          <span>
            {isClosed && " This complaint is already closed. "}
            {hasOutcomeData && " This complaint already has outcome information. "}
            {!canQuickCloseComplaint && " This complaint does not meet the requirements to be closed. "}
          </span>
          <Link
            to={`/complaint/HWCR/${complaint_identifier}`}
            id={complaint_identifier}
            onClick={close}
          >
            View its full details for more information.
          </Link>
        </div>
      </Alert>
    ) : (
      <></>
    ),
);

type QuickCloseModalProps = {
  close: () => void;
  submit: () => void;
  complaint_type: string;
  refreshComplaintsOnClose?: boolean;
};
export const QuickCloseModal: FC<QuickCloseModalProps> = ({
  close,
  submit,
  complaint_type,
  refreshComplaintsOnClose = false,
}) => {
  // Hooks
  const dispatch = useAppDispatch();
  const validationResults = useValidateComplaint();

  // Selectors
  const loading = useAppSelector(isLoading);
  const modalData = useAppSelector(selectModalData);
  const complaintData = useAppSelector(selectComplaint);
  const assessmentData = useAppSelector(selectAssessment);
  const equipmentData = useAppSelector(selectEquipment);
  const preventionData = useAppSelector(selectPrevention);
  const subjectData = useAppSelector(selectSubject);
  const noteData = useAppSelector(selectSupplementalNote);
  const isReviewRequired = useAppSelector(selectIsReviewRequired);
  const reviewComplete = useAppSelector(selectReviewComplete);

  // Vars
  const { title, complaint_identifier } = modalData;
  const hasOutcomeData =
    assessmentData?.date !== undefined ||
    equipmentData?.length > 0 ||
    preventionData?.date !== undefined ||
    subjectData?.length > 0 ||
    noteData?.note ||
    isReviewRequired ||
    reviewComplete;
  const isClosed = complaintData?.status === "CLOSED";
  const displayAssessment = !hasOutcomeData && !isClosed && validationResults.canQuickCloseComplaint;

  // Effects
  useEffect(() => {
    dispatch(setIsInEdit({ showSectionErrors: false }));
  }, [dispatch]);

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title as="h3">{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        {loading && <ModalLoading />}
        {!loading && (
          <AssessedOrClosedAlert
            isClosed={isClosed}
            hasOutcomeData={hasOutcomeData}
            canQuickCloseComplaint={validationResults.canQuickCloseComplaint}
            complaint_identifier={complaint_identifier}
            close={close}
          />
        )}
        <div
          style={{
            visibility: loading ? "hidden" : "inherit",
            display: displayAssessment ? "inherit" : "none",
          }}
        >
          <HWCRComplaintAssessment
            id={complaint_identifier}
            complaintType={complaint_type}
            showHeader={false}
            handleSave={() => {
              submit();
              refreshComplaintsOnClose && dispatch(refreshComplaints(complaint_type));
            }}
            handleClose={close}
            quickClose={true}
          />
        </div>
      </Modal.Body>
      {(hasOutcomeData || isClosed) && (
        <Modal.Footer>
          <Button
            variant="outline-primary"
            onClick={close}
          >
            Cancel
          </Button>
        </Modal.Footer>
      )}
    </>
  );
};
