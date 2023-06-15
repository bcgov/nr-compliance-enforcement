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
import { HwcrComplaintState } from "../../../../types/complaints/hrcr-complaints-state";

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
      <div className="comp-complaint-status">
        <div className="comp-complaint-status-column comp-complaint-status-state">
          <div>
            <div className="comp-complaint-status-label">Status</div>
            <span className="badge comp-status-badge-open">{status}</span>
          </div>
        </div>
        <div className="comp-complaint-status-column comp-complaint-status-updated">
          <div>
            <div className="comp-complaint-status-label">
              Date / Time Logged
            </div>
            <div className="comp-complaint-status-content">
              <i className="bi bi-calendar"></i>
              {formatDate(loggedDate)}
              <i className="bi bi-clock"></i>
              {formatTime(loggedDate)}
            </div>
          </div>
        </div>
        <div className="comp-complaint-status-column comp-complaint-status-last-updated">
          <div>
            <div className="comp-complaint-status-label">Last Updated</div>
            <div>
              {lastUpdated && (
                <>
                  <i className="bi bi-calendar"></i>
                  {formatDate(lastUpdated)}
                  <i className="bi bi-clock"></i>
                  {formatTime(lastUpdated)}
                </>
              )}
              {!lastUpdated && <>Not Available</>}
            </div>
          </div>
        </div>
        <div className="comp-complaint-status-column comp-complaint-status-assigned">
          <div>
            <div className="comp-complaint-status-label">Officer Assigned</div>
            <div>
              <div
                data-initials-sm={getAvatarInitials(officerAssigned)}
                className="comp-orange-avatar-sm"
              >
                <span>{officerAssigned}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="comp-complaint-status-column comp-complaint-status-updated">
          <div>
            <div className="comp-complaint-status-label">Created By</div>
            <div>
              <div
                data-initials-sm={getAvatarInitials(createdBy)}
                className="comp-blue-avatar-sm"
              >
                <span>{createdBy}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- complaint status details end --> */}
    </>
  );
};
