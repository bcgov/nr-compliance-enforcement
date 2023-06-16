import { FC } from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { useAppSelector } from "../../../hooks/hooks";
import { selectModalData } from "../../../store/reducers/app";

type AssignOfficerModalProps = {
  close: () => void;
  submit: () => void;
};

export const AssignOfficerModal: FC<AssignOfficerModalProps> = ({ close, submit }) => {
  const modalData = useAppSelector(selectModalData);
  const { title, description } = modalData;

  const handleSelectChange = (selectedValue: string) => {
    // to be filled in on assign-officer story
  };

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title style={{ fontSize: '20px' }}>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
      <div className="assign_officer_modal_profile_card">
        <div className="assign_officer_modal_profile_card_column">
          <div className="assign_officer_modal_profile_card_profile-picture">
            <div data-initials="BF" className="comp-profile-avatar"></div>
          </div>
        </div>
        <div className="assign_officer_modal_profile_card_column">
          <div className="assign_officer_modal_profile_card_row_1">Fred</div>
          <div className="assign_officer_modal_profile_card_row_2">Officer</div>
        </div>
        <div className="assign_officer_modal_profile_card_column">
          <Button onClick={submit}>Self Assign</Button>
        </div>
      </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={close}>Cancel</Button>
        <Button onClick={submit}>Assign</Button>
      </Modal.Footer>
    </>
  );
};
