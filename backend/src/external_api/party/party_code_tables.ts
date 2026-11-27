// Code tables shared by the party report and its compliance and enforcement history

type CodeTable = Array<Record<string, string>>;

export const CASE_ACTIVITY_INVESTIGATION = "INVSTGTN";
export const CASE_ACTIVITY_INSPECTION = "INSPECTION";

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
