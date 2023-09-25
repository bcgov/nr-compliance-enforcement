import { FC, useEffect, useState } from "react";
import {
  getWildlifeComplaintByComplaintIdentifier,
  selectComplaintDeails,
  selectComplaintHeader,
} from "../../store/reducers/complaints";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { ComplaintDetails } from "../../types/complaints/details/complaint-details";
import {
  applyStatusClass,
  formatDate,
  formatTime,
  getAvatarInitials,
} from "../../common/methods";
import { complaintTypeToName } from "../../types/app/complaint-types";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Popup } from "react-leaflet";

interface Props {
  complaint_identifier: string;
  complaintType: string;
}

export const ComplaintSummaryPopup: FC<Props> = ({
  complaint_identifier,
  complaintType,
}) => {
  
  const { officerAssigned, natureOfComplaint, species } = useAppSelector(
    selectComplaintHeader(complaintType)
  );

  const { location, zone } = useAppSelector(
    selectComplaintDeails(complaintType)
  ) as ComplaintDetails;

  const { loggedDate, lastUpdated, status } = useAppSelector(
    selectComplaintHeader(complaintType)
  );

  return (
    <Popup className="map-comp-popup">
    <div className="map-comp-summary-popup-container">
      <div className="map-comp-summary-popup-details">
        <div className="map-comp-summary-popup-header">
            <div className="complaint-identifier">{complaint_identifier}</div>
            <div className="complaint-assignee ">
              <div
                data-initials-sm={getAvatarInitials(officerAssigned)}
                className="comp-orange-avatar-sm"
              >
                <span
                  id="comp-details-assigned-officer-name-text-id"
                  className="comp-padding-left-xs"
                >
                  {officerAssigned}
                </span>
              </div>
          </div>
        </div>
        <div className="comp-complaint-info">
          <div className="map-comp-summary-popup-subheading">
            <div
              className="comp-box-conflict-type hwcr-conflict-type"
            >
              {complaintTypeToName(complaintType)}
            </div>
            <div className="comp-box-species-type">{species}</div>

            <div
              id="comp-details-status-text-id"
              className={`badge ${applyStatusClass(status)}`}
            >
              {status}
            </div>
          </div>
        </div>
        <div className="map-comp-nature-of-complaint">{natureOfComplaint}</div>
        <div className="map-comp-summary-popup-details-section">
          <div className="comp-details-content">
            <div>
              Logged <i className="bi bi-calendar comp-margin-right-xxs"></i>
              {formatDate(loggedDate)}
              <i className="bi bi-clock comp-margin-left-xxs comp-margin-right-xxs"></i>
              {formatTime(loggedDate)}
            </div>
          </div>
          <div>Community {zone}</div>
          <div>Location/Address {location}</div>
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
      <Link to={`/complaint/HWCR/${complaint_identifier}`}>
        <Button variant="primary">View Details</Button>
      </Link>
    </div>
    </Popup>
  );
};
