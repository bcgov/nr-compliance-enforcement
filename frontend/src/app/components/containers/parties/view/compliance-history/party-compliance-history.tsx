import { FC, useCallback } from "react";
import { Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  CaseFile,
  Contravention,
  Inspection,
  InspectionParty,
  Investigation,
  InvestigationParty,
} from "@/generated/graphql";
import { CaseActivities } from "@/app/constants/case-activities";
import { useAppSelector } from "@/app/hooks/hooks";
import { applyStatusClass } from "@/app/common/methods";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { selectAgencyDropdown, selectCodeTable } from "@/app/store/reducers/code-table";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { CASE_ACTIVITY_TYPES } from "@/app/constants/case-activity-types";
import { selectOfficers } from "@/app/store/reducers/officer";
import { getUserAgency } from "@/app/service/user-service";
import Option from "@apptypes/app/option";
import { PartyComplianceActivity, PartyComplianceRelation } from "@/app/types/app/shared/party-compliance-history";
import LegislationRow from "@/app/components/containers/parties/view/compliance-history/legislation-row";

const GET_INVESTIGATIONS_BY_PARTY = gql`
  query GetInvestigationsByParty($partyId: String!, $partyType: String!) {
    partyHistoryInvestigations(partyId: $partyId, partyType: $partyType) {
      investigationGuid
      description
      leadAgency
      openedTimestamp
      updatedTimestamp
      locationGeometry
      locationAddress
      locationDescription
      name
      investigationStatus {
        shortDescription
      }
      primaryInvestigatorGuid
      contraventions {
        contraventionIdentifier
        legislationIdentifierRef
        investigationParty {
          partyReference
          enforcementActions {
            enforcementActionIdentifier
            enforcementActionCode {
              enforcementActionCode
            }
            ticket {
              ticketOutcomeCode
            }
          }
        }
      }
    }
  }
`;

const GET_INSPECTIONS_BY_PARTY = gql`
  query GetInspectionsByParty($partyId: String!, $partyType: String!) {
    partyHistoryInspections(partyId: $partyId, partyType: $partyType) {
      inspectionGuid
      description
      leadAgency
      openedTimestamp
      updatedTimestamp
      locationGeometry
      locationAddress
      locationDescription
      name
    }
  }
`;

const GET_CASE_FILES_BY_ACTIVITIES = gql`
  query GetCaseFilesByActivityIds($activityIdentifiers: [String!]!) {
    partyHistoryCaseFiles(activityIdentifiers: $activityIdentifiers) {
      caseIdentifier
      name
      leadAgency {
        agencyCode
      }
      activities {
        activityIdentifier
      }
    }
  }
`;

const GET_INSPECTION_PARTY_ROLES = gql`
  query GetInspectionPartyByReference($partyRefId: String!) {
    InspectionParties(partyRefId: $partyRefId) {
      inspectionGuid
      partyReference
      partyAssociationRole
    }
  }
`;

const GET_INVESTIGATION_PARTY_ROLES = gql`
  query GetInvestigationPartyByReference($partyRefId: String!) {
    InvestigationParties(partyRefId: $partyRefId) {
      investigationGuid
      partyReference
      partyAssociationRole
    }
  }
`;

const buildActivityPath = (activity: PartyComplianceActivity): string => {
  const segment = activity.activityType === CaseActivities.INVESTIGATION ? "investigation" : "inspection";
  return `/${segment}/${activity.id}`;
};

interface PartyComplianceHistoryProps {
  partyReference: string;
  partyTypeGuid: string;
  partyType: string;
}

export const PartyComplianceHistory: FC<PartyComplianceHistoryProps> = ({
  partyReference,
  partyTypeGuid,
  partyType,
}) => {
  // Relocated data functions close over `id`; alias keeps their bodies verbatim.
  const id = partyReference;

  const leadAgencyOptions = useAppSelector(selectAgencyDropdown);
  const partyRoles = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.PARTY_ASSOCIATION_ROLE));
  const officers = useAppSelector(selectOfficers);

  const getPartyRoleText = (roleCode: string, activityType: string) => {
    const partyRoleText: string = partyRoles.find(
      (partyRole) => partyRole.partyAssociationRole === roleCode && partyRole.caseActivityTypeCode === activityType,
    )?.shortDescription;
    return partyRoleText;
  };

  const getOfficerName = useCallback(
    (officerGuid: string): string => {
      const officer = officers?.find((o) => o.app_user_guid === officerGuid);
      return officer ? `${officer.last_name}, ${officer.first_name}` : "-";
    },
    [officers],
  );

  const GetPartyRelations = (
    partyId: string,
    partyType: string,
  ): {
    partyRelations: PartyComplianceRelation[];
    isPartyRelationLoading: boolean;
  } => {
    const { relatedInvestigations, relatedInspections, isActivityLoading } = GetRelatedActivities(
      partyId ?? "",
      partyType ?? "",
    );

    const partyRelations = [];

    const userAgency = getUserAgency();

    const relatedInvestigationsIds = relatedInvestigations?.map((investigation) => investigation.investigationGuid);
    const relatedInspectionIds = relatedInspections?.map((inspection) => inspection.inspectionGuid);

    const activityIds = [...(relatedInvestigationsIds ?? []), ...(relatedInspectionIds ?? [])];

    const { data: caseData, isLoading: isCaseLoading } = useGraphQLQuery<{
      partyHistoryCaseFiles: CaseFile[];
    }>(GET_CASE_FILES_BY_ACTIVITIES, {
      queryKey: ["activities", activityIds],
      variables: { activityIdentifiers: activityIds },
      enabled: !!activityIds && activityIds.length > 0,
    });

    const relatedCases = caseData?.partyHistoryCaseFiles;

    const uniqueCaseIds = [...new Set(relatedCases?.map((item) => item.caseIdentifier))];

    const { rolesInInvestigations, rolesInInspections, isPartyRoleLoading } = GetPartyRoles(id);

    for (let uniqueCaseId of uniqueCaseIds) {
      const partyRelation: PartyComplianceRelation = {};
      const currentCase = relatedCases?.find((relatedCase) => relatedCase.caseIdentifier === uniqueCaseId);
      partyRelation.caseId = uniqueCaseId;
      partyRelation.caseName = currentCase?.name;
      partyRelation.activities = [];
      partyRelation.leadAgency = leadAgencyOptions.find(
        (option: Option) => option.value === currentCase?.leadAgency?.agencyCode,
      )?.label;
      partyRelation.sameAgency = currentCase?.leadAgency?.agencyCode === userAgency;

      for (let caseActivity of currentCase?.activities ?? []) {
        const currenInvestigation = relatedInvestigations?.find(
          (relatedInvestigation) => relatedInvestigation.investigationGuid === caseActivity?.activityIdentifier,
        );

        if (currenInvestigation) {
          partyRelation.activities.push({
            id: currenInvestigation.investigationGuid,
            name: currenInvestigation.name,
            activityType: CaseActivities.INVESTIGATION,
            leadAgency: leadAgencyOptions.find((option: Option) => option.value === currenInvestigation?.leadAgency)
              ?.label,
            role: getPartyRoleText(
              rolesInInvestigations.find(
                (investigation) => investigation.investigationGuid === currenInvestigation.investigationGuid,
              )?.partyAssociationRole ?? "",
              CASE_ACTIVITY_TYPES.INVESTIGATION,
            ),
            sameAgency: currenInvestigation?.leadAgency === userAgency,
            status: currenInvestigation?.investigationStatus?.shortDescription ?? "",
            primaryInvestigatorName: getOfficerName(currenInvestigation?.primaryInvestigatorGuid ?? ""),
            contraventions: (currenInvestigation?.contraventions as Contravention[]) ?? null,
          });
        }

        const currenInspection = relatedInspections?.find(
          (relatedInspection) => relatedInspection.inspectionGuid === caseActivity?.activityIdentifier,
        );
        if (currenInspection) {
          partyRelation.activities.push({
            id: currenInspection.inspectionGuid,
            name: currenInspection.name,
            activityType: CaseActivities.INSPECTION,
            leadAgency: leadAgencyOptions.find((option: Option) => option.value === currenInspection?.leadAgency)
              ?.label,
            role: getPartyRoleText(
              rolesInInspections.find((inspection) => inspection.inspectionGuid === currenInspection.inspectionGuid)
                ?.partyAssociationRole ?? "",
              CASE_ACTIVITY_TYPES.INSPECTION,
            ),
            sameAgency: currenInspection?.leadAgency === userAgency,
            status: currenInspection?.inspectionStatus?.shortDescription ?? "",
          });
        }
      }
      partyRelations.push(partyRelation);
    }
    const isPartyRelationLoading = isActivityLoading || isCaseLoading || isPartyRoleLoading;

    return { partyRelations, isPartyRelationLoading };
  };

  const GetRelatedActivities = (
    partyId: string,
    partyType: string,
  ): {
    relatedInvestigations: Investigation[];
    relatedInspections: Inspection[];
    isActivityLoading: boolean;
  } => {
    const { data: investigationData, isLoading: isInvestigationLoading } = useGraphQLQuery<{
      partyHistoryInvestigations: Investigation[];
    }>(GET_INVESTIGATIONS_BY_PARTY, {
      queryKey: ["InvestigationParty", id],
      variables: { partyId, partyType },
      enabled: !!partyId && !!partyType,
    });

    const relatedInvestigations = investigationData?.partyHistoryInvestigations ?? [];

    const { data: inspectionData, isLoading: isInspectionLoading } = useGraphQLQuery<{
      partyHistoryInspections: Inspection[];
    }>(GET_INSPECTIONS_BY_PARTY, {
      queryKey: ["InspectionParty", id],
      variables: { partyId, partyType },
      enabled: !!partyId && !!partyType,
    });

    const relatedInspections = inspectionData?.partyHistoryInspections ?? [];

    const isActivityLoading = isInspectionLoading || isInvestigationLoading;

    return { relatedInvestigations, relatedInspections, isActivityLoading };
  };

  const GetPartyRoles = (
    id: string,
  ): {
    rolesInInvestigations: InvestigationParty[];
    rolesInInspections: InspectionParty[];
    isPartyRoleLoading: boolean;
  } => {
    const { data: rolesInInvestigationsData, isLoading: isInvestigationRoleLoading } = useGraphQLQuery<{
      InvestigationParties: InvestigationParty[];
    }>(GET_INVESTIGATION_PARTY_ROLES, {
      queryKey: ["InvestigationPartyRoles", id],
      variables: { partyRefId: id },
      enabled: !!id,
    });

    const rolesInInvestigations = rolesInInvestigationsData?.InvestigationParties ?? [];

    const { data: rolesInInspectionsData, isLoading: isInspectionRoleLoading } = useGraphQLQuery<{
      InspectionParties: InspectionParty[];
    }>(GET_INSPECTION_PARTY_ROLES, {
      queryKey: ["InspectionPartyRoles", id],
      variables: { partyRefId: id },
      enabled: !!id,
    });

    const rolesInInspections = rolesInInspectionsData?.InspectionParties ?? [];

    const isPartyRoleLoading = isInvestigationRoleLoading || isInspectionRoleLoading;

    return { rolesInInvestigations, rolesInInspections, isPartyRoleLoading };
  };

  const { partyRelations, isPartyRelationLoading } = GetPartyRelations(partyTypeGuid ?? "", partyType ?? "");

  if (isPartyRelationLoading) {
    return <p>Loading compliance and enforcement history...</p>;
  }

  const activities = partyRelations
    .flatMap((relation) => relation.activities ?? [])
    .toSorted((left, right) => (left.name ?? "").localeCompare(right.name ?? ""));

  return (
    <div>
      {activities.map((activity) => (
        <div key={activity.id}>
          <p className="mb-1">
            <Badge
              bg="species-badge comp-species-badge"
              className="ms-2"
            >
              {activity.role}
            </Badge>{" "}
            {activity.sameAgency ? (
              <Link to={buildActivityPath(activity)}>{activity.name}</Link>
            ) : (
              <span>{activity.name}</span>
            )}
            <span className="ms-2">
              Primary investigator: {activity.primaryInvestigatorName}
              {activity.leadAgency && ` (${activity.leadAgency})`}
            </span>{" "}
            <Badge
              bg="species-badge comp-species-badge"
              className={`${applyStatusClass(activity.status ?? "")}`}
            >
              {activity.status}
            </Badge>
          </p>
          {activity.status !== "Open" &&
            activity.contraventions?.map((contravention: Contravention) => (
              <LegislationRow
                key={contravention.contraventionIdentifier}
                contravention={contravention}
                partyReference={partyReference}
              />
            ))}
        </div>
      ))}
    </div>
  );
};

export default PartyComplianceHistory;
