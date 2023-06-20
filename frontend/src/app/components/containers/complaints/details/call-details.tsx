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
    <div className="comp-complaint-details-block">
      <h6>Call Details</h6>
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
                    }
                  )}
              </span>
            </div>
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
              <div className="comp-details-content comp-padding-right-25">
                {parseCoordinates(coordinates, Coordinates.Latitude)}
              </div>

              <div className="comp-details-content-label ">Y Coordinate</div>
              <div className="comp-details-content">
                {parseCoordinates(coordinates, Coordinates.Longitude)}
              </div>
            </div>
            <div>
              <span className="comp-details-content-label ">
                Area / Community
              </span>
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
