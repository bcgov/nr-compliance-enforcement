import { InvestigationHeader } from "@/app/components/containers/investigations/details/investigation-header";
import { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { CaseFile, Investigation } from "@/generated/graphql";
import { Button } from "react-bootstrap";
import { openModal } from "@/app/store/reducers/app";
import { useAppDispatch } from "@/app/hooks/hooks";
import { ADD_PARTY } from "@/app/types/modal/modal-types";

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
  const dispatch = useAppDispatch();
  const { investigationGuid = "" } = useParams<InvestigationParams>();
  const { data, isLoading } = useGraphQLQuery<{
    getInvestigation: Investigation;
    caseFileByActivityId: CaseFile;
  }>(GET_INVESTIGATION, {
    queryKey: ["getInvestigation", investigationGuid],
    variables: { investigationGuid: investigationGuid },
    enabled: !!investigationGuid, // Only refresh query if id is provided
  });

  const handleAddParty = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: ADD_PARTY,
        data: {
          title: "Add party to investigation",
          description: "",
          investigationGuid: investigationGuid,
        },
      }),
    );
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
                      {caseIdentifier ? (
                        <p>
                          <Link to={`/case/${caseIdentifier}`}>{caseIdentifier}</Link>
                        </p>
                      ) : (
                        <p>N/A</p>
                      )}
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
                <div className="row">
                  <div className="col-12">
                    <strong>Parties:</strong>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleAddParty}
                    >
                      <i className="bi bi-plus-circle me-1" /> {/**/}
                      Add Party
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
