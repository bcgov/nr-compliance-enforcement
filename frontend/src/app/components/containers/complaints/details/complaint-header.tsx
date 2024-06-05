import { FC } from "react";
import { Link } from "react-router-dom";
import COMPLAINT_TYPES, { complaintTypeToName } from "../../../../types/app/complaint-types";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { selectComplaintHeader } from "../../../../store/reducers/complaints";
import { applyStatusClass, formatDate, formatTime, getAvatarInitials } from "../../../../common/methods";
import { Badge, Button, Dropdown } from "react-bootstrap";
import { openModal } from "../../../../store/reducers/app";
import { ASSIGN_OFFICER, CHANGE_STATUS } from "../../../../types/modal/modal-types";
import config from "../../../../../config";

interface ComplaintHeaderProps {
  id: string;
  complaintType: string;
  readOnly: boolean;
  editButtonClick: () => void;
  cancelButtonClick: () => void;
  saveButtonClick: () => void;
}

export const ComplaintHeader: FC<ComplaintHeaderProps> = ({
  id,
  complaintType,
  readOnly,
  editButtonClick,
  cancelButtonClick,
  saveButtonClick,
}) => {
  const {
    loggedDate,
    createdBy,
    lastUpdated,
    officerAssigned,
    status,
    zone,
    natureOfComplaint,
    violationType,
    species,
    complaintAgency,
  } = useAppSelector(selectComplaintHeader(complaintType));

  const dispatch = useAppDispatch();
  const assignText = officerAssigned === "Not Assigned" ? "Assign" : "Reassign";

  const openStatusChangeModal = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CHANGE_STATUS,
        data: {
          title: "Update status?",
          description: "Status",
          complaint_identifier: id,
          complaint_type: complaintType,
        },
      }),
    );
  };

  const openAsignOfficerModal = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "md",
        modalType: ASSIGN_OFFICER,
        data: {
          title: "Assign complaint",
          description: "Suggested officers",
          complaint_identifier: id,
          complaint_type: complaintType,
          zone: zone,
          agency_code: complaintAgency,
        },
      }),
    );
  };

  return (
    <>
      <div className="comp-details-header">
        <div className="comp-container">
          {/* <!-- breadcrumb start --> */}
          <div className="comp-complaint-breadcrumb">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                {config.SHOW_EXPERIMENTAL_FEATURES === "true" && (
                  <li className="breadcrumb-item">
                    <i className="bi bi-house-door"></i> Home
                  </li>
                )}
                <li className="breadcrumb-item comp-nav-item-name-inverted">
                  <Link to={`/complaints/${complaintType}`}>{complaintTypeToName(complaintType)}</Link>
                </li>
                <li
                  className="breadcrumb-item"
                  aria-current="page"
                >
                  {id}
                </li>
              </ol>
            </nav>
          </div>
          {/* <!-- breadcrumb end --> */}

          {/* <!-- complaint info start --> */}
          <div className="comp-details-title-container">
            <div className="comp-details-title-info">
              <h1 className="comp-box-complaint-id">
                <span>Complaint </span>#{id}
              </h1>
            </div>

            {/* Badges */}
            <div className="comp-details-badge-container">
              <Badge className={`badge ${applyStatusClass(status)}`}>{status}</Badge>
            </div>

            {/* Action Buttons */}
            {readOnly && (
              <div className="comp-header-actions">
                <div className="comp-header-actions-mobile">
                  <Dropdown>
                    <Dropdown.Toggle
                      aria-label="Actions Menu"
                      variant="outline-primary"
                      className="icon-btn"
                      id="dropdown-basic"
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                      <Dropdown.Item
                        as="button"
                        onClick={openAsignOfficerModal}
                      >
                        <i className="bi bi-person-plus"></i>
                        <span>{assignText}</span>
                      </Dropdown.Item>
                      <Dropdown.Item
                        as="button"
                        onClick={openStatusChangeModal}
                      >
                        <i className="bi bi-arrow-repeat"></i>
                        <span>Update Status</span>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="comp-header-actions-desktop">
                  <Button
                    id="details-screen-assign-button"
                    title="Assign to Officer"
                    variant="outline-light"
                    onClick={openAsignOfficerModal}
                  >
                    <i className="bi bi-person-plus"></i>
                    <span>{assignText}</span>
                  </Button>
                  <Button
                    id="details-screen-update-status-button"
                    title="Update Status"
                    variant="outline-light"
                    onClick={openStatusChangeModal}
                  >
                    <i className="bi bi-arrow-repeat"></i>
                    <span>Update Status</span>
                  </Button>
                </div>
              </div>
            )}
            {!readOnly && (
              <div className="comp-header-actions">
                <Button
                  id="details-screen-cancel-edit-button-top"
                  title="Cancel Edit Complaint"
                  variant="outline-light"
                  onClick={cancelButtonClick}
                >
                  Cancel
                </Button>
                <Button
                  id="details-screen-cancel-save-button-top"
                  title="Save Complaint"
                  variant="outline-light"
                  onClick={saveButtonClick}
                >
                  Save Complaint
                </Button>
              </div>
            )}
          </div>

          {/* Nature of Complaint Details */}
          <div
            className="comp-nature-of-complaint"
            id="comp-nature-of-complaint"
          >
            {readOnly && species && complaintType !== COMPLAINT_TYPES.ERS && (
              <span className="comp-box-species-type">{species}&nbsp;&nbsp;•&nbsp;&nbsp;</span>
            )}
            {readOnly && <span>{complaintType !== COMPLAINT_TYPES.ERS ? natureOfComplaint : violationType}</span>}
          </div>
        </div>
      </div>

      {/* <!-- complaint status details start --> */}
      {readOnly && (
        <div className="comp-container">
          <div className="comp-header-status-container">
            <div className="comp-details-status">
              <dl className="comp-details-date-logged">
                <dt>Date Logged</dt>
                <dd className="comp-date-time-value">
                  <div>
                    <i className="bi bi-calendar"></i>
                    {formatDate(loggedDate)}
                  </div>
                  <div>
                    <i className="bi bi-clock"></i>
                    {formatTime(loggedDate)}
                  </div>
                </dd>
              </dl>

              <dl className="comp-details-date-assigned">
                <dt>Last Updated</dt>
                <dd className="comp-date-time-value">
                  {lastUpdated && (
                    <>
                      <div>
                        <i className="bi bi-calendar"></i>
                        {formatDate(lastUpdated)}
                      </div>
                      <div>
                        <i className="bi bi-clock"></i>
                        {formatTime(lastUpdated)}
                      </div>
                    </>
                  )}
                  {!lastUpdated && <>Not Available</>}
                </dd>
              </dl>

              <dl>
                <dt>Officer Assigned</dt>
                <dd>
                  <div
                    data-initials-sm={getAvatarInitials(officerAssigned)}
                    className="comp-avatar comp-avatar-sm comp-avatar-orange"
                  >
                    <span id="comp-details-assigned-officer-name-text-id">{officerAssigned}</span>
                  </div>
                </dd>
              </dl>

              <dl>
                <dt>Created By</dt>
                <dd>
                  <div
                    data-initials-sm={getAvatarInitials(createdBy)}
                    className="comp-avatar comp-avatar-sm comp-avatar-blue"
                  >
                    <span>{createdBy}</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
          <hr className="comp-header-spacer"></hr>
        </div>
      )}
      {/* <!-- complaint status details end --> */}
    </>
  );
};
