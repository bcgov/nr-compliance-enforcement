import { FC } from "react";
import { selectComplaintDetails, selectComplaintHeader } from "../../store/reducers/complaints";
import { useAppSelector } from "../../hooks/hooks";
import { ComplaintDetails } from "../../types/complaints/details/complaint-details";
import { applyStatusClass, formatDate, getFirstInitialAndLastName } from "../../common/methods";
import COMPLAINT_TYPES from "../../types/app/complaint-types";
import { Badge, Button } from "react-bootstrap";
import { Popup } from "react-leaflet";

interface Props {
  complaint_identifier: string;
  complaintType: string;
}

export const ComplaintSummaryPopup: FC<Props> = ({ complaint_identifier, complaintType }) => {
  const { officerAssigned, natureOfComplaint, species, violationType, loggedDate, status } = useAppSelector(
    selectComplaintHeader(complaintType),
  );

  const { violationInProgress, location, area } = useAppSelector(
    selectComplaintDetails(complaintType),
  ) as ComplaintDetails;

  // used to indicate what sections should be rendered in the popup
  const renderHWCRSection = COMPLAINT_TYPES.HWCR === complaintType;

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
            {renderHWCRSection ? (
              <div>
                <span className="comp-box-species-type">{species}</span> • <span>{natureOfComplaint}</span>
              </div>
            ) : (
              <div>
                {violationType} � {inProgressInd}
              </div>
            )}
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
              <dd id="comp-details-assigned-officer-name-text-id">{getFirstInitialAndLastName(officerAssigned)}</dd>
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
            href={`/complaint/${complaintType}/${complaint_identifier}`}
          >
            View Details
          </Button>
        </div>
      </div>
    </Popup>
  );
};
