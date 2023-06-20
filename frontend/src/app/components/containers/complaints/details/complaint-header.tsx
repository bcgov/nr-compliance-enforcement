import { FC } from "react";
import { Link } from "react-router-dom";
import { complaintTypeToName } from "../../../../types/app/complaint-types";
import { useAppSelector } from "../../../../hooks/hooks";
import { selectComplaintHeader } from "../../../../store/reducers/hwcr-complaints";
import {
  formatDate,
  formatTime,
  getAvatarInitials,
} from "../../../../common/methods";

export const ComplaintHeader: FC<{ id: string; complaintType: string }> = ({
  id,
  complaintType,
}) => {
  const {
    loggedDate,
    createdBy,
    lastUpdated,
    officerAssigned,
    status,
    natureOfComplaint,
    species,
  } = useAppSelector(selectComplaintHeader);

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
          <div className="comp-box-conflict-type">
            {complaintTypeToName(complaintType)}
          </div>
          <div className="comp-box-species-type">{species}</div>
        </div>
        <div className="comp-nature-of-complaint">{natureOfComplaint}</div>
      </div>
      {/* <!-- complaint info end --> */}

      {/* <!-- complaint status details start --> */}
      <div className="comp-details-status">
        <div className="comp-details-header-column comp-details-status-width">
          <div>
            <div className="comp-details-content-label">Status</div>
            <div className="badge comp-status-badge-open">{status}</div>
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
                <span className="comp-padding-left-xs">{officerAssigned}</span>
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
      {/* <!-- complaint status details end --> */}
    </>
  );
};
