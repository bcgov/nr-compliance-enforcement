import { FC } from "react";
import { Row, Col } from "react-bootstrap";
import { useAppSelector } from "../../../../hooks/hooks";
import {
  formatDate,
  formatTime,
  renderCoordinates
} from "../../../../common/methods";
import { Coordinates } from "../../../../types/app/coordinate-type";
import { ComplaintDetailsAttractant } from "../../../../types/complaints/details/complaint-attactant";
import { selectComplaintDeails } from "../../../../store/reducers/complaints";
import COMPLAINT_TYPES from "../../../../types/app/complaint-types";
import { ComplaintDetails } from "../../../../types/complaints/details/complaint-details";

interface ComplaintHeaderProps {
  complaintType: string;
}

export const CallDetails: FC<ComplaintHeaderProps> = ({
  complaintType,
}) => {
  const {
    details,
    location,
    locationDescription,
    incidentDateTime,
    coordinates,
    area,
    region,
    zone,
    office,
    attractants,
    violationInProgress,
    violationObserved,
  } = useAppSelector(selectComplaintDeails(complaintType)) as ComplaintDetails;

  return (
    <div className="comp-complaint-details-block">
      <h6>Call Details</h6>
      { /* readonly call details section */}
        <div className="comp-complaint-call-details">
          <Row>
            <Col md="6" className="comp-padding-right-28">
              <div>
                <div className="comp-details-content-label">
                  Complaint Description
                </div>
                <p>{details}</p>
              </div>
              <div>
                <div className="comp-details-content-label ">Incident Time</div>
                <div className="comp-details-content">
                  <i className="bi bi-calendar comp-margin-right-xxs"></i>
                  {formatDate(incidentDateTime)}
                  <i className="bi bi-clock comp-margin-left-xxs comp-margin-right-xxs"></i>
                  {formatTime(incidentDateTime)}
                </div>
              </div>

              {complaintType === COMPLAINT_TYPES.HWCR && (
                <div>
                  <div className="comp-details-content-label ">
                    Attractants
                  </div>
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
                        }
                      )}
                  </span>
                </div>
              )}

              {complaintType === COMPLAINT_TYPES.ERS && (
                <>
                  <div>
                    <span className="comp-details-content-label ">
                      Violation In Progress
                    </span>
                    <span className="comp-details-content">
                      {violationInProgress ? "Yes" : "No"}
                    </span>
                  </div>
                  <div>
                    <span className="comp-details-content-label ">
                      Violation Observed
                    </span>
                    <span className="comp-details-content">
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
                <div className="comp-details-content">{location}</div>
              </div>
              <div>
                <div className="comp-details-content-label ">
                  Location Description
                </div>
                <p>{locationDescription}</p>
            </div>
            <div>
              <div className="comp-details-content-label ">X Coordinate</div>
              <div className="comp-details-content comp-padding-right-25" id="call-details-x-coordinate-div">
                {renderCoordinates(coordinates, Coordinates.Longitude)}
              </div>

              <div className="comp-details-content-label ">Y Coordinate</div>
              <div className="comp-details-content" id="call-details-y-coordinate-div">
                {renderCoordinates(coordinates, Coordinates.Latitude)}
              </div>
            </div>
            <div>
              <span className="comp-details-content-label ">Community</span>
              <span className="comp-details-content">{area}</span>
            </div>
            <div>
              <span className="comp-details-content-label ">Office</span>
              <span className="comp-details-content">{office}</span>
            </div>

            <div className="comp-complaint-section">
              <span className="comp-details-content-label ">Zone</span>
              <span className="comp-details-content">{zone}</span>
            </div>
            <div className="comp-complaint-section">
              <span className="comp-details-content-label ">Region</span>
              <span className="comp-details-content">{region}</span>
            </div>
            </Col>
          </Row>
        </div>

    </div>
  );
};
