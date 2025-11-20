import { FC } from "react";
import { Popup } from "react-leaflet";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@graphql/hooks";
import { formatDate, applyStatusClass } from "@common/methods";
import { Inspection } from "@/generated/graphql";
import { Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const GET_INSPECTION_POPUP = gql`
  query GetInspectionForPopup($inspectionGuid: String!) {
    getInspection(inspectionGuid: $inspectionGuid) {
      inspectionGuid
      name
      openedTimestamp
      leadAgency
      locationAddress
      inspectionStatus {
        shortDescription
        inspectionStatusCode
      }
    }
  }
`;

type Props = {
  inspectionGuid: string;
};

export const InspectionSummaryPopup: FC<Props> = ({ inspectionGuid }) => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGraphQLQuery<{ getInspection: Inspection }>(GET_INSPECTION_POPUP, {
    queryKey: ["getInspectionPopup", inspectionGuid],
    variables: { inspectionGuid },
    enabled: Boolean(inspectionGuid),
  });

  const inspection = data?.getInspection;
  const name = inspection?.name ?? "Inspection";
  const status = inspection?.inspectionStatus?.shortDescription ?? "Unknown";
  const openedDate = inspection?.openedTimestamp ? formatDate(inspection.openedTimestamp, true) : "Unknown";
  const location = inspection?.locationAddress ?? "Unknown";
  const leadAgency = inspection?.leadAgency ?? "Unknown agency";
  const officerAssigned = "Not Assigned";

  return (
    <Popup
      keepInView
      className="comp-map-popup"
    >
      <div className="ms-2 me-2">
        <div className="comp-map-popup-header mb-2 pt-2">
          <div className="comp-map-popup-header-title">
            <h2 className="mb-0 text-start">{name}</h2>
          </div>
          <div className="comp-map-popup-header-meta">
            <Badge className={`badge ${applyStatusClass(status)}`}>{status}</Badge>
          </div>
        </div>
        <div className="comp-map-popup-details">
          {isLoading && <div className="text-muted small">Loading inspection...</div>}
          {error && <div className="text-danger small">Unable to load inspection.</div>}
          {!isLoading && !error && (
            <>
              <dl>
                <div>
                  <dt className="comp-summary-popup-details">
                    <i className="bi bi-calendar-fill" /> Logged
                  </dt>
                  <dd>{openedDate}</dd>
                </div>
                <div>
                  <dt className="comp-summary-popup-details">
                    <i className="bi bi-person-fill" /> Officer
                  </dt>
                  <dd>
                    {officerAssigned === "Not Assigned" && (
                      <i className="bi bi-exclamation-triangle-fill text-warning"></i>
                    )}{" "}
                    <strong>
                      {officerAssigned} <span className="comp-tooltip-hint">({leadAgency})</span>
                    </strong>
                  </dd>
                </div>
                <div>
                  <dt className="comp-summary-popup-details">
                    <i className="bi bi-geo-alt-fill" /> Location
                  </dt>
                  <dd>{location}</dd>
                </div>
              </dl>
              <Button
                as="a"
                variant="outline-primary"
                size="sm"
                className="comp-map-popup-details-btn w-100"
                onClick={() => navigate(`/inspection/${inspectionGuid}`)}
              >
                View inspection details
              </Button>
            </>
          )}
        </div>
      </div>
    </Popup>
  );
};

export default InspectionSummaryPopup;
