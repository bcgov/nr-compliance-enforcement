import { FC } from "react";
import {
  selectComplaintDetails,
  selectComplaintHeader,
} from "../../store/reducers/complaints";
import { useAppSelector } from "../../hooks/hooks";
import { ComplaintDetails } from "../../types/complaints/details/complaint-details";
import {
  applyStatusClass,
  formatDate,
  formatTime,
  getAvatarInitials,
  getFirstInitialAndLastName,
} from "../../common/methods";
import COMPLAINT_TYPES, {
  complaintTypeToName,
} from "../../types/app/complaint-types";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Popup } from "react-leaflet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';


interface Props {
  complaint_identifier: string;
  complaintType: string;
}

export const ComplaintSummaryPopup: FC<Props> = ({
  complaint_identifier,
  complaintType,
}) => {
  const { officerAssigned, natureOfComplaint, species, violationType } =
    useAppSelector(selectComplaintHeader(complaintType));

  const { violationInProgress } = useAppSelector(
    selectComplaintDetails(complaintType)
  ) as ComplaintDetails;

  const { location, zone } = useAppSelector(
    selectComplaintDetails(complaintType)
  ) as ComplaintDetails;

  const { loggedDate, lastUpdated, status } = useAppSelector(
    selectComplaintHeader(complaintType)
  );

  // used to indicate what sections should be rendered in the popup
  const renderHWCRSection = COMPLAINT_TYPES.HWCR === complaintType;

  const inProgressInd = violationInProgress ? "In Progress" : "";

  return (
    <Popup keepInView={true} className="map-comp-popup">
      <div className="map-comp-summary-popup-container">
        <div className="map-comp-summary-popup-details">
          <div className="map-comp-popup-header-container">
            <div className="map-comp-summary-popup-header">
              <div className="complaint-identifier">{complaint_identifier}</div>
              <div className="complaint-assignee">
                <div
                  data-initials-sm={getAvatarInitials(officerAssigned)}
                  className={"Not Assigned" === officerAssigned ? "leaflet-popup-not-assigned" : "comp-orange-avatar-sm"}
                >
                  <span
                    id="comp-details-assigned-officer-name-text-id"
                    className="comp-padding-left-xs"
                  >
                    {getFirstInitialAndLastName(officerAssigned)}
                  </span>
                </div>
              </div>
            </div>

            <div className="comp-complaint-info">
              <div className="map-comp-summary-popup-subheading">
                <div className={`comp-box-conflict-type ${renderHWCRSection ? 'hwcr-conflict-type' : 'allegation-conflict-type'}`}>
                  {complaintTypeToName(complaintType,true)}
                </div>
                {renderHWCRSection ? (
                  <div className="comp-box-species-type">{species}</div>
                ) : (
                  violationInProgress && (
                    <div
                      id="comp-details-status-text-id"
                      className="comp-box-violation-in-progress"
                    >
                      <FontAwesomeIcon id="violation-in-progress-icon" icon={faExclamationCircle} />{inProgressInd}
                    </div>
                  )
                )}
                <div
                  id="comp-details-status-text-id"
                  className={`badge ${applyStatusClass(status)}`}
                >
                  {status}
                </div>
              </div>
            </div>
          </div>
            <div className="map-comp-nature-of-complaint">
              {renderHWCRSection ? natureOfComplaint : violationType}
            </div>
          <div className="map-comp-summary-popup-details-section">
            <div className="comp-details-content">
              <div>
                <label>Logged</label>
                <i className="bi bi-calendar comp-margin-right-xxs"></i>
                {formatDate(loggedDate)}
                <i className="bi bi-clock comp-margin-left-xxs comp-margin-right-xxs"></i>
                {formatTime(loggedDate)}
              </div>
              <div>
                <label>Community</label>
                {zone}
              </div>
              <div className="map-comp-popup-address">
                <label>Location/Address</label>
                <div>{location}</div>
              </div>
              <div>
                <label>Last Updated</label>
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
        </div>
        <Link to={`/complaint/${complaintType}/${complaint_identifier}`}>
          <Button id="view-complaint-details-button-id" variant="primary">View Details</Button>
        </Link>
      </div>
    </Popup>
  );
};
