import { InvestigationHeader } from "@/app/components/containers/investigations/details/investigation-header";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { gql } from "graphql-request";

const GET_CASE_FILE = gql`
  query GetInvestigation($investigationGuid: String!) {
    investigation(investigationGuid: $investigationGuid) {
      __typename
      investigationGuid
      investigationOpenedTimestamp
      investigationStatus {
        investigationStatusCode
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

export type InvestigationParams = {
  id: string;
};

export const InvestigationDetails: FC = () => {
  const { id = "" } = useParams<InvestigationParams>();

  return (
    <div className="comp-complaint-details">
      <InvestigationHeader investigationId={id} />
      Investigation!
    </div>
  );
};
