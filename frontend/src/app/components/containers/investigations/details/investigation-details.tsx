import { InvestigationHeader } from "@/app/components/containers/investigations/details/investigation-header";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { CaseFile, Investigation, Task } from "@/generated/graphql";
import InvestigationParties from "@/app/components/containers/investigations/details/investigation-parties";
import { InvestigationContraventions } from "@/app/components/containers/investigations/details/investigation-contravention";
import { InvestigationContinuation } from "@/app/components/containers/investigations/details/investigation-continuation";
import { InvestigationAdministration } from "@/app/components/containers/investigations/details/investigation-administration";
import { InvestigationDocumentation } from "@/app/components/containers/investigations/details/investigation-documentation";
import { InvestigationExhibits } from "@/app/components/containers/investigations/details/investigation-exhibits";
import { InvestigationTasksNew } from "@/app/components/containers/investigations/details/investigation-task";
import InvestigationSummary from "@/app/components/containers/investigations/details/investigation-summary";
import useUnsavedChangesWarning, { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";

export const GET_INVESTIGATION = gql`
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
      tasks {
        taskIdentifier
        taskTypeCode
        taskStatusCode
        assignedUserIdentifier
        createdByUserIdentifier
        createdDate
        updatedDate
        taskNumber
        description
        activeIndicator
        taskCategoryTypeCode
        remarks
        dueDate
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
          enforcementActions {
            enforcementActionIdentifier
            enforcementActionCode {
              enforcementActionCode
              shortDescription
            }
            dateIssued
            geoOrganizationUnitCode
            appUserIdentifier
            activeIndicator
            ticket {
              ticketIdentifier
              ticketOutcomeCode
              ticketAmount
              ticketNumber
              paidDate
            }
          }
        }
        date
        community
      }
      leadAgency
      locationAddress
      locationDescription
      locationGeometry
      primaryInvestigatorGuid
      supervisorGuid
      fileCoordinatorGuid
      discoveryDate
      discoveryTime
      community
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
  const { data, isLoading, refetch } = useGraphQLQuery<{
    getInvestigation: Investigation;
    caseFilesByActivityIds: CaseFile[];
  }>(GET_INVESTIGATION, {
    queryKey: ["getInvestigation", investigationGuid],
    variables: { investigationGuid: investigationGuid },
    enabled: !!investigationGuid, // Only refresh query if id is provided
  });

  // dirty form Handler
  const { isAnyDirty, handleChildDirtyChange } = useFormDirtyState();
  useUnsavedChangesWarning(isAnyDirty);

  const investigationData = data?.getInvestigation;
  const caseIdentifier = data?.caseFilesByActivityIds?.[0]?.caseIdentifier;
  const caseName = data?.caseFilesByActivityIds?.[0]?.name;

  const renderTabContent = () => {
    if (currentTab === "summary") {
      return (
        <InvestigationSummary
          investigationData={investigationData}
          investigationGuid={investigationGuid}
          caseGuid={caseIdentifier ?? ""}
          caseName={caseName ?? ""}
          onDirtyChange={handleChildDirtyChange}
        />
      );
    }
    if (currentTab === "tasks") {
      return (
        <InvestigationTasksNew
          investigationData={investigationData}
          investigationGuid={investigationGuid}
          onDirtyChange={handleChildDirtyChange}
        />
      );
    }
    if (currentTab === "parties") {
      return (
        <InvestigationParties
          investigationData={investigationData}
          investigationGuid={investigationGuid}
          onDirtyChange={handleChildDirtyChange}
        />
      );
    }
    if (currentTab === "contraventions") {
      return (
        <InvestigationContraventions
          investigationData={investigationData}
          investigationGuid={investigationGuid}
          onDirtyChange={handleChildDirtyChange}
        />
      );
    }
    if (currentTab === "documents") {
      return (
        <InvestigationDocumentation
          investigationGuid={investigationGuid}
          investigationName={investigationData?.name}
          tasks={(investigationData?.tasks as Task[]) ?? []}
        />
      );
    }
    if (currentTab === "exhibits") {
      return (
        <InvestigationExhibits
          investigationGuid={investigationGuid}
          investigationName={investigationData?.name}
          tasks={(investigationData?.tasks as Task[]) ?? []}
        />
      );
    }
    if (currentTab === "continuation") {
      return (
        <InvestigationContinuation
          investigationData={investigationData}
          onDirtyChange={handleChildDirtyChange}
        />
      );
    }
    if (currentTab === "admin") {
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

  const isListView = currentTab === "documents" || currentTab === "tasks" || currentTab === "exhibits";
  const containerClass = isListView
    ? "comp-complaint-details comp-complaint-details--list-view"
    : "comp-complaint-details";
  const detailsBodyClass = isListView ? "comp-details-body comp-details-body--list-view" : "comp-details-body";

  return (
    <div className={containerClass}>
      <InvestigationHeader
        investigation={investigationData}
        onStatusUpdated={refetch}
      />

      <div className={detailsBodyClass}>{renderTabContent()}</div>
    </div>
  );
};
