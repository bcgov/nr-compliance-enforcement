import { FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { CaseHeader } from "./case-header";
import { useGraphQLQuery } from "@graphql/hooks";
import { gql } from "graphql-request";
import { CaseMomsSpaghettiFile } from "@/generated/graphql";

const GET_CASE_FILE = gql`
  query GetCaseMomsSpaghetttiFile($caseIdentifier: String!) {
    caseMomsSpaghettiFile(caseIdentifier: $caseIdentifier) {
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

export const CaseView: FC = () => {
  const { id = "" } = useParams<CaseParams>();
  const navigate = useNavigate();

  const { data, isLoading } = useGraphQLQuery<{ caseMomsSpaghettiFile: CaseMomsSpaghettiFile }>(GET_CASE_FILE, {
    queryKey: ["caseMomsSpaghettiFile", id],
    variables: { caseIdentifier: id },
    enabled: !!id, // Only refresh query if id is provided
  });

  const editButtonClick = () => {
    navigate(`/case/${id}/edit`);
  };

  if (isLoading) {
    return (
      <div className="comp-complaint-details">
        <CaseHeader />
        <section className="comp-details-body comp-container">
          <div className="comp-details-content">
            <p>Loading case details...</p>
          </div>
        </section>
      </div>
    );
  }

  const caseData = data?.caseMomsSpaghettiFile;

  return (
    <div className="comp-complaint-details">
      <CaseHeader caseData={caseData || undefined} />

      <section className="comp-details-body comp-container">
        <hr className="comp-details-body-spacer"></hr>

        <div className="comp-details-section-header">
          <h2>Case details</h2>
          <div className="comp-details-section-header-actions">
            <Button
              variant="outline-primary"
              size="sm"
              id="details-screen-edit-button"
              onClick={editButtonClick}
            >
              <i className="bi bi-pencil"></i>
              <span>Edit case</span>
            </Button>
          </div>
        </div>

        {/* Case Details (View) */}
        <div className="comp-details-view">
          <div className="comp-details-content">
            <h3>Case Information</h3>
            {!caseData && <p>No data found for ID: {id}</p>}
            {caseData && (
              <div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <p>Case Identifier:</p>
                      <p>{caseData.caseIdentifier || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {caseData.caseActivities && (
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <p>Case Activities:</p>
                        <p>{caseData.caseActivities.length} activities found</p>
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
