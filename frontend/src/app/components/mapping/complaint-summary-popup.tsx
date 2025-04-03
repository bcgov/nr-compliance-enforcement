import { FC } from "react";
import { selectComplaintDetails, selectComplaintHeader } from "@store/reducers/complaints";
import { useAppSelector } from "@hooks/hooks";
import { applyStatusClass, formatDate } from "@common/methods";
import { Badge, Button } from "react-bootstrap";
import { Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { getUserAgency } from "@/app/service/user-service";

interface Props {
  complaint_identifier: string;
  complaintType: string;
}

export const ComplaintSummaryPopup: FC<Props> = ({ complaint_identifier, complaintType }) => {
  const navigate = useNavigate();
  const { officerAssigned, natureOfComplaint, species, violationType, loggedDate, status, girType } = useAppSelector(
    selectComplaintHeader(complaintType),
  );

  const { violationInProgress, location, area, ownedBy } = useAppSelector((state) =>
    selectComplaintDetails(state, complaintType),
  );

  const inProgressInd = violationInProgress ? "In Progress" : "";

  const userAgency = getUserAgency();
  const derivedStatus = ownedBy !== userAgency ? "Referred" : status;

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
              className={`badge ${applyStatusClass(derivedStatus)}`}
            >
              {derivedStatus}
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
              <dt className="comp-summary-popup-details">Date logged</dt>
              <dd>{formatDate(loggedDate)}</dd>
            </div>
            <div>
              <dt className="comp-summary-popup-details">Officer assigned</dt>
              <dd id="comp-details-assigned-officer-name-text-id">{officerAssigned}</dd>
            </div>
            <div>
              <dt className="comp-summary-popup-details">Community</dt>
              <dd id="popup-community-label">{area}</dd>
            </div>
            <div>
              <dt className="comp-summary-popup-details">Location</dt>
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
            View details
          </Button>
        </div>
      </div>
    </Popup>
  );
};
