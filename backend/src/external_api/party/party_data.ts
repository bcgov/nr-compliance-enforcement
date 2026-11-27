import { format, toZonedTime } from "date-fns-tz";
import { formatDate, formatPhonenumber } from "src/common/methods";
import {
  buildCodeMaps,
  CASE_ACTIVITY_INVESTIGATION,
  describeCode,
  describeRole,
  partyReportCodeTableFields,
  ReportCodeMaps,
  ReportCodeTables,
} from "src/external_api/party/party_code_tables";
import { getPartyHistory, HistoryEntry } from "src/external_api/party/party_history_data";
import { get } from "src/external_api/shared_data";

const CONTACT_METHOD_PHONE = "PHONE";
const CONTACT_METHOD_EMAIL = "EMAILADDR";
const OTHER_CODE = "OTH";

const CM_PER_INCH = 2.54;
const INCHES_PER_FOOT = 12;
const LB_PER_KG = 1 / 0.45359237;

interface ReportContactMethod {
  typeCode?: string;
  value?: string;
  isPrimary?: boolean;
}

interface ReportAddress {
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

interface ReportPerson {
  personGuid?: string;
  personReference?: string;
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
  heightInCm?: number;
  weightInKg?: number;
  complexionCode?: string;
  buildCode?: string;
  hairColourCode?: string;
  hairColourOther?: string;
  hairLengthCode?: string;
  additionalHairDescriptors?: string;
  eyeColourCode?: string;
  eyeColourOther?: string;
  facialHairIndicator?: boolean;
  facialHairStyleCodes?: Array<{ facialHairStyleCode?: string } | null>;
  tattooIndicator?: boolean;
  tattooDescription?: string;
  additionalDescriptors?: string;
  comments?: string;
  safetyConcernReason?: string;
}

interface ReportBusiness {
  businessGuid?: string;
  businessReference?: string;
  name?: string;
  safetyConcernReason?: string;
}

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

// Contact methods, shared by the party and its addresses
const contactMethodFields = `
  contactMethods {
    typeCode
    value
    isPrimary
  }
`;

// Fields shared by the party and investigation party queries
const partyReportFields = `
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

// Person fields shared by the party and investigation party queries
const personReportFields = `
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
  heightInCm
  weightInKg
  complexionCode
  buildCode
  hairColourCode
  hairColourOther
  hairLengthCode
  additionalHairDescriptors
  eyeColourCode
  eyeColourOther
  facialHairIndicator
  facialHairStyleCodes {
    facialHairStyleCode
  }
  tattooIndicator
  tattooDescription
  additionalDescriptors
  comments
  safetyConcernReason
`;

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

const yesNo = (indicator: boolean | null | undefined): string => {
  if (indicator === null || indicator === undefined) return "";
  return indicator ? "Yes" : "No";
};

// Matches cmToFeetInches on the frontend: whole feet + rounded inches, carrying 12 inches to a foot
const formatHeight = (heightInCm?: number): string => {
  if (!heightInCm) return "";
  const totalInches = Number(heightInCm) / CM_PER_INCH;
  let feet = Math.floor(totalInches / INCHES_PER_FOOT);
  let inches = Math.round(totalInches - feet * INCHES_PER_FOOT);
  if (inches === INCHES_PER_FOOT) {
    feet += 1;
    inches = 0;
  }
  return `${heightInCm} cm (${feet} feet ${inches} inches)`;
};

// Matches kgToLb on the frontend: whole pounds
const formatWeight = (weightInKg?: number): string =>
  weightInKg ? `${weightInKg} kg (${Math.round(Number(weightInKg) * LB_PER_KG)} lbs)` : "";

// "Other (...)" when the other code has free text, otherwise the code's description
const describeWithOther = (descriptions: Map<string, string>, code?: string, other?: string): string =>
  code === OTHER_CODE && other ? `Other (${other})` : describeCode(descriptions, code);

// Matches renderContactRows on the frontend: "Primary <noun>", "Alternate <noun>", then "Alternate <noun> N"
const contactLabel = (index: number, noun: string): string => {
  if (index === 0) return `Primary ${noun}`;
  if (index === 1) return `Alternate ${noun}`;
  return `Alternate ${noun} ${index}`;
};

// Phones then email addresses, each with the primary first
const buildContactRows = (contactMethods: Array<ReportContactMethod | null> | undefined) => {
  const methods = (contactMethods ?? []).filter((cm): cm is ReportContactMethod => cm != null);
  const byType = (typeCode: string) =>
    methods
      .filter((cm): cm is ReportContactMethod & { value: string } => cm.typeCode === typeCode && !!cm.value)
      .sort((a, b) => Number(b?.isPrimary) - Number(a?.isPrimary));

  return [
    ...byType(CONTACT_METHOD_PHONE).map((cm, index) => ({
      label: contactLabel(index, "phone"),
      value: formatPhonenumber(cm.value) ?? cm?.value,
    })),
    ...byType(CONTACT_METHOD_EMAIL).map((cm, index) => ({
      label: contactLabel(index, "email address"),
      value: cm?.value,
    })),
  ];
};

// Investigation parties only show addresses flagged for display in the investigation; primary first
const buildAddresses = (party: ReportParty, codeMaps: ReportCodeMaps, isInvestigationParty: boolean) =>
  (party.addresses ?? [])
    .filter((addr): addr is ReportAddress => addr != null)
    .filter((addr) => (isInvestigationParty ? addr?.displayInInvestigation : true))
    .sort((a, b) => Number(b?.isPrimary) - Number(a?.isPrimary))
    .map((addr) => ({
      // Carbone formatters can't output parentheses, so the Primary badge text is added here
      name: addr?.isPrimary ? `${addr.addressName ?? ""} (Primary)` : (addr?.addressName ?? ""),
      address: [
        addr?.address,
        addr?.city,
        describeCode(codeMaps.countrySubdivisions, addr?.province),
        describeCode(codeMaps.countries, addr?.country),
        addr?.postalCode,
      ]
        .filter(Boolean)
        .join(", "),
      contactMethods: buildContactRows(addr?.contactMethods),
    }));

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

const buildPersonDescriptors = (person: ReportPerson, codeMaps: ReportCodeMaps) => ({
  height: formatHeight(person.heightInCm),
  weight: formatWeight(person.weightInKg),
  complexion: describeCode(codeMaps.complexions, person.complexionCode),
  build: describeCode(codeMaps.builds, person.buildCode),
  hairColour: describeWithOther(codeMaps.hairColours, person.hairColourCode, person.hairColourOther),
  hairLength: describeCode(codeMaps.hairLengths, person.hairLengthCode),
  additionalHairDescriptors: person.additionalHairDescriptors ?? "",
  eyeColour: describeWithOther(codeMaps.eyeColours, person.eyeColourCode, person.eyeColourOther),
  facialHair: yesNo(person.facialHairIndicator),
  facialHairStyle: (person.facialHairStyleCodes ?? [])
    .map((ref) => describeCode(codeMaps.facialHairStyles, ref?.facialHairStyleCode))
    .filter(Boolean)
    .join(", "),
  hasTattoos: yesNo(person.tattooIndicator),
  tattooDescriptors: person.tattooDescription ?? "",
  additionalDescriptors: person.additionalDescriptors ?? "",
});

const buildPersonReport = (person: ReportPerson, codeMaps: ReportCodeMaps, tz: string) => {
  const descriptors = buildPersonDescriptors(person, codeMaps);
  return {
    ...buildPersonIdentifyingInformation(person, codeMaps, tz),
    ...descriptors,
    hasDescriptors: Object.values(descriptors).some(Boolean),
    comments: person.comments ?? "",
  };
};

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
  const addresses = buildAddresses(party, codeMaps, options.isInvestigationParty);

  return {
    partyName: getPartyName(party),
    generatedOn: formatDate(new Date().toISOString()),
    isPerson: !!party.person,
    isBusiness: !!party.business,
    ...buildPartyDetails(party, codeMaps, options.isInvestigationParty),
    aliases: (party.aliases ?? [])
      .map((alias) => alias?.name)
      .filter(Boolean)
      .join(", "),
    externalIds: (party.externalIds ?? [])
      .filter((externalId): externalId is NonNullable<typeof externalId> => externalId != null)
      .map((externalId) => ({
        label: describeCode(codeMaps.externalIdTypes, externalId.externalIdCode),
        value: externalId.externalIdValue ?? "",
      })),
    hasContactMethods: contactMethods.length > 0,
    contactMethods,
    hasAddresses: addresses.length > 0,
    addresses,
    ...(party.person ? buildPersonReport(party.person, codeMaps, options.tz) : {}),
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
        name
        safetyConcernReason
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
          name
          safetyConcernReason
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
