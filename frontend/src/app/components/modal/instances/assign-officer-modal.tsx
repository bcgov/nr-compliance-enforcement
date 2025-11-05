import { ChangeEvent, FC, useState } from "react";
import { Modal, Button, CloseButton, ListGroup, ListGroupItem, Card } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import {
  profileDisplayName,
  profileIdir,
  profileInitials,
  selectModalData,
  userId,
  isFeatureActive,
} from "@store/reducers/app";
import {
  assignCurrentUserToComplaint,
  searchOfficers,
  selectOfficersByZoneAgencyAndRole,
  updateComplaintAssignee,
} from "@store/reducers/officer";
import { UUID } from "node:crypto";
import { BsPerson } from "react-icons/bs";
import { from } from "linq-to-typescript";
import { FEATURE_TYPES } from "@constants/feature-flag-types";

type AssignOfficerModalProps = {
  close: () => void;
  submit: () => void;
  complaint_type: string;
  zone: string;
  park_area_guids: string[];
  isHeader: boolean;
};

// A modal dialog containing a list of officers in the current user's zone.  Used to select an officer to assign to a complaint.
export const AssignOfficerModal: FC<AssignOfficerModalProps> = ({
  close,
  submit,
  complaint_type,
  zone,
  park_area_guids,
  isHeader,
}) => {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  const { title, complaint_identifier } = modalData;
  const initials = useAppSelector(profileInitials);
  const displayName = useAppSelector(profileDisplayName);
  const idir = useAppSelector(profileIdir);
  const userid = useAppSelector(userId);
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [searchInput, setSearchInput] = useState<string>("");

  const officersJson = useAppSelector(selectOfficersByZoneAgencyAndRole(modalData?.agency_code, zone, park_area_guids));
  const searchResults = useAppSelector(searchOfficers(searchInput, modalData?.agency_code, complaint_type));
  const showExperimentalFeature = useAppSelector(isFeatureActive(FEATURE_TYPES.EXPERIMENTAL_FEATURE));

  // stores the state of the officer that was clicked
  const handleAssigneeClick = (personId: string) => {
    setSelectedAssignee(personId);
  };

  // assigns the selected officer to a complaint
  const handleSubmit = () => {
    if (selectedAssignee !== "") {
      dispatch(
        updateComplaintAssignee(userid, complaint_identifier, complaint_type, isHeader, selectedAssignee as UUID),
      );
      submit();
    }
  };

  // assigns the logged in user to a complaint
  const handleSelfAssign = () => {
    dispatch(assignCurrentUserToComplaint(userid, idir, complaint_identifier, complaint_type, isHeader));
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
    setSelectedAssignee("");
  };

  const renderOfficers = () => {
    const getOfficerList = () => {
      if (searchInput.length >= 2 && from(searchResults).any()) {
        return searchResults;
      } else if (searchInput.length >= 2 && !from(searchResults).any()) {
        return [];
      } else {
        return officersJson;
      }
    };

    const items = getOfficerList();
    if (items && from(items).any()) {
      return items.map((val) => {
        const { first_name: firstName, last_name: lastName } = val;
        const { app_user_guid: appUserGuid, auth_user_guid: authUserGuid } = val;

        const displayName = `${lastName}, ${firstName} `;
        const officerInitials = lastName?.substring(0, 1) + firstName?.substring(0, 1);

        // don't display the current user in the list since we already have the current user at the top of the modal
        if (appUserGuid === undefined || !compareUuidToString(authUserGuid, idir)) {
          return (
            <ListGroupItem
              action
              className={`${selectedAssignee === appUserGuid ? "comp-profile-card comp-profile-card-selected" : "comp-profile-card"}`}
              key={appUserGuid}
              onClick={() => handleAssigneeClick(appUserGuid)}
            >
              <div className="comp-profile-card-info">
                <div
                  className="comp-avatar comp-avatar-sm comp-avatar-orange"
                  data-initials-modal={officerInitials}
                ></div>
                <div className="assign_officer_modal_profile_card_row_1">{displayName}</div>
                {showExperimentalFeature && <div className="assign_officer_modal_profile_card_row_2">Officer</div>}
              </div>
            </ListGroupItem>
          );
        } else {
          return <></>;
        }
      });
    }
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
        <Modal.Header closeButton={true}>
          <Modal.Title as="h3">{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body className="pt-0 pb-0">
        <Card
          className="ps-0 comp-profile-card"
          style={{ marginBottom: "24px" }}
        >
          <div className="comp-profile-card-info">
            <div
              className="comp-avatar comp-avatar-sm comp-avatar-orange"
              data-initials-modal={initials}
            ></div>

            <div className="assign_officer_modal_profile_card_row_1">{displayName}</div>
            {showExperimentalFeature && <div className="assign_officer_modal_profile_card_row_2">Officer</div>}
          </div>
          <div className="profile-card-actions">
            <Button
              id="self_assign_button"
              title="Self assign Button"
              onClick={handleSelfAssign}
            >
              Self assign
            </Button>
          </div>
        </Card>

        <section
          style={{ marginBottom: "24px" }}
          id="assign_officer_modal_search"
        >
          <h4 style={{ marginBottom: "8px", fontSize: "16px", fontWeight: 700 }}>All officers</h4>
          <div className="assign-officer-search-container">
            <div className="comp-search-input">
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
                <CloseButton
                  className="clear-search-button"
                  onClick={() => setSearchInput("")}
                  tabIndex={0}
                ></CloseButton>
              )}
            </div>
          </div>
        </section>
        <section>
          <h4 style={{ marginBottom: "8px", fontSize: "16px", fontWeight: 700 }}>{renderHeading()}</h4>
          <ListGroup className="modal-scroll">{renderOfficers()}</ListGroup>
        </section>
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
