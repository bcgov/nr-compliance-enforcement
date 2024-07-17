import { FC } from "react";
import { Badge, Card, Col, Row } from "react-bootstrap";
import { useAppSelector } from "../../../../hooks/hooks";
import { formatDate, formatTime, renderCoordinates } from "../../../../common/methods";
import { Coordinates } from "../../../../types/app/coordinate-type";
import { ComplaintDetailsAttractant } from "../../../../types/complaints/details/complaint-attactant";
import { selectComplaintDetails } from "../../../../store/reducers/complaints";
import COMPLAINT_TYPES from "../../../../types/app/complaint-types";
import { ComplaintDetails } from "../../../../types/complaints/details/complaint-details";
import { render } from "react-dom";

interface ComplaintHeaderProps {
  complaintType: string;
}

export const CallDetails: FC<ComplaintHeaderProps> = ({ complaintType }) => {
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
  } = useAppSelector(selectComplaintDetails(complaintType)) as ComplaintDetails;

  return (
    <section className="comp-details-section">
      <Card>
        <Card.Body>
          <Card.Title as="h3">Call Details</Card.Title>

          {/* General Call Information */}
          <Row
            as="dl"
            className="comp-call-details-group"
          >
            <Col xs={12}>
              <dt>Complaint Description</dt>
              <dd>
                <pre id="comp-details-description">{details}</pre>
              </dd>
            </Col>
            <Col xs={6}>
              <dt>Incident Date/Time</dt>
              <dd
                className="comp-date-time-value"
                id="complaint-incident-date-time"
              >
                <i
                  className="bi bi-calendar comp-margin-right-xxs"
                  id="complaint-incident-date"
                ></i>
                {formatDate(incidentDateTime?.toString())}
                <i className="bi bi-clock comp-margin-left-xxs comp-margin-right-xxs"></i>
                {formatTime(incidentDateTime?.toString())}
              </dd>
            </Col>

            {/* HWCR Details */}
            {complaintType === COMPLAINT_TYPES.HWCR && (
              <Col xs={6}>
                <dt>Attractants</dt>
                <dd className="comp-details-attractants">
                  {!attractants ||
                    attractants.map(({ key, description }: ComplaintDetailsAttractant) => {
                      return (
                        <Badge
                          color="light"
                          text="dark"
                          className="comp-attractant-badge"
                          key={key}
                        >
                          {description}
                        </Badge>
                      );
                    })}
                </dd>
              </Col>
            )}

            {/* ERS Details */}
            {complaintType === COMPLAINT_TYPES.ERS && (
              <Row>
                <Col
                  xs={12}
                  md={6}
                >
                  <dt>Violation In Progress</dt>
                  <dd id="comp-details-violation-in-progress">{violationInProgress ? "Yes" : "No"}</dd>
                </Col>
                <Col
                  xs={12}
                  md={6}
                >
                  <dt>Violation Observed</dt>
                  <dd
                    id="comp-details-violation-observed"
                    className="comp-details-content"
                  >
                    {violationObserved ? "Yes" : "No"}
                  </dd>
                </Col>
              </Row>
            )}

            {/* Location Information */}
            <>
              <Col
                xs={12}
                md={6}
              >
                <dt>Complaint Location</dt>
                <dd id="comp-details-location">{location}</dd>
              </Col>
              <Col
                xs={12}
                md={6}
              >
                <dt>Latitude/Longitude</dt>
                <dd className="comp-lat-long">
                  <span id="call-details-y-coordinate">{renderCoordinates(coordinates, Coordinates.Latitude)}</span>
                  <span id="call-details-x-coordinate">{renderCoordinates(coordinates, Coordinates.Longitude)}</span>
                </dd>
              </Col>
              {locationDescription && (
                <Col xs={12}>
                  <dt>Location Description</dt>
                  <dd id="comp-details-location-description">{locationDescription}</dd>
                </Col>
              )}
            </>

            {/* Other Location Details */}
            <>
              <Col
                xs={12}
                md={6}
              >
                <dt>Community</dt>
                <dd id="comp-details-community">{area}</dd>
              </Col>
              <Col
                xs={12}
                md={6}
              >
                <dt>Office</dt>
                <dd id="comp-details-office">{office}</dd>
              </Col>
              <Col
                xs={12}
                md={6}
              >
                <dt>Zone</dt>
                <dd id="comp-details-zone">{zone}</dd>
              </Col>
              <Col
                xs={12}
                md={6}
              >
                <dt>Region</dt>
                <dd id="comp-details-region">{region}</dd>
              </Col>
            </>
          </Row>
        </Card.Body>
      </Card>
    </section>
  );
};
