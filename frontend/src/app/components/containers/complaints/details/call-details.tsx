import { FC } from "react";
import { Badge, Card } from "react-bootstrap";
import { useAppSelector } from "../../../../hooks/hooks";
import { formatDate, formatTime, renderCoordinates } from "../../../../common/methods";
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
    coordinates,
    area,
    region,
    zone,
    office,
    attractants,
    violationInProgress,
    violationObserved,
    complaintMethodReceivedCode,
  } = useAppSelector(selectComplaintDetails(complaintType)) as ComplaintDetails;

  return (
    <section className="comp-details-section">
      <h3>Call Details</h3>

      <Card>
        <Card.Body>
          {/* General Call Information */}
          <dl className="comp-call-details-group">
            <div>
              <dt>Complaint Description</dt>
              <dd>
                <pre id="comp-details-description">{details}</pre>
              </dd>
            </div>
            <div>
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
            </div>

            {/* HWCR Details */}
            {complaintType === COMPLAINT_TYPES.HWCR && (
              <div>
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
              </div>
            )}

            {/* ERS Details */}
            {complaintType === COMPLAINT_TYPES.ERS && (
              <>
                <div>
                  <dt>Violation In Progress</dt>
                  <dd id="comp-details-violation-in-progress">{violationInProgress ? "Yes" : "No"}</dd>
                </div>
                <div>
                  <dt>Violation Observed</dt>
                  <dd
                    id="comp-details-violation-observed"
                    className="comp-details-content"
                  >
                    {violationObserved ? "Yes" : "No"}
                  </dd>
                </div>
              </>
            )}
          </dl>

          {/* Location Information */}
          <dl className="comp-call-details-group">
            <div>
              <dt>Complaint Location</dt>
              <dd id="comp-details-location">{location}</dd>
            </div>
            <div>
              <dt>Location Description</dt>
              <dd id="comp-details-location-description">{locationDescription}</dd>
            </div>
            <div>
              <dt>Latitude/Longitude</dt>
              <dd className="comp-lat-long">
                <span id="call-details-y-coordinate">{renderCoordinates(coordinates, Coordinates.Latitude)}</span>
                <span id="call-details-x-coordinate">{renderCoordinates(coordinates, Coordinates.Longitude)}</span>
              </dd>
            </div>
          </dl>

          {/* Other Location Details */}
          <dl className="comp-call-details-group">
            <div>
              <dt>Community</dt>
              <dd id="comp-details-community">{area}</dd>
            </div>
            <div>
              <dt>Office</dt>
              <dd id="comp-details-office">{office}</dd>
            </div>
            <div>
              <dt>Zone</dt>
              <dd id="comp-details-zone">{zone}</dd>
            </div>
            <div>
              <dt>Region</dt>
              <dd id="comp-details-region">{region}</dd>
            </div>
            <div>
              <dt>Method complaint was received</dt>
              <dd className="comp-method-complaint-received">
                <span id="call-method-complaint-received">{complaintMethodReceivedCode?.longDescription}</span>
              </dd>
            </div>
          </dl>
        </Card.Body>
      </Card>
    </section>
  );
};
