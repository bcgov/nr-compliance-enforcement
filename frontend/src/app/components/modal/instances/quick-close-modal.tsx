import { FC } from "react";
import { Modal, Button } from "react-bootstrap";
import { useAppSelector } from "../../../hooks/hooks";
import { selectModalData } from "../../../store/reducers/app";
import { HWCRComplaintAssessment } from "@components/containers/complaints/outcomes/hwcr-complaint-assessment";

type QuickCloseModalProps = {
  close: () => void;
  submit: () => void;
  complaint_type: string;
  zone: string;
  agency: string;
};

// A modal dialog containing a list of officers in the current user's zone.  Used to select an officer to assign to a complaint.
export const QuickCloseModal: FC<QuickCloseModalProps> = ({ close, submit, complaint_type, zone, agency }) => {
  const modalData = useAppSelector(selectModalData);
  const { title, complaint_identifier } = modalData;

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title as="h3">Quick close: {title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        <HWCRComplaintAssessment
          showHeader={false}
          handleSave={submit}
          quickAssessment={true}
        />
      </Modal.Body>
    </>
  );
};
