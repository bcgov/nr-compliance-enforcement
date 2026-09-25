import { FC } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import { StatusChangeAdvisoryDetail } from "@/app/components/common/change-status-modal";

type SaveConfirmProps = {
  close: () => void;
  submit: () => void;
};

export const SaveConfirmModal: FC<SaveConfirmProps> = ({ close, submit }) => {
  const modalData = useAppSelector(selectModalData);

  const { title, warning, description, cancelText, saveText, reasons } = modalData;

  // Reasons the action is refused. Present means blocked, so confirming is not offered.
  const blockedReasons: StatusChangeAdvisoryDetail[] = reasons ?? [];

  const handleConfirm = () => {
    submit();
    close();
  };

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        {warning && (
          <Alert
            variant="warning"
            className="comp-complaint-details-alert"
          >
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-info-circle" />
              <span>{warning}</span>
            </div>
          </Alert>
        )}
        <p>{description}</p>
        {blockedReasons.map((reason) => (
          <div
            key={reason.id}
            className="comp-status-advisory-detail"
          >
            {reason.content}
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={close}
        >
          {cancelText}
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={blockedReasons.length > 0}
        >
          {saveText}
        </Button>
      </Modal.Footer>
    </>
  );
};
