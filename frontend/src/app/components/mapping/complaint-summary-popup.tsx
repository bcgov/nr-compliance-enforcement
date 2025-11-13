import { FC } from "react";
import { selectComplaintDetails, selectComplaintHeader } from "@store/reducers/complaints";
import { useAppSelector } from "@hooks/hooks";
import { applyStatusClass, formatDate } from "@common/methods";
import { Badge, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { getUserAgency } from "@/app/service/user-service";

interface Props {
  complaint_identifier: string;
  complaintType: string;
}

export const ComplaintSummaryPopup: FC<Props> = ({ complaint_identifier, complaintType }) => {
  const navigate = useNavigate();
  const {
    officerAssigned,
    natureOfComplaint,
    species,
    violationType,
    loggedDate,
    status,
    girType,
    complaintAgency,
    type,
  } = useAppSelector(selectComplaintHeader(complaintType));

  const { violationInProgress, location, area, ownedBy, issueType } = useAppSelector((state) =>
    selectComplaintDetails(state, complaintType),
  );

  const agencyCodes = useAppSelector((state) => state.codeTables.agency);
  const agencyCode =
    agencyCodes?.find(({ agency }) => agency === complaintAgency)?.shortDescription ?? "Unknown Agency";
  const agencyName = agencyCodes?.find(({ agency }) => agency === complaintAgency)?.longDescription ?? "Unknown Agency";

  const inProgressInd = violationInProgress ? "In Progress" : "";

  const userAgency = getUserAgency();
  const derivedStatus = ownedBy !== userAgency && complaintType !== "SECTOR" ? "Referred" : status;

  return (
    <Popup
      keepInView={true}
      className="comp-map-popup"
    >
      <div className="ms-2 me-2">
        <div className="comp-map-popup-header mb-2 pt-2">
          <div className="comp-map-popup-header-title">
            {complaintType === "HWCR" && (
              <h2 className="mb-0">
                <span className="comp-box-species-type">{species}</span> • <span>{natureOfComplaint}</span>
              </h2>
            )}
            {complaintType === "ERS" && (
              <h2 className="mb-0">
                {violationType}
                {inProgressInd ? " • " + inProgressInd : ""}
              </h2>
            )}
            {complaintType === "GIR" && <h2 className="mb-0">{girType}</h2>}
            {complaintType === "SECTOR" && <h2 className="mb-0">{issueType}</h2>}
          </div>
          <div className="comp-map-popup-header-meta">
            <h3>{complaint_identifier}</h3>
            <Badge
              id="comp-details-status-text-id"
              className={`badge ${applyStatusClass(derivedStatus)}`}
            >
              {derivedStatus}
            </Badge>
          </div>
        </div>
        <div className="comp-map-popup-details">
          <dl>
            <div>
              <dt className="comp-summary-popup-details">
                <i className="bi bi-calendar-fill" /> Logged
              </dt>
              <dd>{formatDate(loggedDate, true)}</dd>
            </div>
            <div>
              <dt className="comp-summary-popup-details">
                <i className="bi bi-person-fill" /> Officer
              </dt>
              <dd id="comp-details-assigned-officer-name-text-id">
                {officerAssigned === "Not Assigned" && <i className="bi bi-exclamation-triangle-fill text-warning"></i>}{" "}
                <strong>
                  {officerAssigned}{" "}
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip
                        id="map-overlay-trigger"
                        className="comp-tooltip comp-tooltip-top"
                      >
                        {agencyName}
                      </Tooltip>
                    }
                  >
                    <span className="comp-tooltip-hint">({agencyCode})</span>
                  </OverlayTrigger>
                </strong>
              </dd>
            </div>
            <div>
              <dt className="comp-summary-popup-details">
                <i className="bi bi-geo-alt-fill" /> Location
              </dt>
              <dd className="comp-summary-popup-location">
                {location && (
                  <>
                    {location} <br></br>
                  </>
                )}
                {area && <em>{area}</em>}
              </dd>
            </div>
          </dl>
          <Button
            as="a"
            variant="outline-primary"
            size="sm"
            className="comp-map-popup-details-btn w-100"
            id="view-complaint-details-button-id"
            onClick={() => navigate(`/complaint/${type}/${complaint_identifier}`)}
          >
            View complaint details
          </Button>
        </div>
      </div>
    </Popup>
  );
};
