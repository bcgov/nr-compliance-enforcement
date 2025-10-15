import { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { CaseFile, Inspection } from "@/generated/graphql";
import { InspectionHeader } from "@/app/components/containers/instpections/details/inspection-header";

const GET_INSPECTION = gql`
  query GetInspection($inspectionGuid: String!) {
    getInspection(inspectionGuid: $inspectionGuid) {
      __typename
      inspectionGuid
      name
      description
      openedTimestamp
      inspectionStatus {
        inspectionStatusCode
        shortDescription
        longDescription
      }
      leadAgency
    }
    caseFileByActivityId(activityIdentifier: $inspectionGuid) {
      caseIdentifier
      name
    }
  }
`;

export type InspectionParams = {
  inspectionGuid: string;
};

export const InspectionDetails: FC = () => {
  const { inspectionGuid = "" } = useParams<InspectionParams>();
  const { data, isLoading } = useGraphQLQuery<{
    getInspection: Inspection;
    caseFileByActivityId: CaseFile;
  }>(GET_INSPECTION, {
    queryKey: ["getInspection", inspectionGuid],
    variables: { inspectionGuid: inspectionGuid },
    enabled: !!inspectionGuid, // Only refresh query if id is provided
  });

  const inspectionData = data?.getInspection;
  const caseIdentifier = data?.caseFileByActivityId?.caseIdentifier;
  const caseName = data?.caseFileByActivityId?.name;

  if (isLoading) {
    return (
      <div className="comp-complaint-details">
        <InspectionHeader />
        <section className="comp-details-body comp-container">
          <div className="comp-details-content">
            <p>Loading inspection details...</p>
          </div>
        </section>
      </div>
    );
  }
  return (
    <div className="comp-complaint-details">
      <InspectionHeader inspection={inspectionData} />

      <section className="comp-details-body comp-container">
        <hr className="comp-details-body-spacer"></hr>

        <div className="comp-details-section-header">
          <h2>Inspection details</h2>
        </div>

        {/* Inspection Details (View) */}
        <div className="comp-details-view">
          <div className="comp-details-content">
            <h3>Inspection Information</h3>
            {!inspectionData && <p>No data found for ID: {inspectionGuid}</p>}
            {inspectionData && (
              <div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Inspection Identifier:</strong>
                      <p>{inspectionData.inspectionGuid || "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Case ID:</strong>
                      <p>{caseIdentifier ? <Link to={`/case/${caseIdentifier}`}>{caseName || caseIdentifier}</Link> : <p>N/A</p>}</p>
                    </div>
                  </div>
                </div>
                {inspectionData.description && (
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <strong>Description:</strong>
                        <p>{inspectionData.description}</p>
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
