import { id } from "date-fns/locale";
import { FC } from "react";
import { Link } from "react-router-dom";
import { complaintTypeToName } from "../../../../types/app/complaint-types";

export const ComplaintHeader: FC<{ id: string; complaintType: string }> = ({
  id,
  complaintType,
}) => {
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
          <div className="comp-box-species-type">Cougar</div>
        </div>
        <div className="comp-nature-of-complaint">Nature of Complaint</div>
      </div>
      {/* <!-- complaint info end --> */}

      {/* <!-- complaint status details start --> */}
      <div className="comp-complaint-status">
        <div className="comp-complaint-status-column comp-complaint-status-state">
          <div>
            <div className="comp-complaint-status-label">Status</div>
            {/* <div className="comp-status-badge">Open</div> */}
            <span className="badge comp-status-badge-open">Open</span>
          </div>
        </div>
        <div className="comp-complaint-status-column comp-complaint-status-updated">
          <div>
            <div className="comp-complaint-status-label">
              Date / Time Logged
            </div>
            <div className="comp-complaint-status-content">
              <i className="bi bi-calendar"></i>08/04/2023{" "}
              <i className="bi bi-clock"></i>2:01:01
            </div>
          </div>
        </div>
        <div className="comp-complaint-status-column comp-complaint-status-last-updated">
          <div>
            <div className="comp-complaint-status-label">Last Updated</div>
            <div>
              <i className="bi bi-calendar"></i>08/04/2023{" "}
              <i className="bi bi-clock"></i>12:01:01
            </div>
          </div>
        </div>
        <div className="comp-complaint-status-column comp-complaint-status-assigned">
          <div>
            <div className="comp-complaint-status-label">Officer Assigned</div>
            <div>
              <div data-initials-sm="TS" className="comp-orange-avatar-sm"><span>T.Sprado</span></div>
            </div>
          </div>
        </div>
        <div className="comp-complaint-status-column comp-complaint-status-updated">
          <div>
            <div className="comp-complaint-status-label">Created By</div>
            <div>
              <div data-initials-sm="ND" className="comp-blue-avatar-sm"><span>N.Drew</span></div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- complaint status details end --> */}
    </>
  );
};
