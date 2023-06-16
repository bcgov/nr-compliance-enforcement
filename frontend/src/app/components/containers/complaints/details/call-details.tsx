import { FC } from "react";
import { Row, Col } from "react-bootstrap";
import { useAppSelector } from "../../../../hooks/hooks";
import { selectComplaintDetails } from "../../../../store/reducers/hwcr-complaints";
import {
  formatDate,
  formatTime,
  parseCoordinates,
} from "../../../../common/methods";
import { Coordinates } from "../../../../types/app/coordinate-type";
import { ComplaintDetailsAttractant } from "../../../../types/complaints/details/complaint-attactant";

export const CallDetails: FC = () => {
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
  } = useAppSelector(selectComplaintDetails);

  return (
    <div className="comp-complaint-call-details-container">
      <h6>Call Details</h6>
      <div className="comp-complaint-call-details">
        <Row>
          <Col md="6" style={{ paddingRight: "28px" }}>
            <div className="comp-complaint-label">Complaint Description</div>
            <p>{details}</p>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Incident Time</span>
              <span className="comp-complaint-incident-time">
                <i className="bi bi-calendar"></i>
                {formatDate(incidentDateTime)}
                <i className="bi bi-clock"></i>
                {formatTime(incidentDateTime)}
              </span>
            </div>

            <div>
              <span className="comp-complaint-label">Attractants</span>
              <span className="comp-complaint-attactants">
                {!attractants ||
                  attractants.map(
                    ({ key, description }: ComplaintDetailsAttractant) => {
                      return (
                        <span className="badge comp-attactant-badge" key={key}>
                          {description}
                        </span>
                      );
                    }
                  )}
              </span>
            </div>
          </Col>
          <Col md="6" style={{ paddingLeft: "28px" }}>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Complaint Location</span>
              <span className="comp-complaint-incident-time">{location}</span>
            </div>
            <div className="comp-complaint-label">Location Description</div>
            <p>{locationDescription}</p>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">X Coordinate</span>
              <span className="comp-complaint-incident-time">
                {parseCoordinates(coordinates, Coordinates.Latitude)}
              </span>
              <span className="comp-complaint-label">Y Coordinate</span>
              <span className="comp-complaint-incident-time">
                {parseCoordinates(coordinates, Coordinates.Longitude)}
              </span>
            </div>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Area / Community</span>
              <span className="comp-complaint-incident-time">{area}</span>
            </div>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Office</span>
              <span className="comp-complaint-incident-time">{office}</span>
            </div>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Zone</span>
              <span className="comp-complaint-incident-time">{zone}</span>
            </div>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Region</span>
              <span className="comp-complaint-incident-time">{region}</span>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
