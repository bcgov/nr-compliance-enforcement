import { FC } from "react";
import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  AppUser,
  InspectionParty,
  InvestigationParty,
  PartyHistoryCaseFile,
  PartyHistoryContravention,
  PartyHistoryInspection,
  PartyHistoryInvestigation,
} from "@/generated/graphql";
import { CaseActivities } from "@/app/constants/case-activities";
import { useAppSelector } from "@/app/hooks/hooks";
import { applyStatusClass } from "@/app/common/methods";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { selectCodeTable } from "@/app/store/reducers/code-table";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { CASE_ACTIVITY_TYPES } from "@/app/constants/case-activity-types";
import { getUserAgency } from "@/app/service/user-service";
import { selectCanAccessInspections, selectCanAccessInvestigations } from "@/app/access/module-access";
import {
  PartyComplianceActivity,
  PartyComplianceHistoryRow,
  PartyComplianceRelation,
} from "@/app/types/app/shared/party-compliance-history";
import LegislationRow from "@/app/components/containers/parties/view/compliance-history/legislation-row";
import { formatDateObjectAsString, parseUTCTimestampToLocal } from "@/app/common/date-utils";
import { CompColumn } from "@/app/types/app/comp-tables";
import { CompTable } from "@/app/components/common/comp-table";
import { SORT_TYPES } from "@/app/constants/sort-direction";
import { Agency } from "@/app/types/app/code-tables/agency";
import { GET_APP_USERS_BY_GUIDS } from "@/app/components/containers/parties/view/party-history-tab";

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
      supervisorGuid
      contraventions {
        contraventionIdentifier
        date
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
      inspectionStatus {
        shortDescription
      }
    }
  }
`;

const GET_CASE_FILES_BY_PARTY = gql`
  query GetCaseFilesByParty($partyId: String!, $partyType: String!) {
    partyHistoryCaseFiles(partyId: $partyId, partyType: $partyType) {
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

// One row per contravention; open investigations and those without contraventions get a single row with no contravention details.
const buildHistoryRows = (activities: PartyComplianceActivity[]): PartyComplianceHistoryRow[] =>
  activities.flatMap<PartyComplianceHistoryRow>((activity) => {
    const contraventions = activity.status === "Open" ? [] : (activity.contraventions ?? []);
    if (contraventions.length === 0) {
      return [{ rowKey: activity.id ?? "", activity, contravention: null }];
    }
    return contraventions.map((contravention) => ({
      rowKey: `${activity.id}-${contravention.contraventionIdentifier}`,
      activity,
      contravention,
    }));
  });

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

  const agencyCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AGENCY));
  const partyRoles = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.PARTY_ASSOCIATION_ROLE));
  const canAccessInvestigations = useAppSelector(selectCanAccessInvestigations);
  const canAccessInspections = useAppSelector(selectCanAccessInspections);

  const getPartyRoleText = (roleCode: string, activityType: string) => {
    const partyRoleText: string = partyRoles.find(
      (partyRole) => partyRole.partyAssociationRole === roleCode && partyRole.caseActivityTypeCode === activityType,
    )?.shortDescription;
    return partyRoleText;
  };

  const GetPartyRelations = (
    partyId: string,
    partyType: string,
  ): {
    partyRelations: PartyComplianceRelation[];
    isPartyRelationLoading: boolean;
    partyRelationError: Error | null;
  } => {
    const { relatedInvestigations, relatedInspections, isActivityLoading, activityError } = GetRelatedActivities(
      partyId ?? "",
      partyType ?? "",
    );

    const partyRelations = [];

    const userAgency = getUserAgency();

    const {
      data: caseData,
      isLoading: isCaseLoading,
      error: caseError,
    } = useGraphQLQuery<{
      partyHistoryCaseFiles: PartyHistoryCaseFile[];
    }>(GET_CASE_FILES_BY_PARTY, {
      queryKey: ["CaseFileParty", id],
      variables: { partyId, partyType },
      enabled: !!partyId && !!partyType,
    });

    const relatedCases = caseData?.partyHistoryCaseFiles;

    const uniqueCaseIds = [...new Set(relatedCases?.map((item) => item.caseIdentifier))];

    const { rolesInInvestigations, rolesInInspections, isPartyRoleLoading, partyRoleError } = GetPartyRoles(id);

    const officerGuids = [
      ...new Set(
        relatedInvestigations
          .flatMap((investigation) => [investigation.primaryInvestigatorGuid, investigation.supervisorGuid])
          .filter((officerGuid): officerGuid is string => !!officerGuid),
      ),
    ];

    const {
      data: officerData,
      isLoading: isOfficerLoading,
      error: officerError,
    } = useGraphQLQuery<{
      appUsersByGuids: AppUser[];
    }>(GET_APP_USERS_BY_GUIDS, {
      queryKey: ["appUsersByGuids", ...officerGuids],
      variables: { appUserGuids: officerGuids },
      enabled: officerGuids.length > 0,
    });

    const officers = officerData?.appUsersByGuids ?? [];

    const getOfficerName = (officerGuid: string): string => {
      const officer = officers.find((o) => o.appUserGuid === officerGuid);
      return officer ? `${officer.lastName}, ${officer.firstName}` : "-";
    };

    for (let uniqueCaseId of uniqueCaseIds) {
      const partyRelation: PartyComplianceRelation = {};
      const currentCase = relatedCases?.find((relatedCase) => relatedCase.caseIdentifier === uniqueCaseId);
      partyRelation.caseId = uniqueCaseId;
      partyRelation.caseName = currentCase?.name;
      partyRelation.activities = [];
      partyRelation.leadAgency = agencyCodes.find(
        (agency: Agency) => agency.agency === currentCase?.leadAgency?.agencyCode,
      )?.shortDescription;
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
            leadAgency: agencyCodes.find((agency: Agency) => agency.agency === currenInvestigation?.leadAgency)
              ?.shortDescription,
            leadAgencyDescription: agencyCodes.find(
              (agency: Agency) => agency.agency === currenInvestigation?.leadAgency,
            )?.longDescription,
            role: getPartyRoleText(
              rolesInInvestigations.find(
                (investigation) => investigation.investigationGuid === currenInvestigation.investigationGuid,
              )?.partyAssociationRole ?? "",
              CASE_ACTIVITY_TYPES.INVESTIGATION,
            ),
            sameAgency: currenInvestigation?.leadAgency === userAgency,
            status: currenInvestigation?.investigationStatus?.shortDescription ?? "",
            primaryInvestigatorName: getOfficerName(currenInvestigation?.primaryInvestigatorGuid ?? ""),
            supervisorName: getOfficerName(currenInvestigation?.supervisorGuid ?? ""),
            dateOpened: parseUTCTimestampToLocal(currenInvestigation?.openedTimestamp),
            contraventions: (currenInvestigation?.contraventions as PartyHistoryContravention[]) ?? null,
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
            leadAgency: agencyCodes.find((agency: Agency) => agency.agency === currenInspection?.leadAgency)
              ?.shortDescription,
            leadAgencyDescription: agencyCodes.find(
              (agency: Agency) => agency.agency === currenInvestigation?.leadAgency,
            )?.longDescription,
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
    const isPartyRelationLoading = isActivityLoading || isCaseLoading || isPartyRoleLoading || isOfficerLoading;
    const partyRelationError = activityError || caseError || partyRoleError || officerError;

    return { partyRelations, isPartyRelationLoading, partyRelationError };
  };

  const GetRelatedActivities = (
    partyId: string,
    partyType: string,
  ): {
    relatedInvestigations: PartyHistoryInvestigation[];
    relatedInspections: PartyHistoryInspection[];
    isActivityLoading: boolean;
    activityError: Error | null;
  } => {
    const {
      data: investigationData,
      isLoading: isInvestigationLoading,
      error: investigationError,
    } = useGraphQLQuery<{
      partyHistoryInvestigations: PartyHistoryInvestigation[];
    }>(GET_INVESTIGATIONS_BY_PARTY, {
      queryKey: ["InvestigationParty", id],
      variables: { partyId, partyType },
      enabled: !!partyId && !!partyType,
    });

    const relatedInvestigations = investigationData?.partyHistoryInvestigations ?? [];

    const {
      data: inspectionData,
      isLoading: isInspectionLoading,
      error: inspectionError,
    } = useGraphQLQuery<{
      partyHistoryInspections: PartyHistoryInspection[];
    }>(GET_INSPECTIONS_BY_PARTY, {
      queryKey: ["InspectionParty", id],
      variables: { partyId, partyType },
      enabled: !!partyId && !!partyType,
    });

    const relatedInspections = inspectionData?.partyHistoryInspections ?? [];

    const isActivityLoading = isInspectionLoading || isInvestigationLoading;
    const activityError = inspectionError || investigationError;

    return { relatedInvestigations, relatedInspections, isActivityLoading, activityError };
  };

  const GetPartyRoles = (
    id: string,
  ): {
    rolesInInvestigations: InvestigationParty[];
    rolesInInspections: InspectionParty[];
    isPartyRoleLoading: boolean;
    partyRoleError: Error | null;
  } => {
    const {
      data: rolesInInvestigationsData,
      isLoading: isInvestigationRoleLoading,
      error: investigationRoleError,
    } = useGraphQLQuery<{
      InvestigationParties: InvestigationParty[];
    }>(GET_INVESTIGATION_PARTY_ROLES, {
      queryKey: ["InvestigationPartyRoles", id],
      variables: { partyRefId: id },
      enabled: !!id,
    });

    const rolesInInvestigations = rolesInInvestigationsData?.InvestigationParties ?? [];

    const {
      data: rolesInInspectionsData,
      isLoading: isInspectionRoleLoading,
      error: inspectionRoleError,
    } = useGraphQLQuery<{
      InspectionParties: InspectionParty[];
    }>(GET_INSPECTION_PARTY_ROLES, {
      queryKey: ["InspectionPartyRoles", id],
      variables: { partyRefId: id },
      enabled: !!id,
    });

    const rolesInInspections = rolesInInspectionsData?.InspectionParties ?? [];

    const isPartyRoleLoading = isInvestigationRoleLoading || isInspectionRoleLoading;
    const partyRoleError = investigationRoleError || inspectionRoleError;

    return { rolesInInvestigations, rolesInInspections, isPartyRoleLoading, partyRoleError };
  };

  const { partyRelations, isPartyRelationLoading, partyRelationError } = GetPartyRelations(
    partyTypeGuid ?? "",
    partyType ?? "",
  );

  if (isPartyRelationLoading) {
    return <p>Loading compliance and enforcement history...</p>;
  }

  const activities = partyRelations
    .flatMap((relation) => relation.activities ?? [])
    .toSorted((left, right) => (left.name ?? "").localeCompare(right.name ?? ""));

  const historyRows = buildHistoryRows(activities);

  const renderAgencyBadge = (row: PartyComplianceHistoryRow) => {
    const badge = (
      <Badge
        bg="species-badge comp-species-badge"
        className={`${applyStatusClass(row.activity.leadAgency ?? "")}`}
      >
        {row.activity.leadAgency}
      </Badge>
    );

    if (!row.activity.leadAgencyDescription) {
      return badge;
    }

    return (
      <OverlayTrigger
        placement="bottom"
        trigger={["hover", "click"]}
        overlay={
          <Tooltip
            id={`tt-agency-${row.rowKey}`}
            className="comp-tooltip comp-tooltip-bottom"
          >
            {row.activity.leadAgencyDescription}
          </Tooltip>
        }
      >
        <span>{badge}</span>
      </OverlayTrigger>
    );
  };

  const columns: CompColumn<PartyComplianceHistoryRow>[] = [
    {
      label: "Investigation",
      sortKey: "name",
      isSortable: true,
      headerClassName: "comp-cell-min-width-50",
      cellClassName: "comp-cell-min-width-50",
      getValue: (row) => (row.activity.name ?? "").toLowerCase(),
      renderCell: (row) => {
        const canAccessActivity =
          row.activity.activityType === CaseActivities.INVESTIGATION ? canAccessInvestigations : canAccessInspections;
        return row.activity.sameAgency && canAccessActivity ? (
          <Link
            to={buildActivityPath(row.activity)}
            className="comp-cell-link"
          >
            {row.activity.name}
          </Link>
        ) : (
          <span>{row.activity.name}</span>
        );
      },
    },
    {
      label: "Role",
      sortKey: "role",
      isSortable: true,
      headerClassName: "comp-cell-min-width-150",
      cellClassName: "comp-cell-min-width-150",
      getValue: (row) => (row.activity.role ?? "").toLowerCase(),
      renderCell: (row) => <Badge bg="species-badge comp-species-badge">{row.activity.role}</Badge>,
    },
    {
      label: "Date opened",
      sortKey: "date",
      isSortable: true,
      headerClassName: "comp-cell-min-width-100",
      cellClassName: "comp-cell-min-width-100",
      getValue: (row) => formatDateObjectAsString(row.activity.dateOpened, { format: "date" }),
      renderCell: (row) => formatDateObjectAsString(row.activity.dateOpened, { format: "date" }),
    },
    {
      label: "Outcomes",
      headerClassName: "comp-cell-min-width-250",
      cellClassName: "comp-cell-min-width-250",
      renderCell: (row) =>
        row.contravention ? (
          <LegislationRow
            contravention={row.contravention}
            partyReference={partyReference}
          />
        ) : (
          ""
        ),
    },
    {
      label: "Primary investigator",
      sortKey: "primaryInvestigator",
      isSortable: true,
      headerClassName: "comp-cell-min-width-160",
      cellClassName: "comp-cell-min-width-160",
      getValue: (row) => (row.activity.primaryInvestigatorName ?? "").toLowerCase(),
      renderCell: (row) => row.activity.primaryInvestigatorName ?? "",
    },
    {
      label: "Supervisor",
      sortKey: "supervisor",
      isSortable: true,
      headerClassName: "comp-cell-min-width-160",
      cellClassName: "comp-cell-min-width-160",
      getValue: (row) => (row.activity.supervisorName ?? "").toLowerCase(),
      renderCell: (row) => row.activity.supervisorName ?? "",
    },
    {
      label: "Agency",
      sortKey: "agency",
      isSortable: true,
      headerClassName: "comp-cell-min-width-100",
      cellClassName: "comp-cell-min-width-100",
      getValue: (row) => (row.activity.leadAgency ?? "").toLowerCase(),
      renderCell: (row) => renderAgencyBadge(row),
    },
    {
      label: "Status",
      sortKey: "status",
      isSortable: true,
      headerClassName: "comp-cell-min-width-100",
      cellClassName: "comp-cell-min-width-100",
      getValue: (row) => (row.activity.status ?? "").toLowerCase(),
      renderCell: (row) => (
        <Badge
          bg="species-badge comp-species-badge"
          className={`${applyStatusClass(row.activity.status ?? "")}`}
        >
          {row.activity.status}
        </Badge>
      ),
    },
  ];

  return (
    <CompTable
      data={historyRows}
      tableIdentifier="party-compliance-history"
      isFixedHeight={false}
      columns={columns}
      getRowKey={(row) => row.rowKey}
      defaultSort="name"
      defaultSortDirection={SORT_TYPES.ASC}
      error={partyRelationError}
      emptyMessage="No compliance and enforcement history."
      itemLabel="records"
    />
  );
};

export default PartyComplianceHistory;
