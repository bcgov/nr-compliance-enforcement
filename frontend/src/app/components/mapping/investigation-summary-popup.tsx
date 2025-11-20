import { FC } from "react";
import { Popup } from "react-leaflet";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@graphql/hooks";
import { formatDate } from "@common/methods";
import { Investigation } from "@/generated/graphql";
import { Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { applyStatusClass } from "@common/methods";

const GET_INVESTIGATION_POPUP = gql`
  query GetInvestigationForPopup($investigationGuid: String!) {
    getInvestigation(investigationGuid: $investigationGuid) {
      investigationGuid
      name
      openedTimestamp
      leadAgency
      locationAddress
      locationAddress
      leadAgency
      locationDescription
      investigationStatus {
        shortDescription
        investigationStatusCode
      }
    }
  }
`;

type Props = {
  investigationGuid: string;
};

export const InvestigationSummaryPopup: FC<Props> = ({ investigationGuid }) => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGraphQLQuery<{ getInvestigation: Investigation }>(GET_INVESTIGATION_POPUP, {
    queryKey: ["getInvestigationPopup", investigationGuid],
    variables: { investigationGuid },
    enabled: Boolean(investigationGuid),
  });

  const investigation = data?.getInvestigation;
  const status = investigation?.investigationStatus?.shortDescription ?? "Unknown";
  const openedDate = investigation?.openedTimestamp ? formatDate(investigation.openedTimestamp, true) : "Unknown";
  const community = investigation?.locationAddress ?? "Unknown";
  const leadAgency = investigation?.leadAgency ?? "Unknown agency";
  const name = investigation?.name ?? investigationGuid;
  const officerAssigned = "Not Assigned"; // This will be the officer assigned to the investigation once that is implimented

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
          {isLoading && <div className="text-muted small">Loading investigation...</div>}
          {error && <div className="text-danger small">Unable to load investigation.</div>}
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
                  <dd>{community}</dd>
                </div>
              </dl>
              <Button
                as="a"
                variant="outline-primary"
                size="sm"
                className="comp-map-popup-details-btn w-100"
                onClick={() => navigate(`/investigation/${investigationGuid}`)}
              >
                View investigation details
              </Button>
            </>
          )}
        </div>
      </div>
    </Popup>
  );
};

export default InvestigationSummaryPopup;
