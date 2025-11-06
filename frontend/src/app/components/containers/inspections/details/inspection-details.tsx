import { InspectionHeader } from "@/app/components/containers/inspections/details/inspection-header";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { CaseFile, Inspection } from "@/generated/graphql";
import { InspectionTabs } from "@/app/components/containers/inspections/details/inspection-navigation";
import InspectionSummary from "@/app/components/containers/inspections/details/inspection-summary";
import InspectionParties from "@/app/components/containers/inspections/details/inspection-parties";
import { InspectionAdministration } from "@/app/components/containers/inspections/details/inspection-administration";

const GET_INSPECTION = gql`
  query GetInspection($inspectionGuid: String!) {
    getInspection(inspectionGuid: $inspectionGuid) {
      __typename
      inspectionGuid
      name
      description
      openedTimestamp
      createdByAppUserGuid
      inspectionStatus {
        inspectionStatusCode
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
      locationAddress
      locationDescription
      locationGeometry
    }
    caseFilesByActivityIds(activityIdentifiers: [$inspectionGuid]) {
      caseIdentifier
      name
    }
  }
`;

export type InspectionParams = {
  inspectionGuid: string;
  tabKey: string;
};

export const InspectionDetails: FC = () => {
  const { inspectionGuid = "", tabKey } = useParams<InspectionParams>();
  const currentTab = tabKey || "summary";
  const { data, isLoading } = useGraphQLQuery<{
    getInspection: Inspection;
    caseFilesByActivityIds: CaseFile[];
  }>(GET_INSPECTION, {
    queryKey: ["getInspection", inspectionGuid],
    variables: { inspectionGuid: inspectionGuid },
    enabled: !!inspectionGuid, // Only refresh query if id is provided
  });

  const inspectionData = data?.getInspection;
  const caseIdentifier = data?.caseFilesByActivityIds?.[0]?.caseIdentifier;
  const caseName = data?.caseFilesByActivityIds?.[0]?.name;

  const renderTabContent = () => {
    switch (currentTab) {
      case "summary":
        return (
          <InspectionSummary
            inspectionData={inspectionData}
            inspectionGuid={inspectionGuid}
            caseGuid={caseIdentifier ?? ""}
            caseName={caseName ?? ""}
          />
        );
      case "parties":
        return (
          <InspectionParties
            inspectionData={inspectionData}
            inspectionGuid={inspectionGuid}
          />
        );
      case "admin":
        return <InspectionAdministration />;
    }
  };

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
        <InspectionTabs />
        {renderTabContent()}
      </section>
    </div>
  );
};
