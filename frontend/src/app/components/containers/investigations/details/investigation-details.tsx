import { InvestigationHeader } from "@/app/components/containers/investigations/details/investigation-header";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { CaseFile, Investigation } from "@/generated/graphql";
import { InvestigationTabs } from "@/app/components/containers/investigations/details/investigation-navigation";
import InvestigationSummary from "@/app/components/containers/investigations/details/investigation-summary";
import InvestigationParties from "@/app/components/containers/investigations/details/investigation-parties";
import { InvestigationContraventions } from "@/app/components/containers/investigations/details/investigation-contravention";
import { InvestigationContinuation } from "@/app/components/containers/investigations/details/investigation-continuation";
import { InvestigationAdministration } from "@/app/components/containers/investigations/details/investigation-administration";
import { InvestigationDocumentation } from "@/app/components/containers/investigations/details/investigation-documentation";

const GET_INVESTIGATION = gql`
  query GetInvestigation($investigationGuid: String!) {
    getInvestigation(investigationGuid: $investigationGuid) {
      __typename
      investigationGuid
      name
      description
      openedTimestamp
      createdByAppUserGuid
      investigationStatus {
        investigationStatusCode
        shortDescription
        longDescription
      }
      parties {
        partyIdentifier
        person {
          firstName
          lastName
          personGuid
        }
        business {
          name
          businessGuid
        }
        partyAssociationRole
      }
      contraventions {
        contraventionIdentifier
        legislationIdentifierRef
        investigationParty {
          partyIdentifier
          person {
            firstName
            lastName
          }
          business {
            name
          }
        }
      }
      leadAgency
      locationAddress
      locationDescription
      locationGeometry
      primaryInvestigatorGuid
      supervisorGuid
      fileCoordinatorGuid
      discoveryDate
    }
    caseFilesByActivityIds(activityIdentifiers: [$investigationGuid]) {
      caseIdentifier
      name
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
    caseFilesByActivityIds: CaseFile[];
  }>(GET_INVESTIGATION, {
    queryKey: ["getInvestigation", investigationGuid],
    variables: { investigationGuid: investigationGuid },
    enabled: !!investigationGuid, // Only refresh query if id is provided
  });

  const investigationData = data?.getInvestigation;
  const caseIdentifier = data?.caseFilesByActivityIds?.[0]?.caseIdentifier;
  const caseName = data?.caseFilesByActivityIds?.[0]?.name;

  const renderTabContent = () => {
    switch (currentTab) {
      case "summary":
        return (
          <InvestigationSummary
            investigationData={investigationData}
            investigationGuid={investigationGuid}
            caseGuid={caseIdentifier ?? ""}
            caseName={caseName ?? ""}
          />
        );
      case "parties":
        return (
          <InvestigationParties
            investigationData={investigationData}
            investigationGuid={investigationGuid}
          />
        );
      case "contraventions":
        return (
          <InvestigationContraventions
            investigationData={investigationData}
            investigationGuid={investigationGuid}
          />
        );
      case "documents":
        return <InvestigationDocumentation />;
      case "continuation":
        return <InvestigationContinuation investigationData={investigationData} />;
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
            <p>Loading investigation details...</p>
          </div>
        </section>
      </div>
    );
  }

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
