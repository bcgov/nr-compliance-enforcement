import { InvestigationHeader } from "@/app/components/containers/investigations/details/investigation-header";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { CaseFile, Investigation } from "@/generated/graphql";
import { InvestigationTabs } from "@/app/components/containers/investigations/details/investigation-navigation";
import InvestigationSummary from "@/app/components/containers/investigations/details/investigation-summary";
import InvestigationRecords from "@/app/components/containers/investigations/details/investigation-records";
import { InvestigationContraventions } from "@/app/components/containers/investigations/details/investigation-contraventions";
import { InvestigationContinuation } from "@/app/components/containers/investigations/details/investigation-continuation";
import { InvestigationAdministration } from "@/app/components/containers/investigations/details/investigation-administration";
import { InvestigationDocumentation } from "@/app/components/containers/investigations/details/investigation-documentation";

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
      parties {
        person {
          firstName
          lastName
          personGuid
        }
        business {
          name
          businessGuid
        }
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
  tabKey: string;
};

export const InvestigationDetails: FC = () => {
  const { investigationGuid = "", tabKey } = useParams<InvestigationParams>();
  const currentTab = tabKey || "summary";
  const { data, isLoading } = useGraphQLQuery<{
    getInvestigation: Investigation;
    caseFileByActivityId: CaseFile;
  }>(GET_INVESTIGATION, {
    queryKey: ["getInvestigation", investigationGuid],
    variables: { investigationGuid: investigationGuid },
    enabled: !!investigationGuid, // Only refresh query if id is provided
  });

  const renderTabContent = () => {
    switch (currentTab) {
      case "summary":
        return (
          <InvestigationSummary
            investigationData={investigationData}
            investigationGuid={investigationGuid}
            caseGuid={caseIdentifier ?? ""}
          />
        );
      case "records":
        return (
          <InvestigationRecords
            investigationData={investigationData}
            investigationGuid={investigationGuid}
          />
        );
      case "contraventions":
        return <InvestigationContraventions />;
      case "documents":
        return <InvestigationDocumentation />;
      case "continuation":
        return <InvestigationContinuation />;
      case "admin":
        return <InvestigationAdministration />;
    }
  };

  if (isLoading) {
    return (
      <div className="comp-complaint-details">
        <InvestigationHeader />
        <section className="comp-details-body comp-container">
          <div className="comp-details-content">
            <p>Loading investigation details... </p>
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
        <InvestigationTabs />
        {renderTabContent()}
      </section>
    </div>
  );
};
