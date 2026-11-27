import { formatPhonenumber } from "src/common/methods";

// Shared by the party report builders: party-level types, query fields, code tables and section helpers

type CodeTable = Array<Record<string, string>>;

export const CASE_ACTIVITY_INVESTIGATION = "INVSTGTN";
export const CASE_ACTIVITY_INSPECTION = "INSPECTION";

const CONTACT_METHOD_PHONE = "PHONE";
const CONTACT_METHOD_EMAIL = "EMAILADDR";

export interface ReportCodeTables {
  approximateAgeCodes: CodeTable;
  countries: CodeTable;
  countrySubdivisions: CodeTable;
  partyExternalIdCodes: CodeTable;
  complexionCodes: CodeTable;
  buildCodes: CodeTable;
  hairColourCodes: CodeTable;
  hairLengthCodes: CodeTable;
  eyeColourCodes: CodeTable;
  facialHairStyleCodes: CodeTable;
  partyAssociationRoles: CodeTable;
  agencyCodes: CodeTable;
  enforcementActionCodes: CodeTable;
  ticketOutcomeCodes: CodeTable;
}

export interface ReportCodeMaps {
  approximateAges: Map<string, string>;
  countries: Map<string, string>;
  countrySubdivisions: Map<string, string>;
  externalIdTypes: Map<string, string>;
  complexions: Map<string, string>;
  builds: Map<string, string>;
  hairColours: Map<string, string>;
  hairLengths: Map<string, string>;
  eyeColours: Map<string, string>;
  facialHairStyles: Map<string, string>;
  // Keyed by case activity type and role, since role codes repeat across activity types
  partyRoles: Map<string, string>;
  agencies: Map<string, string>;
  enforcementActions: Map<string, string>;
  ticketOutcomes: Map<string, string>;
}

export interface ReportContactMethod {
  typeCode?: string;
  value?: string;
  isPrimary?: boolean;
}

export interface ReportAddress {
  addressName?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  isPrimary?: boolean;
  displayInInvestigation?: boolean;
  contactMethods?: Array<ReportContactMethod | null>;
}

export interface ReportRow {
  label: string;
  value: string;
}

// Matches PartyNameParts on the frontend
interface PartyNameParts {
  person?: { firstName?: string; middleNames?: string; lastName?: string } | null;
  business?: { name?: string } | null;
  placeholderName?: string;
}

// Contact methods, shared by the party and its addresses
export const contactMethodFields = `
  contactMethods {
    typeCode
    value
    isPrimary
  }
`;

// Fields shared by the party and investigation party queries
export const partyReportFields = `
  partyTypeCode
  aliases {
    name
  }
  externalIds {
    externalIdCode
    externalIdValue
  }
  ${contactMethodFields}
  addresses {
    addressName
    address
    city
    province
    postalCode
    country
    isPrimary
    displayInInvestigation
    ${contactMethodFields}
  }
`;

// Code tables used to resolve descriptions in the party report
export const partyReportCodeTableFields = `
  approximateAgeCodes {
    approximateAgeCode
    shortDescription
  }
  countries {
    countryCode
    shortDescription
  }
  countrySubdivisions {
    countrySubdivisionCode
    shortDescription
  }
  partyExternalIdCodes {
    partyExternalIdCode
    shortDescription
  }
  complexionCodes {
    complexionCode
    shortDescription
  }
  buildCodes {
    buildCode
    shortDescription
  }
  hairColourCodes {
    hairColourCode
    shortDescription
  }
  hairLengthCodes {
    hairLengthCode
    shortDescription
  }
  eyeColourCodes {
    eyeColourCode
    shortDescription
  }
  facialHairStyleCodes {
    facialHairStyleCode
    shortDescription
  }
  partyAssociationRoles {
    partyAssociationRole
    caseActivityTypeCode
    shortDescription
  }
  agencyCodes {
    agencyCode
    shortDescription
  }
  enforcementActionCodes {
    enforcementActionCode
    shortDescription
  }
  ticketOutcomeCodes {
    ticketOutcomeCode
    shortDescription
  }
`;

const toCodeMap = (codes: CodeTable, codeKey: string): Map<string, string> =>
  new Map<string, string>(codes.map((c) => [c[codeKey], c.shortDescription]));

export const partyRoleKey = (caseActivityTypeCode: string, role: string): string => `${caseActivityTypeCode}|${role}`;

// Short description for a party role within a case activity type, falling back to the role code
export const describeRole = (codeMaps: ReportCodeMaps, caseActivityTypeCode: string, role?: string): string =>
  role ? (codeMaps.partyRoles.get(partyRoleKey(caseActivityTypeCode, role)) ?? role) : "";

// Convert code tables into code -> short description maps
export const buildCodeMaps = (codeTables: ReportCodeTables): ReportCodeMaps => ({
  approximateAges: toCodeMap(codeTables.approximateAgeCodes, "approximateAgeCode"),
  countries: toCodeMap(codeTables.countries, "countryCode"),
  countrySubdivisions: toCodeMap(codeTables.countrySubdivisions, "countrySubdivisionCode"),
  externalIdTypes: toCodeMap(codeTables.partyExternalIdCodes, "partyExternalIdCode"),
  complexions: toCodeMap(codeTables.complexionCodes, "complexionCode"),
  builds: toCodeMap(codeTables.buildCodes, "buildCode"),
  hairColours: toCodeMap(codeTables.hairColourCodes, "hairColourCode"),
  hairLengths: toCodeMap(codeTables.hairLengthCodes, "hairLengthCode"),
  eyeColours: toCodeMap(codeTables.eyeColourCodes, "eyeColourCode"),
  facialHairStyles: toCodeMap(codeTables.facialHairStyleCodes, "facialHairStyleCode"),
  partyRoles: new Map<string, string>(
    codeTables.partyAssociationRoles.map((c) => [
      partyRoleKey(c.caseActivityTypeCode, c.partyAssociationRole),
      c.shortDescription,
    ]),
  ),
  agencies: toCodeMap(codeTables.agencyCodes, "agencyCode"),
  enforcementActions: toCodeMap(codeTables.enforcementActionCodes, "enforcementActionCode"),
  ticketOutcomes: toCodeMap(codeTables.ticketOutcomeCodes, "ticketOutcomeCode"),
});

// Short description for a code, falling back to the code itself (matches the party details screen)
export const describeCode = (descriptions: Map<string, string>, code?: string): string =>
  code ? (descriptions.get(code) ?? code) : "";

// Matches getPartyName on the frontend: "LAST, First Middle", then business name, then placeholder name
export const getPartyName = (party: PartyNameParts): string => {
  if (party.person) {
    const { firstName, middleNames, lastName } = party.person;
    const givenNames = [firstName, middleNames]
      .map((part) => part?.trim())
      .filter(Boolean)
      .join(" ");
    const name = [lastName?.trim().toUpperCase(), givenNames].filter(Boolean).join(", ");
    if (name) return name;
  }
  if (party.business?.name) return party.business.name;
  if (party.placeholderName) return party.placeholderName;
  return "-";
};

// Matches renderContactRows on the frontend: "Primary <noun>", "Alternate <noun>", then "Alternate <noun> N"
const contactLabel = (index: number, noun: string): string => {
  if (index === 0) return `Primary ${noun}`;
  if (index === 1) return `Alternate ${noun}`;
  return `Alternate ${noun} ${index}`;
};

// Phones then email addresses, each with the primary first
export const buildContactRows = (contactMethods: Array<ReportContactMethod | null> | undefined) => {
  const methods = (contactMethods ?? []).filter((cm): cm is ReportContactMethod => cm != null);
  const byType = (typeCode: string) =>
    methods
      .filter((cm): cm is ReportContactMethod & { value: string } => cm.typeCode === typeCode && !!cm.value)
      .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));

  return [
    ...byType(CONTACT_METHOD_PHONE).map((cm, index) => ({
      label: contactLabel(index, "phone"),
      value: formatPhonenumber(cm.value) ?? cm.value,
    })),
    ...byType(CONTACT_METHOD_EMAIL).map((cm, index) => ({
      label: contactLabel(index, "email address"),
      value: cm.value,
    })),
  ];
};

// Investigation parties only show addresses flagged for display in the investigation; primary first
export const buildAddresses = (
  addresses: Array<ReportAddress | null> | undefined,
  codeMaps: ReportCodeMaps,
  isInvestigationParty: boolean,
) =>
  (addresses ?? [])
    .filter((addr): addr is ReportAddress => addr != null)
    .filter((addr) => (isInvestigationParty ? addr.displayInInvestigation : true))
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
    .map((addr) => ({
      // Carbone formatters can't output parentheses, so the Primary badge text is added here
      name: addr.isPrimary ? `${addr.addressName ?? ""} (Primary)` : (addr.addressName ?? ""),
      address: [
        addr.address,
        addr.city,
        describeCode(codeMaps.countrySubdivisions, addr.province),
        describeCode(codeMaps.countries, addr.country),
        addr.postalCode,
      ]
        .filter(Boolean)
        .join(", "),
      contactMethods: buildContactRows(addr.contactMethods),
    }));

export const buildAliases = (aliases: Array<{ name?: string } | null> | undefined): string =>
  (aliases ?? [])
    .map((alias) => alias?.name)
    .filter(Boolean)
    .join(", ");

export const buildExternalIds = (
  externalIds: Array<{ externalIdCode?: string; externalIdValue?: string } | null> | undefined,
  codeMaps: ReportCodeMaps,
): ReportRow[] =>
  (externalIds ?? [])
    .filter((externalId): externalId is NonNullable<typeof externalId> => externalId != null)
    .map((externalId) => ({
      label: describeCode(codeMaps.externalIdTypes, externalId.externalIdCode),
      value: externalId.externalIdValue ?? "",
    }));
