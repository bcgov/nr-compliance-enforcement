import { InvestigationHeader } from "@/app/components/containers/investigations/details/investigation-header";
import { FC, useMemo } from "react";
import { useParams } from "react-router-dom";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { CaseFile, Investigation, InvestigationCloseEligibility, Task } from "@/generated/graphql";
import InvestigationParties from "@/app/components/containers/investigations/details/investigation-parties";
import { InvestigationContraventions } from "@/app/components/containers/investigations/details/investigation-contravention";
import { InvestigationContinuation } from "@/app/components/containers/investigations/details/investigation-continuation";
import { InvestigationAdministration } from "@/app/components/containers/investigations/details/investigation-administration";
import { InvestigationDocumentation } from "@/app/components/containers/investigations/details/investigation-documentation";
import { InvestigationExhibits } from "@/app/components/containers/investigations/details/investigation-exhibits";
import { InvestigationTasksNew } from "@/app/components/containers/investigations/details/investigation-task";
import InvestigationSummary from "@/app/components/containers/investigations/details/investigation-summary";
import useUnsavedChangesWarning, { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";
import { StatusChangeAdvisory } from "@/app/components/common/change-status-modal";
import { InvestigationStatus } from "@/app/constants/investigation-status";

export const GET_INVESTIGATION = gql`
  query GetInvestigation($investigationGuid: String!) {
    getInvestigation(investigationGuid: $investigationGuid) {
      __typename
      investigationGuid
      name
      description
      openedTimestamp
      updatedTimestamp
      createdByAppUserGuid
      investigationStatus {
        investigationStatusCode
        shortDescription
        longDescription
      }
      parties {
        __typename
        partyIdentifier
        partyReference
        isUpToDate
        partyTypeCode
        placeholderName
        attachmentReferences {
          objectId
          version
          fileName
          createdAt
          thumbObjectId
          thumbVersion
          activeInd
        }
        aliases {
          aliasGuid
          name
        }
        contactMethods {
          contactMethodGuid
          typeCode
          value
          isPrimary
        }
        addresses {
          contactMethods {
            contactMethodGuid
            typeCode
            value
            isPrimary
          }
          addressGuid
          addressName
          address
          city
          province
          postalCode
          country
          displayInInvestigation
          isPrimary
        }
        person {
          personGuid
          personReference
          firstName
          middleNames
          lastName
          dateOfBirth
          approximateAgeCode
          driversLicenseNumber
          driversLicenseClass
          driversLicenseCountryCode
          driversLicenseCountrySubdivisionCode
          genderCode
          sexCode
          heightInCm
          weightInKg
          complexionCode
          buildCode
          hairColourCode
          hairLengthCode
          hairColourOther
          eyeColourCode
          eyeColourOther
          facialHairIndicator
          facialHairStyleCodes {
            personFacialStyleHairCodeGuid
            facialHairStyleCode
            personFacialHairStyleCodeReference
          }
          additionalHairDescriptors
          tattooIndicator
          tattooDescription
          additionalDescriptors
          comments
          safetyConcernIndicator
          safetyConcernReason
        }
        business {
          __typename
          businessGuid
          name
          safetyConcernIndicator
          safetyConcernReason
          contactPeople {
            businessPersonXrefGuid
            title
            displayInInvestigation
            isPrimary
            associatedAddresses {
              address {
                addressGuid
                addressName
              }
            }
            contactMethods {
              contactMethodGuid
              typeCode
              value
              isPrimary
            }
            person {
              personGuid
              firstName
              lastName
            }
          }
          businessIdentifiers {
            businessIdentifierGuid
            identifierCode
            identifierValue
            businessIdentifierReference
          }
        }
        partyAssociationRole
      }
      tasks {
        taskIdentifier
        taskStatusCode
        assignedUserIdentifier
        createdByUserIdentifier
        createdDate
        updatedDate
        taskNumber
        description
        activeIndicator
        taskCategoryTypeCode
        subject
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
            comment
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
      investigationSourceCode
    }
    caseFilesByActivityIds(activityIdentifiers: [$investigationGuid]) {
      caseIdentifier
      name
    }
  }
`;

export const GET_INVESTIGATION_CLOSE_ELIGIBILITY = gql`
  query GetInvestigationCloseEligibility($investigationGuid: ID!) {
    investigationCloseEligibility(investigationGuid: $investigationGuid) {
      isEligible
      contraventionsWithoutDecisionCount
      openTaskCount
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
    refetchInterval: 30 * 1000, // poll for shared party changes
  });

  const { data: eligibilityData } = useGraphQLQuery<{
    investigationCloseEligibility: InvestigationCloseEligibility;
  }>(GET_INVESTIGATION_CLOSE_ELIGIBILITY, {
    queryKey: ["investigationCloseEligibility", investigationGuid],
    variables: { investigationGuid: investigationGuid },
    enabled: !!investigationGuid,
  });

  // dirty form Handler
  const { isAnyDirty, handleChildDirtyChange } = useFormDirtyState();
  useUnsavedChangesWarning(isAnyDirty);

  const investigationData = data?.getInvestigation;
  const caseIdentifier = data?.caseFilesByActivityIds?.[0]?.caseIdentifier;
  const caseName = data?.caseFilesByActivityIds?.[0]?.name;

  const eligibility = eligibilityData?.investigationCloseEligibility;
  const currentStatus = investigationData?.investigationStatus?.investigationStatusCode;

  const statusAdvisories = useMemo((): Record<string, StatusChangeAdvisory> => {
    const advisories: Record<string, StatusChangeAdvisory> = {};

    if (currentStatus === InvestigationStatus.Closed) {
      advisories[InvestigationStatus.Open] = {
        variant: "confirm",
        heading: <strong>Are you sure you want to reopen this investigation?</strong>,
        subheading: "Reopening a closed investigation has the following impacts:",
        details: [
          {
            id: "reporting",
            content: (
              <>
                <strong>Reporting &amp; Metrics</strong>: Data metrics and monthly reports will immediately update to
                reflect this case as &quot;Open&quot;.
              </>
            ),
          },
          {
            id: "permissions",
            content: (
              <>
                <strong>Permissions</strong>: All sections will unlock, restoring full editing access to authorized
                users.
              </>
            ),
          },
        ],
      };
      return advisories;
    }

    if (!eligibility) {
      return advisories;
    }

    if (eligibility.isEligible) {
      advisories[InvestigationStatus.Closed] = {
        variant: "confirm",
        heading: (
          <>
            <strong>Important</strong>: Closing this investigation will lock all sections. You will no longer be able to
            make edits.
          </>
        ),
      };
      return advisories;
    }

    const details = [];

    if (eligibility.contraventionsWithoutDecisionCount > 0) {
      details.push({
        id: "contraventions",
        content: (
          <>
            <strong>
              {eligibility.contraventionsWithoutDecisionCount}{" "}
              {eligibility.contraventionsWithoutDecisionCount === 1 ? "contravention" : "contraventions"}
            </strong>{" "}
            within the investigation {eligibility.contraventionsWithoutDecisionCount === 1 ? "does" : "do"} not have a
            documented decision.
          </>
        ),
      });
    }

    if (eligibility.openTaskCount > 0) {
      details.push({
        id: "tasks",
        content: (
          <>
            <strong>
              {eligibility.openTaskCount} {eligibility.openTaskCount === 1 ? "task" : "tasks"}
            </strong>{" "}
            {eligibility.openTaskCount === 1 ? "has" : "have"} not been addressed or closed yet.
          </>
        ),
      });
    }

    advisories[InvestigationStatus.Closed] = {
      variant: "blocked",
      heading: (
        <>
          The status of this investigation cannot be changed from <strong>Open</strong> to <strong>Closed</strong> for
          the following reasons:
        </>
      ),
      details,
    };

    return advisories;
  }, [currentStatus, eligibility]);

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
        statusAdvisories={statusAdvisories}
      />

      <div className={detailsBodyClass}>{renderTabContent()}</div>
    </div>
  );
};
