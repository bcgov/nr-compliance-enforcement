import { FC } from "react";
import { Badge, Card } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { formatDate, formatTime } from "@common/methods";
import { ComplaintDetailsAttractant } from "@apptypes/complaints/details/complaint-attactant";
import { selectComplaintDetails } from "@store/reducers/complaints";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import { CompLocationInfo } from "@components/common/comp-location-info";
import { usePark } from "@/app/hooks/usePark";
import { AgencyType } from "@/app/types/app/agency-types";

interface ComplaintHeaderProps {
  complaintOwner: string;
  complaintType: string;
}

export const CallDetails: FC<ComplaintHeaderProps> = ({ complaintOwner, complaintType }) => {
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
    parkGuid,
  } = useAppSelector((state) => selectComplaintDetails(state, complaintType));

  const park = usePark(parkGuid);
  const enableOfficeFeature = complaintOwner && complaintOwner !== AgencyType.CEEB;

  return (
    <section className="comp-details-section">
      <h3>Call details</h3>

      <Card>
        <Card.Body>
          {/* General Call Information */}
          <dl className="comp-call-details-group">
            <div>
              <dt>Complaint description</dt>
              <dd>
                <pre id="comp-details-description">{details}</pre>
              </dd>
            </div>
            <div>
              <dt>Incident date/time</dt>
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
                  <dt>Violation in progress</dt>
                  <dd id="comp-details-violation-in-progress">{violationInProgress ? "Yes" : "No"}</dd>
                </div>
                <div>
                  <dt>Violation observed</dt>
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
              <dt>Location/address</dt>
              <dd id="comp-details-location">{location}</dd>
            </div>
            <div>
              <dt>Location description</dt>
              <dd id="comp-details-location-description">{locationDescription}</dd>
            </div>
            <CompLocationInfo
              xCoordinate={coordinates?.[0] === 0 ? "" : coordinates?.[0].toString() ?? ""}
              yCoordinate={coordinates?.[1] === 0 ? "" : coordinates?.[1].toString() ?? ""}
            />
            <br />
          </dl>

          {/* Park Information */}
          <dl className="comp-call-details-group">
            <div>
              <dt>Park</dt>
              <dd id="comp-details-park">{park?.name}</dd>
            </div>
          </dl>

          {/* Other Location Details */}
          <dl className="comp-call-details-group">
            <div>
              <dt>Community</dt>
              <dd id="comp-details-community">{area}</dd>
            </div>
            {enableOfficeFeature && (
              <div>
                <dt>Office</dt>
                <dd id="comp-details-office">{office}</dd>
              </div>
            )}
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
              <dd id="comp-method-complaint-received">
                <span id="comp-method-complaint-received-span-id">{complaintMethodReceivedCode?.longDescription}</span>
              </dd>
            </div>
          </dl>
        </Card.Body>
      </Card>
    </section>
  );
};
