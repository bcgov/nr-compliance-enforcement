import { FC, useEffect, useState } from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { profileDisplayName, profileIdir, profileInitials, selectModalData } from "../../../store/reducers/app";
import { getOfficersInZone, officersInZone, updateComplaintAssignee } from "../../../store/reducers/assign-officers";
import ComplaintType from "../../../constants/complaint-types";
import { UUID } from "crypto";

type AssignOfficerModalProps = {
  close: () => void;
  submit: () => void;
  complaint_identifier: string;
  complaint_type: number;
};

export const AssignOfficerModal: FC<AssignOfficerModalProps> = ({ close, submit, complaint_type }) => {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  const { title, complaint_identifier } = modalData;
  const initials = useAppSelector(profileInitials);
  const displayName = useAppSelector(profileDisplayName);
  const idir = useAppSelector(profileIdir);
  const [selectedAssigneeIndex, setSelectedAssigneeIndex] = useState(-1);
  const [selectedAssignee, setSelectedAssignee] = useState("");

  const [newAssignee, setNewAssignee] = useState("");

  const officersJson = useAppSelector(officersInZone);

  const handleAssigneeClick = (index: number, person_guid: string) => {
    setSelectedAssigneeIndex(index);
    setSelectedAssignee(person_guid);
  };

  const handleSubmit = () => {
    setNewAssignee(selectedAssignee);
  };


  useEffect(() => {
    if (selectedAssigneeIndex >= 0) {
      dispatch(updateComplaintAssignee(selectedAssignee as UUID, complaint_identifier, complaint_type));
      submit();
    }
    dispatch(getOfficersInZone(idir));
  }, [dispatch, newAssignee, idir]);

  return (
    <>
      {title && (
        <Modal.Header closeButton={true} className="border-0">
          <Modal.Title style={{ fontSize: '20px' }}>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body className="">
      <div className="assign_officer_modal_profile_card">
        <div className="assign_officer_modal_profile_card_column">
          <div className="assign_officer_modal_profile_card_profile-picture">
            <div data-initials-modal={initials} className="comp-profile-avatar"></div>
          </div>
        </div>
        <div className="assign_officer_modal_profile_card_column">
          <div className="assign_officer_modal_profile_card_row_1">{displayName}</div>
          <div className="assign_officer_modal_profile_card_row_2">Officer</div>
        </div>
        <div className="assign_officer_modal_profile_card_column">
          <Button onClick={submit}>Self Assign</Button>
        </div>
      </div>
      <hr></hr>
      <div className="assign_officer_modal_subtitle">
        <span>In Your Zone</span>
      </div>
      {officersJson.map((val, key) => {

        const firstName = val.person_guid.first_name;
        const lastName = val.person_guid.last_name;
        const displayName = firstName + " " + lastName;
        const officerInitials = firstName?.substring(0,1) + lastName?.substring(0,1);


        return(
        <div className={`assign_officer_modal_profile_card ${selectedAssigneeIndex === key ? 'selected' : ''}`} key={key} onClick={() => handleAssigneeClick(key, val.person_guid.person_guid)}>
          <div className="assign_officer_modal_profile_card_column">
            <div className="assign_officer_modal_profile_card_profile-picture">
              <div data-initials-modal={officerInitials}></div>
            </div>
          </div>
          <div className="assign_officer_modal_profile_card_column">
            <div className="assign_officer_modal_profile_card_row_1">{displayName}</div>
            <div className="assign_officer_modal_profile_card_row_2">Officer</div>
          </div>
          <div className="assign_officer_modal_profile_card_column">
          </div>
      </div>

        );})}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={close}>Cancel</Button>
        <Button onClick={handleSubmit}>Assign</Button>
      </Modal.Footer>
    </>
  );
};
