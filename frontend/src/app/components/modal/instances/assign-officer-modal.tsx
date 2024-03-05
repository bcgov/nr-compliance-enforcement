import { ChangeEvent, FC, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { profileDisplayName, profileIdir, profileInitials, selectModalData, userId } from "../../../store/reducers/app";
import {
  assignCurrentUserToComplaint,
  searchOfficers,
  selectOfficersByZoneAndAgency,
  updateComplaintAssignee,
} from "../../../store/reducers/officer";
import { UUID } from "crypto";
import { BsPerson } from "react-icons/bs";
import { from } from "linq-to-typescript";

type AssignOfficerModalProps = {
  close: () => void;
  submit: () => void;
  complaint_type: string;
  zone: string;
  agency: string;
};

// A modal dialog containing a list of officers in the current user's zone.  Used to select an officer to assign to a complaint.
export const AssignOfficerModal: FC<AssignOfficerModalProps> = ({ close, submit, complaint_type, zone, agency }) => {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  const { title, complaint_identifier } = modalData;
  const initials = useAppSelector(profileInitials);
  const displayName = useAppSelector(profileDisplayName);
  const idir = useAppSelector(profileIdir);
  const userid = useAppSelector(userId);
  const [selectedAssigneeIndex, setSelectedAssigneeIndex] = useState(-1);
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [searchInput, setSearchInput] = useState<string>("");

  const officersJson = useAppSelector(selectOfficersByZoneAndAgency(modalData?.agency_code, zone));
  const searchResults = useAppSelector(searchOfficers(searchInput));

  // stores the state of the officer that was clicked
  const handleAssigneeClick = (index: number, person_guid: string) => {
    setSelectedAssigneeIndex(index);
    setSelectedAssignee(person_guid);
  };

  // assigns the selected officer to a complaint
  const handleSubmit = () => {
    if (selectedAssignee !== "") {
      dispatch(updateComplaintAssignee(userid, complaint_identifier, complaint_type, selectedAssignee as UUID));
      submit();
    }
  };

  // assigns the logged in user to a complaint
  const handleSelfAssign = () => {
    dispatch(assignCurrentUserToComplaint(userid, idir, complaint_identifier, complaint_type));
    submit();
  };

  // the user guid returned from keycloak isn't properly formatted, so we
  // this function removes dashes from guids so that guids can be
  // compared to the keycloak guid
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

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const {
      target: { value },
    } = evt;

    setSearchInput(value);
  };

  const handleInputFocus = (): void => {
    setSelectedAssigneeIndex(-1);
    setSelectedAssignee("");
  };

  const renderOfficers = () => {
    if (searchInput.length >= 3 && !from(searchResults).any()) {
      return <></>;
    } else if (from(searchResults).any()) {
      return searchResults.map((val, key) => {
        const {
          person_guid: { first_name: firstName, last_name: lastName },
        } = val;
        const {
          person_guid: { person_guid: personId },
          auth_user_guid: authUserId,
        } = val;

        const displayName = `${firstName} ${lastName}`;
        const officerInitials = firstName?.substring(0, 1) + lastName?.substring(0, 1);

        // don't display the current user in the list since we already have the current user at the top of the modal
        if (authUserId === undefined || !compareUuidToString(authUserId, idir)) {
          return (
            <div
              className={`${
                selectedAssigneeIndex === key
                  ? "assign_officer_modal_profile_card_selected"
                  : "assign_officer_modal_profile_card"
              }`}
              key={key}
              onClick={() => handleAssigneeClick(key, personId)}
            >
              <div className="assign_officer_modal_profile_card_column">
                <div className="assign_officer_modal_profile_card_profile-picture">
                  <div data-initials-modal={officerInitials}></div>
                </div>
              </div>
              <div className="assign_officer_modal_profile_card_column">
                <div className="assign_officer_modal_profile_card_row_1">{displayName}</div>
                <div className="assign_officer_modal_profile_card_row_2">Officer</div>
              </div>
              <div className="assign_officer_modal_profile_card_column"></div>
            </div>
          );
        } else {
          return <></>;
        }
      });
    }

    return officersJson?.map((val, key) => {
      const {
        person_guid: { first_name: firstName, last_name: lastName },
      } = val;
      const {
        person_guid: { person_guid: personId },
        auth_user_guid: authUserId,
      } = val;

      const displayName = `${firstName} ${lastName}`;
      const officerInitials = firstName?.substring(0, 1) + lastName?.substring(0, 1);

      // don't display the current user in the list since we already have the current user at the top of the modal
      if (authUserId === undefined || !compareUuidToString(authUserId, idir)) {
        return (
          <div
            className={`${
              selectedAssigneeIndex === key
                ? "assign_officer_modal_profile_card_selected"
                : "assign_officer_modal_profile_card"
            }`}
            key={personId}
            onClick={() => handleAssigneeClick(key, personId)}
          >
            <div className="assign_officer_modal_profile_card_column">
              <div className="assign_officer_modal_profile_card_profile-picture">
                <div data-initials-modal={officerInitials}></div>
              </div>
            </div>
            <div className="assign_officer_modal_profile_card_column">
              <div className="assign_officer_modal_profile_card_row_1">{displayName}</div>
              <div className="assign_officer_modal_profile_card_row_2">Officer</div>
            </div>
            <div className="assign_officer_modal_profile_card_column"></div>
          </div>
        );
      } else {
        return <></>;
      }
    });
  };

  const renderHeading = () => {
    if (searchInput.length >= 3 && !from(searchResults).any()) {
      return "No officers found";
    } else if (from(searchResults).any()) {
      return "Search results";
    } else {
      return "Suggested officers";
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
        <div className="assign_officer_modal_profile_card self-assign">
          <div className="assign_officer_modal_profile_card_column">
            <div className="assign_officer_modal_profile_card_profile-picture">
              <div
                data-initials-modal={initials}
                className="comp-profile-avatar"
              ></div>
            </div>
          </div>
          <div className="assign_officer_modal_profile_card_column">
            <div className="assign_officer_modal_profile_card_row_1">{displayName}</div>
            <div className="assign_officer_modal_profile_card_row_2">Officer</div>
          </div>
          <div className="assign_officer_modal_profile_card_column">
            <Button
              id="self_assign_button"
              title="Self Assign Button"
              onClick={handleSelfAssign}
            >
              Self assign
            </Button>
          </div>
        </div>
        <hr className="modal_hr" />
        <div id="assign_officer_modal_search">
          <div className="assign_officer_modal_subtitle">Everyone</div>
          <div className="input_row">
            <BsPerson className="icon" />
            <input
              id="officer-search"
              className="comp-form-control"
              placeholder="Type name to search"
              type="input"
              aria-label="Search"
              aria-describedby="basic-addon2"
              onChange={(evt) => handleInputChange(evt)}
              onFocus={() => handleInputFocus()}
              value={searchInput}
            />
            {searchInput && (
              <button
                type="reset"
                onClick={() => setSearchInput("")}
              >
                &times;
              </button>
            )}
          </div>
        </div>
        <hr className="modal_hr" />
        <div className="assign_officer_modal_subtitle">{renderHeading()}</div>
        <div className="modal-scroll">{renderOfficers()}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={close}
          className="modal-buttons"
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Assign</Button>
      </Modal.Footer>
    </>
  );
};
