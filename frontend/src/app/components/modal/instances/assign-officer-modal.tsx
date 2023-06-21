import { FC, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { profileDisplayName, profileIdir, profileInitials, selectModalData } from "../../../store/reducers/app";
import { assignCurrentUserToComplaint, getOfficersInZone, officersInZone, updateComplaintAssignee } from "../../../store/reducers/assign-officers";
import { UUID } from "crypto";

type AssignOfficerModalProps = {
  close: () => void;
  submit: () => void;
  complaint_identifier: string;
  complaint_type: number;
  complaint_guid: string;
};

// A modal dialog containing a list of officers in the current user's zone.  Used to select an officer to assign to a complaint.
export const AssignOfficerModal: FC<AssignOfficerModalProps> = ({ close, submit, complaint_type }) => {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  const { title, complaint_identifier, complaint_guid } = modalData;
  const initials = useAppSelector(profileInitials);
  const displayName = useAppSelector(profileDisplayName);
  const idir = useAppSelector(profileIdir);
  const [selectedAssigneeIndex, setSelectedAssigneeIndex] = useState(-1);
  const [selectedAssignee, setSelectedAssignee] = useState("");

  const [newAssignee, setNewAssignee] = useState("");

  const officersJson = useAppSelector(officersInZone);

  // stores the state of the officer that was clicked
  const handleAssigneeClick = (index: number, person_guid: string) => {
    setSelectedAssigneeIndex(index);
    setSelectedAssignee(person_guid);
  };

  // assigns the selected officer to a complaint
  const handleSubmit = () => {
    setNewAssignee(selectedAssignee);
    if (selectedAssignee !== "") {
      dispatch(updateComplaintAssignee(selectedAssignee as UUID, complaint_identifier, complaint_type, complaint_guid));
      submit();
    }
  };

  // assigns the logged in user to a complaint
  const handleSelfAssign = () => {
    dispatch(assignCurrentUserToComplaint(idir, complaint_identifier, complaint_type, complaint_guid));
    submit();
  }

  useEffect(() => {
    dispatch(getOfficersInZone(idir));
  }, [dispatch, newAssignee, idir]);

  function compareUuidToString(uuid: string, str: string): boolean {

    if (uuid === null || str === null) {
      return false;
    }
    // Remove any hyphens from the UUID and convert to lowercase
    const cleanUuid = uuid.replace(/-/g, "").toLowerCase();
    
    // Convert the input string to lowercase
    const cleanStr = str.toLowerCase();
    
    // Compare the cleaned UUID to the cleaned string
    return cleanUuid === cleanStr;
  }

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
          <Button onClick={handleSelfAssign}>Self Assign</Button>
        </div>
      </div>
      <hr className="modal_hr"/>
      <div className="assign_officer_modal_subtitle">
        <span>In Your Zone</span>
      </div>
      {officersJson.map((val, key) => {

        const firstName = val.person_guid.first_name;
        const lastName = val.person_guid.last_name;
        const displayName = firstName + " " + lastName;
        const officerInitials = firstName?.substring(0,1) + lastName?.substring(0,1);
        const person_guid = val.person_guid.person_guid;

        // don't display the current user in the list since we already have the current user at the top of the modal
        if (!compareUuidToString(val.auth_user_guid,idir)) {
        return(
        <div className={`assign_officer_modal_profile_card ${selectedAssigneeIndex === key ? 'selected' : ''}`} key={key} onClick={() => handleAssigneeClick(key, person_guid)}>
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

        );}})}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={close}>Cancel</Button>
        <Button onClick={handleSubmit}>Assign</Button>
      </Modal.Footer>
    </>
  );
};
