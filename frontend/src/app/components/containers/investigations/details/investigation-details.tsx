import { InvestigationHeader } from "@/app/components/containers/investigations/details/investigation-header";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { Investigation } from "@/generated/graphql";

const GET_INVESTIGATION = gql`
  query GetInvestigation($investigationGuid: String!) {
    getInvestigation(investigationGuid: $investigationGuid) {
      __typename
      investigationGuid
      investigationDescription
      investigationStartedTimestamp
      investigationStatus {
        investigationStatusCode
        shortDescription
        longDescription
      }
      leadAgency
    }
  }
`;

export type InvestigationParams = {
  investigationGuid: string;
};

export const InvestigationDetails: FC = () => {
  const { investigationGuid = "" } = useParams<InvestigationParams>();
  const { data, isLoading } = useGraphQLQuery<{ getInvestigation: Investigation }>(GET_INVESTIGATION, {
    queryKey: ["getInvestigation", investigationGuid],
    variables: { investigationGuid: investigationGuid },
    enabled: !!investigationGuid, // Only refresh query if id is provided
  });

  if (isLoading) {
    return (
      <div className="comp-complaint-details">
        <InvestigationHeader investigationGuid={investigationGuid} />
        <section className="comp-details-body comp-container">
          <div className="comp-details-content">
            <p>Loading investigation details...</p>
          </div>
        </section>
      </div>
    );
  }

  const investigationData = data?.getInvestigation;

  return (
    <div className="comp-complaint-details">
      <InvestigationHeader investigationGuid={investigationGuid} />

      <section className="comp-details-body comp-container">
        <hr className="comp-details-body-spacer"></hr>

        <div className="comp-details-section-header">
          <h2>Investigation details</h2>
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

                {investigationData.investigationDescription && (
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <strong>Description:</strong>
                        <p>{investigationData.investigationDescription}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
