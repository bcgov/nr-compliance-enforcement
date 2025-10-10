import { InvestigationHeader } from "@/app/components/containers/investigations/details/investigation-header";
import { FC } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { CaseFile, Investigation } from "@/generated/graphql";
import { CompLocationInfo } from "@/app/components/common/comp-location-info";
import Button from "react-bootstrap/esm/Button";
import { InvestigationLocation } from "./investigation-location";

const GET_INVESTIGATION = gql`
  query GetInvestigation($investigationGuid: String!) {
    getInvestigation(investigationGuid: $investigationGuid) {
      __typename
      investigationGuid
      description
      openedTimestamp
      investigationStatus {
        investigationStatusCode
        shortDescription
        longDescription
      }
      leadAgency
      locationGeometry
    }
    caseFileByActivityId(activityType: "INVSTGTN", activityIdentifier: $investigationGuid) {
      caseIdentifier
    }
  }
`;

export type InvestigationParams = {
  investigationGuid: string;
};

export const InvestigationDetails: FC = () => {
  const navigate = useNavigate();


  const { investigationGuid = "" } = useParams<InvestigationParams>();
  const { data, isLoading } = useGraphQLQuery<{
    getInvestigation: Investigation;
    caseFileByActivityId: CaseFile;
  }>(GET_INVESTIGATION, {
    queryKey: ["getInvestigation", investigationGuid],
    variables: { investigationGuid: investigationGuid },
    enabled: !!investigationGuid, // Only refresh query if id is provided
  });
  const editButtonClick = () => {
    navigate(`/investigation/${investigationData?.investigationGuid}/edit`);
  };

  if (isLoading) {
    return (
      <div className="comp-complaint-details">
        <InvestigationHeader />
        <section className="comp-details-body comp-container">
          <div className="comp-details-content">
            <p>Loading investigation details...</p>
          </div>
        </section>
      </div>
    );
  }

  const investigationData = data?.getInvestigation;
  const caseIdentifier = data?.caseFileByActivityId?.caseIdentifier;
  return (
    <div className="comp-complaint-details">
      <InvestigationHeader investigation={investigationData} />

      <section className="comp-details-body comp-container">
        <hr className="comp-details-body-spacer"></hr>

        <div className="comp-details-section-header">
          <h2>Investigation details</h2>
          <div className="comp-details-section-header-actions mb-0 pb-0">
            <Button
              variant="outline-primary"
              size="sm"
              id="details-screen-edit-button"
              onClick={editButtonClick}
            >
              <i className="bi bi-pencil"></i>
              <span>Edit Investigation</span>
            </Button>
          </div>
        </div>


        {/* Investigation Details (View) */}
        <div className="comp-details-view">
          <div className="comp-details-content">
            <h3>Investigation Information</h3>
            {!investigationData && <p>No data found for ID: {investigationGuid}</p>}
            {investigationData && (
              <div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Investigation Identifier:</strong>
                      <p>{investigationData.investigationGuid || "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Case Identifier:</strong>
                      {caseIdentifier ? <Link to={`/case/${caseIdentifier}`}>{caseIdentifier}</Link> : <p>N/A</p>}
                    </div>
                  </div>
                </div>
                {investigationData.description && (
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <strong>Description:</strong>
                        <p>{investigationData.description}</p>
                      </div>
                    </div>
                  </div>
                )}
                {investigationData.locationGeometry && (
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <CompLocationInfo
                          xCoordinate={investigationData.locationGeometry.coordinates?.[0] === 0 ? "" : investigationData.locationGeometry.coordinates?.[0].toString() ?? ""}
                          yCoordinate={investigationData.locationGeometry.coordinates?.[1] === 0 ? "" : investigationData.locationGeometry.coordinates?.[1].toString() ?? ""}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {investigationData?.locationGeometry?.coordinates && (
            <InvestigationLocation
              locationCoordinates={{
                lat: investigationData.locationGeometry.coordinates[1],
                lng: investigationData.locationGeometry.coordinates[0],
              }}
              draggable={false}
            />
          )}
        </div>
      </section>
    </div>
  );
};
