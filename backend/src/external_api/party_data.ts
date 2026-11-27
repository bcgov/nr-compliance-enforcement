import { format, toZonedTime } from "date-fns-tz";
import { formatDate } from "src/common/methods";
import { get } from "src/external_api/shared_data";

type CodeTable = Array<Record<string, string>>;

interface ReportPerson {
  firstName?: string;
  middleNames?: string;
  lastName?: string;
  dateOfBirth?: string;
  approximateAgeCode?: string;
  driversLicenseNumber?: string;
  driversLicenseClass?: string;
  driversLicenseCountryCode?: string;
  driversLicenseCountrySubdivisionCode?: string;
  sexCode?: string;
}

interface ReportParty {
  partyIdentifier?: string;
  placeholderName?: string;
  aliases?: Array<{ name?: string } | null>;
  externalIds?: Array<{ externalIdCode?: string; externalIdValue?: string } | null>;
  person?: ReportPerson | null;
  business?: { name?: string } | null;
}

interface ReportCodeTables {
  approximateAgeCodes: CodeTable;
  countries: CodeTable;
  countrySubdivisions: CodeTable;
  partyExternalIdCodes: CodeTable;
}

interface ReportCodeMaps {
  approximateAges: Map<string, string>;
  countries: Map<string, string>;
  countrySubdivisions: Map<string, string>;
  externalIdTypes: Map<string, string>;
}

// Fields shared by the party and investigation party queries
const partyReportFields = `
  aliases {
    name
  }
  externalIds {
    externalIdCode
    externalIdValue
  }
  person {
    firstName
    middleNames
    lastName
    dateOfBirth
    approximateAgeCode
    driversLicenseNumber
    driversLicenseClass
    driversLicenseCountryCode
    driversLicenseCountrySubdivisionCode
    sexCode
  }
  business {
    name
  }
`;

// Code tables used to resolve descriptions in the party report
const partyReportCodeTableFields = `
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
`;

// Convert code tables into code -> short description maps
const buildCodeMaps = (codeTables: ReportCodeTables): ReportCodeMaps => ({
  approximateAges: new Map<string, string>(
    codeTables.approximateAgeCodes.map((c) => [c.approximateAgeCode, c.shortDescription]),
  ),
  countries: new Map<string, string>(codeTables.countries.map((c) => [c.countryCode, c.shortDescription])),
  countrySubdivisions: new Map<string, string>(
    codeTables.countrySubdivisions.map((c) => [c.countrySubdivisionCode, c.shortDescription]),
  ),
  externalIdTypes: new Map<string, string>(
    codeTables.partyExternalIdCodes.map((c) => [c.partyExternalIdCode, c.shortDescription]),
  ),
});

// Short description for a code, falling back to the code itself (matches the party details screen)
const describeCode = (descriptions: Map<string, string>, code?: string): string =>
  code ? (descriptions.get(code) ?? code) : "";

// Matches getPartyName on the frontend: "LAST, First Middle", then business name, then placeholder name
const getPartyName = (party: ReportParty): string => {
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

// Whole years between a yyyy-MM-dd date of birth and today in the user's time zone
const calculateAgeYears = (dateOfBirth: string, tz: string): number => {
  const [birthYear, birthMonth, birthDay] = dateOfBirth.split("-").map(Number);
  const [year, month, day] = format(toZonedTime(new Date(), tz), "yyyy-MM-dd", { timeZone: tz }).split("-").map(Number);

  let age = year - birthYear;
  if (month < birthMonth || (month === birthMonth && day < birthDay)) {
    age--;
  }
  return age;
};

const buildPersonIdentifyingInformation = (person: ReportPerson, codeMaps: ReportCodeMaps, tz: string) => {
  // Date of birth is date-only; take the date part as-is so it never shifts with the server time zone
  const dateOfBirth = person.dateOfBirth ? person.dateOfBirth.split("T")[0] : "";

  return {
    firstName: person.firstName ?? "",
    middleNames: person.middleNames ?? "",
    lastName: person.lastName ?? "",
    sex: person.sexCode ?? "",
    dateOfBirth,
    // Age only when we have a DOB
    age: dateOfBirth ? `${calculateAgeYears(dateOfBirth, tz)} years old` : "",
    // Approximate age only when we have no DOB
    approximateAge: dateOfBirth ? "" : describeCode(codeMaps.approximateAges, person.approximateAgeCode),
    driversLicenseNumber: person.driversLicenseNumber ?? "",
    driversLicenseClass: person.driversLicenseClass ?? "",
    driversLicenseCountry: describeCode(codeMaps.countries, person.driversLicenseCountryCode),
    driversLicenseProvince: describeCode(codeMaps.countrySubdivisions, person.driversLicenseCountrySubdivisionCode),
  };
};

const buildPartyReport = (party: ReportParty, codeTables: ReportCodeTables, tz: string) => {
  // Convert data into report readable format
  const codeMaps = buildCodeMaps(codeTables);

  return {
    partyName: getPartyName(party),
    generatedOn: formatDate(new Date().toISOString()),
    isPerson: !!party.person,
    isBusiness: !!party.business,
    aliases: (party.aliases ?? [])
      .map((alias) => alias?.name)
      .filter(Boolean)
      .join(", "),
    externalIds: (party.externalIds ?? []).filter(Boolean).map((externalId) => ({
      label: describeCode(codeMaps.externalIdTypes, externalId?.externalIdCode),
      value: externalId?.externalIdValue ?? "",
    })),
    ...(party.person ? buildPersonIdentifyingInformation(party.person, codeMaps, tz) : {}),
  };
};

// Used for shared party report generation
export const getPartyReportData = async (token: string, partyIdentifier: string, tz: string) => {
  const query = `{
    party(partyIdentifier: "${partyIdentifier}") {
      ${partyReportFields}
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

  return buildPartyReport(party, codeTables, tz);
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
        placeholderName
        ${partyReportFields}
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

  return buildPartyReport(party, codeTables, tz);
};
