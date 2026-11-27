import { formatDateInTimeZone } from "src/common/methods";
import {
  buildCodeMaps,
  CASE_ACTIVITY_INSPECTION,
  CASE_ACTIVITY_INVESTIGATION,
  describeCode,
  partyRoleKey,
  ReportCodeMaps,
  ReportCodeTables,
} from "src/external_api/party/party_data";
import { get, post } from "src/external_api/shared_data";

const LEGISLATION_TYPE_ACT = "ACT";
const LEGISLATION_TYPE_REGULATION = "REG";
const OPEN_STATUS = "Open";

interface HistoryContravention {
  legislationIdentifierRef: string;
  investigationParty?: Array<{
    partyReference?: string;
    enforcementActions?: Array<{
      enforcementActionCode?: { enforcementActionCode?: string };
      ticket?: { ticketOutcomeCode?: string } | null;
    } | null>;
  } | null>;
}

interface HistoryInvestigation {
  investigationGuid: string;
  name?: string;
  leadAgency?: string;
  openedTimestamp?: string;
  investigationStatus?: { shortDescription?: string };
  primaryInvestigatorGuid?: string;
  supervisorGuid?: string;
  contraventions?: Array<HistoryContravention | null>;
}

interface HistoryInspection {
  inspectionGuid: string;
  name?: string;
  leadAgency?: string;
  inspectionStatus?: { shortDescription?: string };
}

interface HistoryData {
  partyHistoryInvestigations?: HistoryInvestigation[];
  partyHistoryInspections?: HistoryInspection[];
  partyHistoryCaseFiles?: Array<{ activities?: Array<{ activityIdentifier?: string } | null> }>;
  InvestigationParties?: Array<{ investigationGuid?: string; partyAssociationRole?: string }>;
  InspectionParties?: Array<{ inspectionGuid?: string; partyAssociationRole?: string }>;
}

interface HistoryActivity {
  name: string;
  role: string;
  dateOpened: string;
  agency: string;
  status: string;
  primaryInvestigator: string;
  supervisor: string;
  contraventions: HistoryContravention[];
}

export interface HistoryEntry {
  name: string;
  role: string;
  dateOpened: string;
  agency: string;
  status: string;
  primaryInvestigator: string;
  supervisor: string;
  // "Contravention" (citation) rows, each followed by a "Decision" row when there is one
  contraventions: Array<{ label: string; value: string }>;
}

interface HistoryOfficer {
  appUserGuid: string;
  firstName?: string;
  lastName?: string;
}

interface HistoryLegislation {
  legislationTypeCode?: string;
  fullCitation?: string;
  sectionTitle?: string;
  ancestors?: Array<{ legislationTypeCode?: string; sectionTitle?: string } | null>;
}

// Matches formatCitationWithAct on the frontend: a regulation's full citation gets its parent act in front
const formatLegislationCitation = (legislation: HistoryLegislation | undefined): string => {
  if (!legislation) return "";
  const chain = [
    ...(legislation.ancestors ?? []).filter((node): node is NonNullable<typeof node> => node != null),
    legislation,
  ];
  const actName = chain.find((node) => node.legislationTypeCode === LEGISLATION_TYPE_ACT)?.sectionTitle ?? "";
  const isRegulation = chain.some((node) => node.legislationTypeCode === LEGISLATION_TYPE_REGULATION);
  const citation = legislation.fullCitation ?? "";
  return isRegulation ? `${actName}, ${citation}` : citation;
};

// One line per contravention decision for this party; a contravention with no decisions still shows its citation
const buildContraventionLines = (
  contraventions: HistoryContravention[],
  partyReference: string,
  legislations: Map<string, HistoryLegislation>,
  codeMaps: ReportCodeMaps,
) =>
  contraventions.flatMap((contravention) => {
    const citation = formatLegislationCitation(legislations.get(contravention.legislationIdentifierRef));
    const matchingParty = (contravention.investigationParty ?? []).find(
      (party) => party?.partyReference === partyReference,
    );
    const enforcementActions = (matchingParty?.enforcementActions ?? []).filter(
      (enforcementAction): enforcementAction is NonNullable<typeof enforcementAction> => enforcementAction != null,
    );

    if (enforcementActions.length === 0) {
      return [{ contravention: citation, decision: "" }];
    }

    return enforcementActions.map((enforcementAction) => {
      const decision = describeCode(
        codeMaps.enforcementActions,
        enforcementAction.enforcementActionCode?.enforcementActionCode,
      );
      const ticketOutcomeCode = enforcementAction.ticket?.ticketOutcomeCode;
      return {
        contravention: citation,
        decision: ticketOutcomeCode
          ? `${decision} (${codeMaps.ticketOutcomes.get(ticketOutcomeCode) ?? ""})`
          : decision,
      };
    });
  });

// One entry per activity; each contravention decision becomes a Contravention row and a Decision row
const buildHistoryEntries = (
  activities: HistoryActivity[],
  partyReference: string,
  legislations: Map<string, HistoryLegislation>,
  codeMaps: ReportCodeMaps,
): HistoryEntry[] =>
  activities.map((activity) => ({
    name: activity.name,
    role: activity.role,
    dateOpened: activity.dateOpened,
    agency: activity.agency,
    status: activity.status,
    primaryInvestigator: activity.primaryInvestigator,
    supervisor: activity.supervisor,
    contraventions: buildContraventionLines(activity.contraventions, partyReference, legislations, codeMaps).flatMap(
      (line) => [
        { label: "Contravention", value: line.contravention },
        ...(line.decision ? [{ label: "Decision", value: line.decision }] : []),
      ],
    ),
  }));

// Matches PartyComplianceHistory on the frontend: activities come from the party's case files, sorted by name
const buildHistoryActivities = (
  data: HistoryData,
  officers: Map<string, string>,
  codeMaps: ReportCodeMaps,
  tz: string,
): HistoryActivity[] => {
  const investigations = new Map((data.partyHistoryInvestigations ?? []).map((i) => [i.investigationGuid, i]));
  const inspections = new Map((data.partyHistoryInspections ?? []).map((i) => [i.inspectionGuid, i]));
  const investigationRoles = new Map(
    (data.InvestigationParties ?? []).map((p) => [p.investigationGuid, p.partyAssociationRole]),
  );
  const inspectionRoles = new Map(
    (data.InspectionParties ?? []).map((p) => [p.inspectionGuid, p.partyAssociationRole]),
  );
  const officerName = (guid?: string) => (guid ? (officers.get(guid) ?? "-") : "-");
  // Unlike the party details role, history roles have no code fallback (matches getPartyRoleText)
  const roleText = (caseActivityTypeCode: string, role?: string) =>
    role ? (codeMaps.partyRoles.get(partyRoleKey(caseActivityTypeCode, role)) ?? "") : "";

  const activityIds = [
    ...new Set(
      (data.partyHistoryCaseFiles ?? []).flatMap((caseFile) =>
        (caseFile.activities ?? [])
          .map((activity) => activity?.activityIdentifier)
          .filter((activityId): activityId is string => !!activityId),
      ),
    ),
  ];

  const activities: HistoryActivity[] = [];
  for (const activityId of activityIds) {
    const investigation = investigations.get(activityId);
    if (investigation) {
      const status = investigation.investigationStatus?.shortDescription ?? "";
      activities.push({
        name: investigation.name ?? "",
        role: roleText(CASE_ACTIVITY_INVESTIGATION, investigationRoles.get(activityId)),
        dateOpened: formatDateInTimeZone(investigation.openedTimestamp, tz),
        agency: codeMaps.agencies.get(investigation.leadAgency ?? "") ?? "",
        status,
        primaryInvestigator: officerName(investigation.primaryInvestigatorGuid),
        supervisor: officerName(investigation.supervisorGuid),
        // Open investigations show no contravention details
        contraventions:
          status === OPEN_STATUS
            ? []
            : (investigation.contraventions ?? []).filter(
                (contravention): contravention is HistoryContravention => contravention != null,
              ),
      });
    }

    const inspection = inspections.get(activityId);
    if (inspection) {
      activities.push({
        name: inspection.name ?? "",
        role: roleText(CASE_ACTIVITY_INSPECTION, inspectionRoles.get(activityId)),
        dateOpened: "",
        agency: codeMaps.agencies.get(inspection.leadAgency ?? "") ?? "",
        status: inspection.inspectionStatus?.shortDescription ?? "",
        primaryInvestigator: "",
        supervisor: "",
        contraventions: [],
      });
    }
  }

  return activities.sort((left, right) => left.name.localeCompare(right.name));
};

// Officer names and contravention legislation for the history rows, fetched in one query
const getHistoryLookups = async (token: string, investigations: HistoryInvestigation[]) => {
  const officerGuids = [
    ...new Set(
      investigations
        .flatMap((i) => [i.primaryInvestigatorGuid, i.supervisorGuid])
        .filter((guid): guid is string => !!guid),
    ),
  ];
  const legislationGuids = [
    ...new Set(
      investigations.flatMap((i) =>
        (i.contraventions ?? [])
          .filter((contravention): contravention is HistoryContravention => contravention != null)
          .map((contravention) => contravention.legislationIdentifierRef),
      ),
    ),
  ];

  if (officerGuids.length === 0 && legislationGuids.length === 0) {
    return { officers: new Map<string, string>(), legislations: new Map<string, HistoryLegislation>() };
  }

  const officerGuidList = officerGuids.map((guid) => JSON.stringify(guid)).join(", ");
  const officerQuery = officerGuids.length
    ? `appUsersByGuids(appUserGuids: [${officerGuidList}]) {
        appUserGuid
        firstName
        lastName
      }`
    : "";
  const legislationQueries = legislationGuids
    .map(
      (guid, index) => `legislation_${index}: legislation(legislationGuid: "${guid}", includeAncestors: true) {
        legislationTypeCode
        fullCitation
        sectionTitle
        ancestors {
          legislationTypeCode
          sectionTitle
        }
      }`,
    )
    .join("\n");

  // POST rather than GET: the query grows with each contravention's legislation, and in a GET it would go in the
  // URL, which the server limits (16 KB by default in Node)
  const { response, error } = await post(token, { query: `{ ${officerQuery} ${legislationQueries} }` });

  if (error) throw new Error(`Request failed while fetching party history lookups: ${error.message}`);

  const errors = response?.data?.errors;
  if (errors)
    throw new Error(`GraphQL errors occurred while fetching party history lookups: ${JSON.stringify(errors)}`);

  const data = response.data.data;

  const officers = new Map<string, string>(
    (data.appUsersByGuids ?? []).map((u: HistoryOfficer) => [u.appUserGuid, `${u.lastName}, ${u.firstName}`]),
  );
  const legislations = new Map<string, HistoryLegislation>(
    legislationGuids.map((guid, index) => [guid, data[`legislation_${index}`]]),
  );
  return { officers, legislations };
};

// Compliance and enforcement history for the shared party behind this party
export const getPartyHistory = async (
  token: string,
  partyReference: string,
  partyTypeGuid: string,
  partyType: string,
  codeTables: ReportCodeTables,
  tz: string,
) => {
  if (!partyReference || !partyTypeGuid) {
    return [];
  }

  const query = `{
    partyHistoryInvestigations(partyId: "${partyTypeGuid}", partyType: "${partyType}") {
      investigationGuid
      name
      leadAgency
      openedTimestamp
      investigationStatus {
        shortDescription
      }
      primaryInvestigatorGuid
      supervisorGuid
      contraventions {
        legislationIdentifierRef
        investigationParty {
          partyReference
          enforcementActions {
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
    partyHistoryInspections(partyId: "${partyTypeGuid}", partyType: "${partyType}") {
      inspectionGuid
      name
      leadAgency
      inspectionStatus {
        shortDescription
      }
    }
    partyHistoryCaseFiles(partyId: "${partyTypeGuid}", partyType: "${partyType}") {
      activities {
        activityIdentifier
      }
    }
    InvestigationParties(partyRefId: "${partyReference}") {
      investigationGuid
      partyAssociationRole
    }
    InspectionParties(partyRefId: "${partyReference}") {
      inspectionGuid
      partyAssociationRole
    }
  }`;

  const { data, errors } = await get(token, { query });

  if (errors) {
    throw new Error(`GraphQL errors occurred while fetching party history: ${JSON.stringify(errors)}`);
  }

  const codeMaps = buildCodeMaps(codeTables);
  const { officers, legislations } = await getHistoryLookups(token, data.partyHistoryInvestigations ?? []);
  const activities = buildHistoryActivities(data, officers, codeMaps, tz);
  return buildHistoryEntries(activities, partyReference, legislations, codeMaps);
};
