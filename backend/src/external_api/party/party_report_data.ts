import { formatDate } from "src/common/methods";
import { buildBusinessReport, businessReportFields, ReportBusiness } from "src/external_api/party/party_business_data";
import {
  buildAddresses,
  buildAliases,
  buildCodeMaps,
  buildContactRows,
  buildExternalIds,
  CASE_ACTIVITY_INVESTIGATION,
  describeRole,
  getPartyName,
  partyReportCodeTableFields,
  partyReportFields,
  ReportAddress,
  ReportCodeMaps,
  ReportCodeTables,
  ReportContactMethod,
} from "src/external_api/party/party_data";
import { getPartyHistory, HistoryEntry } from "src/external_api/party/party_history_data";
import { buildPersonReport, personReportFields, ReportPerson } from "src/external_api/party/party_person_data";
import { get } from "src/external_api/shared_data";

interface ReportParty {
  partyIdentifier?: string;
  partyReference?: string;
  partyTypeCode?: string;
  partyAssociationRole?: string;
  placeholderName?: string;
  aliases?: Array<{ name?: string } | null>;
  externalIds?: Array<{ externalIdCode?: string; externalIdValue?: string } | null>;
  contactMethods?: Array<ReportContactMethod | null>;
  addresses?: Array<ReportAddress | null>;
  person?: ReportPerson | null;
  business?: ReportBusiness | null;
}

interface ReportOptions {
  isInvestigationParty: boolean;
  tz: string;
}

const buildPartyDetails = (party: ReportParty, codeMaps: ReportCodeMaps, isInvestigationParty: boolean) => {
  const investigationRole = isInvestigationParty
    ? describeRole(codeMaps, CASE_ACTIVITY_INVESTIGATION, party.partyAssociationRole)
    : "";
  const safetyConcernReason = party.person?.safetyConcernReason ?? party.business?.safetyConcernReason ?? "";

  return {
    investigationRole,
    safetyConcernReason,
    hasPartyDetails: !!(investigationRole || safetyConcernReason),
  };
};

const buildPartyReport = (
  party: ReportParty,
  codeTables: ReportCodeTables,
  history: HistoryEntry[],
  options: ReportOptions,
) => {
  // Convert data into report readable format
  const codeMaps = buildCodeMaps(codeTables);
  const contactMethods = buildContactRows(party.contactMethods);
  const addresses = buildAddresses(party.addresses, codeMaps, options.isInvestigationParty);
  const aliases = buildAliases(party.aliases);
  const externalIds = buildExternalIds(party.externalIds, codeMaps);

  return {
    partyName: getPartyName(party),
    generatedOn: formatDate(new Date().toISOString()),
    isPerson: !!party.person,
    isBusiness: !!party.business,
    ...buildPartyDetails(party, codeMaps, options.isInvestigationParty),
    hasContactMethods: contactMethods.length > 0,
    contactMethods,
    hasAddresses: addresses.length > 0,
    addresses,
    ...(party.person ? buildPersonReport(party.person, aliases, externalIds, codeMaps, options.tz) : {}),
    ...(party.business ? buildBusinessReport(party.business, aliases, externalIds, options.isInvestigationParty) : {}),
    hasHistory: history.length > 0,
    history,
  };
};

// Used for shared party report generation
export const getPartyReportData = async (token: string, partyIdentifier: string, tz: string) => {
  const query = `{
    party(partyIdentifier: "${partyIdentifier}") {
      ${partyReportFields}
      person {
        personGuid
        ${personReportFields}
      }
      business {
        businessGuid
        ${businessReportFields}
      }
    }
    ${partyReportCodeTableFields}
  }`;

  const { data, errors } = await get(token, { query });

  if (errors) {
    throw new Error(`GraphQL errors occurred while fetching party: ${JSON.stringify(errors)}`);
  }

  const { party, ...codeTables } = data;

  if (!party) {
    throw new Error(`Party not found: ${partyIdentifier}`);
  }

  const history = await getPartyHistory(
    token,
    partyIdentifier,
    party.person?.personGuid ?? party.business?.businessGuid ?? "",
    party.partyTypeCode ?? "",
    codeTables,
    tz,
  );

  return buildPartyReport(party, codeTables, history, { isInvestigationParty: false, tz });
};

// Used for investigation party report generation
export const getInvestigationPartyReportData = async (
  token: string,
  investigationGuid: string,
  partyIdentifier: string,
  tz: string,
) => {
  const query = `{
    getInvestigation(investigationGuid: "${investigationGuid}") {
      parties {
        partyIdentifier
        partyReference
        partyAssociationRole
        placeholderName
        ${partyReportFields}
        person {
          personReference
          ${personReportFields}
        }
        business {
          businessReference
          ${businessReportFields}
        }
      }
    }
    ${partyReportCodeTableFields}
  }`;

  const { data, errors } = await get(token, { query });

  if (errors) {
    throw new Error(`GraphQL errors occurred while fetching investigation party: ${JSON.stringify(errors)}`);
  }

  const { getInvestigation, ...codeTables } = data;
  const party = (getInvestigation?.parties ?? []).find(
    (investigationParty: ReportParty | null) => investigationParty?.partyIdentifier === partyIdentifier,
  );

  if (!party) {
    throw new Error(`Investigation party not found: ${partyIdentifier}`);
  }

  const history = await getPartyHistory(
    token,
    party.partyReference ?? "",
    party.person?.personReference ?? party.business?.businessReference ?? "",
    party.partyTypeCode ?? "",
    codeTables,
    tz,
  );

  return buildPartyReport(party, codeTables, history, { isInvestigationParty: true, tz });
};
