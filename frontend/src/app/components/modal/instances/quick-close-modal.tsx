import { FC, memo } from "react";
import { Modal, Spinner, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@hooks/hooks";
import { selectModalData, isLoading } from "@store/reducers/app";
import { selectComplaint, refreshComplaints } from "@store/reducers/complaints";
import { selectAssessment } from "@store/reducers/case-selectors";
import { HWCRComplaintAssessment } from "@components/containers/complaints/outcomes/hwcr-complaint-assessment";

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
  alreadyAssessed: boolean;
  isClosed: boolean;
  complaint_identifier: string;
  close: () => void;
};
const AssessedOrClosedAlert: FC<AssessedOrClosedAlertProps> = memo(
  ({ isClosed, alreadyAssessed, complaint_identifier, close }) =>
    alreadyAssessed || isClosed ? (
      <Alert
        variant="warning"
        className="comp-complaint-details-alert"
        id={`complaint-unmapped-notification`}
      >
        <div>
          <i className="bi bi-info-circle-fill"></i>
          <span>
            {isClosed ? " This complaint is already closed. " : " This complaint has already been assessed. "}
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

  // Selectors
  const complaintData = useAppSelector(selectComplaint);
  const assessmentData = useAppSelector(selectAssessment);
  const loading = useAppSelector(isLoading);
  const modalData = useAppSelector(selectModalData);
  const { title, complaint_identifier } = modalData;

  // Vars
  const alreadyAssessed = assessmentData?.date !== undefined;
  const isClosed = complaintData?.status === "CLOSED";

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
            alreadyAssessed={alreadyAssessed}
            complaint_identifier={complaint_identifier}
            close={close}
          />
        )}
        <div
          style={{
            visibility: loading ? "hidden" : "inherit",
            display: alreadyAssessed || isClosed ? "none" : "inherit",
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
      {(alreadyAssessed || isClosed) && (
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
