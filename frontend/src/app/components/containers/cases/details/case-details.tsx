import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CaseHeader } from "./case-header";
import { useGraphQLQuery } from "@graphql/hooks";
import { gql } from "graphql-request";
import { GetCaseMomsSpaghetttiFileQuery, GetCaseMomsSpaghetttiFileQueryVariables } from "@/generated/graphql";

const GET_CASE_FILE = gql`
  query GetCaseMomsSpaghetttiFile($caseFileGuid: String!) {
    caseMomsSpaghettiFile(caseFileGuid: $caseFileGuid) {
      __typename
      caseIdentifier
      caseOpenedTimestamp
      caseStatus {
        caseStatusCode
        shortDescription
        longDescription
      }
      leadAgency {
        agencyCode
        shortDescription
        longDescription
      }
      caseActivities {
        __typename
      }
    }
  }
`;

export type CaseParams = {
  id: string;
};

export const CaseDetails: FC = () => {
  const { id = "" } = useParams<CaseParams>();
  const { data, isLoading } = useGraphQLQuery<
    GetCaseMomsSpaghetttiFileQuery,
    Error,
    GetCaseMomsSpaghetttiFileQueryVariables
  >(GET_CASE_FILE, {
    queryKey: ["caseMomsSpaghettiFile", id],
    variables: { caseFileGuid: id },
    enabled: !!id, // Only refresh query if id is provided
  });

  if (isLoading) {
    return (
      <div className="comp-complaint-details">
        <CaseHeader caseId={id} />
        <section className="comp-details-body comp-container">
          <div className="comp-details-content">
            <p>Loading case details...</p>
          </div>
        </section>
      </div>
    );
  }

  const caseFile = data?.caseMomsSpaghettiFile;

  return (
    <div className="comp-complaint-details">
      <CaseHeader caseId={id} />

      <section className="comp-details-body comp-container">
        <hr className="comp-details-body-spacer"></hr>

        <div className="comp-details-section-header">
          <h2>Case details</h2>
        </div>

        {/* Case Details (View) */}
        <div className="comp-details-view">
          <div className="comp-details-content">
            <h3>Case Information</h3>

            {caseFile ? (
              <div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Case Identifier:</label>
                      <p>{caseFile.caseIdentifier || "N/A"}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Case Opened:</label>
                      <p>
                        {caseFile.caseOpenedTimestamp
                          ? new Date(caseFile.caseOpenedTimestamp).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Case Status:</label>
                      <p>{caseFile.caseStatus?.shortDescription || "N/A"}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Lead Agency:</label>
                      <p>{caseFile.leadAgency?.shortDescription || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {caseFile.caseActivities && caseFile.caseActivities.length > 0 && (
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label>Case Activities:</label>
                        <p>{caseFile.caseActivities.length} activities found</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p>No case data found for ID: {id}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
