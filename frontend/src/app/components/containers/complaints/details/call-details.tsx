import { FC } from "react";
import { Row, Col } from "react-bootstrap";
import { useAppSelector } from "../../../../hooks/hooks";
import {
  formatDate,
  formatDateWithOffset,
  formatTime,
  formatTimeWithOffset,
  renderCoordinates,
} from "../../../../common/methods";
import { Coordinates } from "../../../../types/app/coordinate-type";
import { ComplaintDetailsAttractant } from "../../../../types/complaints/details/complaint-attactant";
import { selectComplaintDetails } from "../../../../store/reducers/complaints";
import COMPLAINT_TYPES from "../../../../types/app/complaint-types";
import { ComplaintDetails } from "../../../../types/complaints/details/complaint-details";

interface ComplaintHeaderProps {
  complaintType: string;
}

export const CallDetails: FC<ComplaintHeaderProps> = ({ complaintType }) => {
  const {
    details,
    location,
    locationDescription,
    incidentDateTime,
    timezoneCode,
    coordinates,
    area,
    region,
    zone,
    office,
    attractants,
    violationInProgress,
    violationObserved,
  } = useAppSelector(selectComplaintDetails(complaintType)) as ComplaintDetails;

  return (
    <div className="comp-complaint-details-block">
      <h6>Call Details</h6>
      {/* readonly call details section */}
      <div className="comp-complaint-call-details">
        <Row>
          <Col md="6" className="comp-padding-right-28">
            <div>
              <div className="comp-details-content-label">
                Complaint Description
              </div>
              <p id="comp-details-description">{details}</p>
            </div>
            <div>
              <div className="comp-details-content-label ">Incident Time</div>
              <div
                className="comp-details-content"
                id="complaint-incident-date-time"
              >
                <i
                  className="bi bi-calendar comp-margin-right-xxs"
                  id="complaint-incident-date"
                ></i>
                {formatDateWithOffset(incidentDateTime,timezoneCode)}
                <i className="bi bi-clock comp-margin-left-xxs comp-margin-right-xxs"></i>
                {formatTimeWithOffset(incidentDateTime,timezoneCode)}
              </div>
            </div>

            {complaintType === COMPLAINT_TYPES.HWCR && (
              <div>
                <div className="comp-details-content-label ">Attractants</div>
                <span className="comp-complaint-attactants">
                  {!attractants ||
                    attractants.map(
                      ({ key, description }: ComplaintDetailsAttractant) => {
                        return (
                          <span
                            className="badge comp-attactant-badge comp-margin-left-xxs"
                            key={key}
                          >
                            {description}
                          </span>
                        );
                      },
                    )}
                </span>
              </div>
            )}

            {complaintType === COMPLAINT_TYPES.ERS && (
              <>
                <div>
                  <span className="comp-details-content-label">
                    Violation In Progress
                  </span>
                  <span
                    id="comp-details-violation-in-progress"
                    className="comp-details-content"
                  >
                    {violationInProgress ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <span className="comp-details-content-label ">
                    Violation Observed
                  </span>
                  <span
                    id="comp-details-violation-observed"
                    className="comp-details-content"
                  >
                    {violationObserved ? "Yes" : "No"}
                  </span>
                </div>
              </>
            )}
          </Col>
          <Col md="6" className="comp-padding-left-28">
            <div>
              <div className="comp-details-content-label ">
                Complaint Location
              </div>
              <div id="comp-details-location" className="comp-details-content">
                {location}
              </div>
            </div>
            <div>
              <div className="comp-details-content-label ">
                Location Description
              </div>
              <p id="comp-details-location-description">
                {locationDescription}
              </p>
            </div>
            <div>
              <div className="comp-details-content-label ">X Coordinate</div>
              <div
                className="comp-details-content comp-padding-right-25"
                id="call-details-x-coordinate-div"
              >
                {renderCoordinates(coordinates, Coordinates.Longitude)}
              </div>

              <div className="comp-details-content-label ">Y Coordinate</div>
              <div
                className="comp-details-content"
                id="call-details-y-coordinate-div"
              >
                {renderCoordinates(coordinates, Coordinates.Latitude)}
              </div>
            </div>
            <div>
              <span className="comp-details-content-label ">Community</span>
              <span
                id="comp-details-community"
                className="comp-details-content"
              >
                {area}
              </span>
            </div>
            <div>
              <span className="comp-details-content-label ">Office</span>
              <span id="comp-details-office" className="comp-details-content">
                {office}
              </span>
            </div>

            <div className="comp-complaint-section">
              <span className="comp-details-content-label ">Zone</span>
              <span id="comp-details-zone" className="comp-details-content">
                {zone}
              </span>
            </div>
            <div className="comp-complaint-section">
              <span className="comp-details-content-label ">Region</span>
              <span id="comp-details-region" className="comp-details-content">
                {region}
              </span>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
