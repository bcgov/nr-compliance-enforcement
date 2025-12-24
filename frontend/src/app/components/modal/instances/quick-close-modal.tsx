import { FC, memo, useEffect } from "react";
import { Modal, Spinner, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@hooks/hooks";
import { selectModalData, isLoading } from "@store/reducers/app";
import { selectComplaint, refreshComplaints } from "@store/reducers/complaints";
import { setIsInEdit } from "@/app/store/reducers/complaint-outcomes";
import {
  selectAssessments,
  selectPreventions,
  selectEquipment,
  selectSubject,
  selectNotes,
  selectIsReviewRequired,
  selectReviewComplete,
} from "@/app/store/reducers/complaint-outcome-selectors";
import { HWCRAssessmentForm } from "@components/containers/complaints/outcomes/hwcr-assessment/hwcr-assessment-form";
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
  const assessmentsData = useAppSelector(selectAssessments);
  const equipmentData = useAppSelector(selectEquipment);
  const preventionData = useAppSelector(selectPreventions);
  const subjectData = useAppSelector(selectSubject);
  const notesData = useAppSelector(selectNotes);
  const isReviewRequired = useAppSelector(selectIsReviewRequired);
  const reviewComplete = useAppSelector(selectReviewComplete);

  // Vars
  const { title, complaint_identifier } = modalData;
  const hasOutcomeData =
    assessmentsData?.length > 0 ||
    equipmentData?.length > 0 ||
    preventionData?.length > 0 ||
    subjectData?.length > 0 ||
    notesData?.length > 0 ||
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
        <Modal.Header
          className="pb-0"
          closeButton={true}
        >
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
        {!loading && !hasOutcomeData && complaintData?.delegates?.every((delegate) => !delegate.isActive) && (
          <div>
            <Alert
              variant="info"
              className="comp-complaint-details-alert"
            >
              <div className="d-flex">
                <div className="align-self-center me-3">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                </div>
                <div>
                  Without an officer assigned to this complaint the selected officer will be assigned as part of the
                  quick close.
                </div>
              </div>
            </Alert>
          </div>
        )}
        <div
          style={{
            visibility: loading ? "hidden" : "inherit",
            display: displayAssessment ? "inherit" : "none",
          }}
        >
          <HWCRAssessmentForm
            id={complaint_identifier}
            handleSave={() => {
              submit();
              refreshComplaintsOnClose && dispatch(refreshComplaints(complaint_type));
            }}
            handleCancel={close}
            allowDuplicate={true}
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
