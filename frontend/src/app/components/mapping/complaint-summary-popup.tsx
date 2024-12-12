import { FC } from "react";
import { selectComplaintDetails, selectComplaintHeader } from "@store/reducers/complaints";
import { useAppSelector } from "@hooks/hooks";
import { ComplaintDetails } from "@apptypes/complaints/details/complaint-details";
import { applyStatusClass, formatDate } from "@common/methods";
import { Badge, Button } from "react-bootstrap";
import { Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";

interface Props {
  complaint_identifier: string;
  complaintType: string;
}

export const ComplaintSummaryPopup: FC<Props> = ({ complaint_identifier, complaintType }) => {
  const navigate = useNavigate();
  const { officerAssigned, natureOfComplaint, species, violationType, loggedDate, status, girType } = useAppSelector(
    selectComplaintHeader(complaintType),
  );

  const { violationInProgress, location, area } = useAppSelector(
    selectComplaintDetails(complaintType),
  ) as ComplaintDetails;

  const inProgressInd = violationInProgress ? "In Progress" : "";

  return (
    <Popup
      keepInView={true}
      className="comp-map-popup"
    >
      <div>
        <div className="comp-map-popup-header">
          <div className="comp-map-popup-header-title">
            <h2>{complaint_identifier}</h2>
            <Badge
              id="comp-details-status-text-id"
              className={`badge ${applyStatusClass(status)}`}
            >
              {status}
            </Badge>
          </div>
          <div className="comp-map-popup-header-meta">
            {complaintType === "HWCR" && (
              <div>
                <span className="comp-box-species-type">{species}</span> • <span>{natureOfComplaint}</span>
              </div>
            )}
            {complaintType === "ERS" && (
              <div>
                {violationType} • {inProgressInd}
              </div>
            )}
            {complaintType === "GIR" && <div>{girType}</div>}
          </div>
        </div>
        <div className="comp-map-popup-details">
          <dl>
            <div>
              <dt className="text-muted">Date Logged</dt>
              <dd>{formatDate(loggedDate)}</dd>
            </div>
            <div>
              <dt className="text-muted">Officer Assigned</dt>
              <dd id="comp-details-assigned-officer-name-text-id">{officerAssigned}</dd>
            </div>
            <div>
              <dt className="text-muted">Community</dt>
              <dd id="popup-community-label">{area}</dd>
            </div>
            <div>
              <dt className="text-muted">Location</dt>
              <dd>{location}</dd>
            </div>
          </dl>
          <Button
            as="a"
            variant="primary"
            size="sm"
            className="comp-map-popup-details-btn"
            id="view-complaint-details-button-id"
            onClick={() => navigate(`/complaint/${complaintType}/${complaint_identifier}`)}
          >
            View Details
          </Button>
        </div>
      </div>
    </Popup>
  );
};
