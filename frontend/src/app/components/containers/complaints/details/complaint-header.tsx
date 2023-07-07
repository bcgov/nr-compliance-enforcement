import { FC } from "react";
import { Link } from "react-router-dom";
import COMPLAINT_TYPES, {
  complaintTypeToName,
} from "../../../../types/app/complaint-types";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { selectComplaintHeader } from "../../../../store/reducers/complaints";
import {
  formatDate,
  formatTime,
  getAvatarInitials,
} from "../../../../common/methods";
import { Button,  } from "react-bootstrap";
import { BsPersonPlus, BsPencil } from 'react-icons/bs';
import { openModal } from "../../../../store/reducers/app";
import { AssignOfficer, ChangeStatus } from "../../../../types/modal/modal-types";

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
  saveButtonClick
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
    species
  } = useAppSelector(selectComplaintHeader(complaintType));

  const dispatch = useAppDispatch();
  const assignText = officerAssigned === 'Not Assigned' ? 'Assign' : 'Reassign';
  const applyStatusClass = (state: string): string => {
    switch (state.toLowerCase()) {
      case "open":
        return "comp-status-badge-open";
        case "closed": 
        return "comp-status-badge-closed";
      default: 
      return "";
    }
  };

  const openStatusChangeModal = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "md",
        modalType: ChangeStatus,
        data: {
          title: "Update status?",
          description: "Status",
          complaint_identifier: id,
          complaint_type: complaintType
        }
      })
    );
  };

  const openAsignOfficerModal = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "md",
        modalType: AssignOfficer,
        data: {
          title: "Assign Complaint",
          description: "Suggested Officers",
          complaint_identifier: id,
          complaint_type: complaintType,
          zone: zone
        }
      })
    );
  };

  return (
    <>
      {/* <!-- breadcrumb start --> */}
      <div className="comp-complaint-breadcrumb">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <i className="bi bi-house-door"></i> Home
            </li>
            <li className="breadcrumb-item">
              <Link to={`/complaints/${complaintType}`}>
                {complaintTypeToName(complaintType)}
              </Link>
            </li>
            <li className="breadcrumb-item" aria-current="page">
              {id}
            </li>
          </ol>
        </nav>
      </div>
      {/* <!-- breadcrumb end --> */}

      {/* <!-- complaint info start --> */}
      <div className="comp-details-header">
        <div className="comp-complaint-info">
          <div className="comp-box-complaint-id">Complaint #{id}</div>
            <div
              className={`comp-box-conflict-type ${
                complaintType !== COMPLAINT_TYPES.ERS
                  ? "hwcr-conflict-type"
                  : "allegation-conflict-type"
              }`}
            >
              {complaintTypeToName(complaintType)}
            </div>
          { readOnly && species && complaintType !== COMPLAINT_TYPES.ERS && (
            <div className="comp-box-species-type">{species}</div>
          )}
          { readOnly &&
            <div className="comp-box-actions">
              <Button id="details-screen-assign-button" title="Assign to Officer" variant="outline-primary" onClick={openAsignOfficerModal} className=""><span>{assignText}</span><BsPersonPlus/></Button>
              <Button id="details-screen-update-status-button" title="Update Status" variant="outline-primary"  onClick={openStatusChangeModal}>Update Status</Button>
              <Button id="details-screen-edit-button" title="Edit Complaint" variant="outline-primary"  onClick={editButtonClick}><span>Edit</span><BsPencil/></Button>
            </div>
          }
          { !readOnly && 
            <div className="comp-box-actions">
              <Button id="details-screen-cancel-edit-button-top" title="Cancel Edit Complaint" variant="outline-primary" onClick={cancelButtonClick}>Cancel</Button>
              <Button id="details-screen-cancel-save-button-top" title="Save Complaint" variant="outline-primary" onClick={saveButtonClick}>Save Changes</Button>
            </div>
          }
        </div>
        <div className="comp-nature-of-complaint">
          { readOnly && complaintType !== COMPLAINT_TYPES.ERS
            ? natureOfComplaint
            : violationType}            
        </div>
        { readOnly &&
          <div className="comp-nature-of-complaint">
            { complaintType !== COMPLAINT_TYPES.ERS
              ? natureOfComplaint
              : violationType}            
          </div>
        }
      </div>
      {/* <!-- complaint info end --> */}

      {/* <!-- complaint status details start --> */}
      { readOnly &&
      <div className="comp-details-status">
        <div className="comp-details-header-column comp-details-status-width">
          <div>
            <div className="comp-details-content-label">Status</div>
            <div id="comp-details-status-text-id" className={`badge ${applyStatusClass(status)}`}>{status}</div>
          </div>
        </div>

        <div className="comp-details-header-column">
          <div className="comp-complaint-created-width">
            <div className="comp-details-content-label">Date / Time Logged</div>
            <div className="comp-details-content">
              <i className="bi bi-calendar comp-margin-right-xxs"></i>
              {formatDate(loggedDate)}
              <i className="bi bi-clock comp-margin-left-xxs comp-margin-right-xxs"></i>
              {formatTime(loggedDate)}
            </div>
          </div>
        </div>

        <div className="comp-details-header-column">
          <div className="comp-complaint-last-updated-width">
            <div className="comp-details-content-label">Last Updated</div>
            <div className="comp-details-content">
              {lastUpdated && (
                <>
                  <i className="bi bi-calendar comp-margin-right-xxs"></i>
                  {formatDate(lastUpdated)}
                  <i className="bi bi-clock comp-margin-left-xxs comp-margin-right-xxs"></i>
                  {formatTime(lastUpdated)}
                </>
              )}
              {!lastUpdated && <>Not Available</>}
            </div>
          </div>
        </div>

        <div className="comp-details-header-column">
          <div className="comp-complaint-assigned-width">
            <div className="comp-details-content-label">Officer Assigned</div>
            <div className="comp-details-content">
              <div
                data-initials-sm={getAvatarInitials(officerAssigned)}
                className="comp-orange-avatar-sm"
              >
                <span id="comp-details-assigned-officer-name-text-id" className="comp-padding-left-xs">{officerAssigned}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="comp-details-header-column">
          <div className="comp-complaint-created-by-width">
            <div className="comp-details-content-label">Created By</div>
            <div>
              <div
                data-initials-sm={getAvatarInitials(createdBy)}
                className="comp-blue-avatar-sm"
              >
                <span className="comp-padding-left-xs">{createdBy}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      }
      {/* <!-- complaint status details end --> */}
    </>
  );
};
