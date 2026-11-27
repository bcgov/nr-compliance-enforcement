import { format, toZonedTime } from "date-fns-tz";
import { describeCode, ReportCodeMaps, ReportRow } from "src/external_api/party/party_data";

const OTHER_CODE = "OTH";

const CM_PER_INCH = 2.54;
const INCHES_PER_FOOT = 12;
const LB_PER_KG = 1 / 0.45359237;

export interface ReportPerson {
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

// Person fields shared by the party and investigation party queries
export const personReportFields = `
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

// Person identifying information rows in screen order; empty values are left out
const buildPersonIdentifyingInformation = (
  person: ReportPerson,
  aliases: string,
  externalIds: ReportRow[],
  codeMaps: ReportCodeMaps,
  tz: string,
): ReportRow[] => {
  // Date of birth is date-only; take the date part as-is so it never shifts with the server time zone
  const dateOfBirth = person.dateOfBirth ? person.dateOfBirth.split("T")[0] : "";

  return [
    { label: "First name", value: person.firstName ?? "" },
    { label: "Middle name(s)", value: person.middleNames ?? "" },
    { label: "Last name", value: person.lastName ?? "" },
    { label: "Alias(es)", value: aliases },
    { label: "Sex as per ID", value: person.sexCode ?? "" },
    { label: "Date of birth", value: dateOfBirth },
    // Age only when we have a DOB
    { label: "Age", value: dateOfBirth ? `${calculateAgeYears(dateOfBirth, tz)} years old` : "" },
    // Approximate age only when we have no DOB
    {
      label: "Approximate age",
      value: dateOfBirth ? "" : describeCode(codeMaps.approximateAges, person.approximateAgeCode),
    },
    { label: "Driver's licence number", value: person.driversLicenseNumber ?? "" },
    { label: "Driver's licence class", value: person.driversLicenseClass ?? "" },
    { label: "Driver's licence country", value: describeCode(codeMaps.countries, person.driversLicenseCountryCode) },
    {
      label: "Driver's licence province",
      value: describeCode(codeMaps.countrySubdivisions, person.driversLicenseCountrySubdivisionCode),
    },
    ...externalIds,
  ].filter((row) => row.value);
};

// Person descriptor rows in screen order; empty values are left out
const buildPersonDescriptors = (person: ReportPerson, codeMaps: ReportCodeMaps): ReportRow[] =>
  [
    { label: "Height", value: formatHeight(person.heightInCm) },
    { label: "Weight", value: formatWeight(person.weightInKg) },
    { label: "Complexion", value: describeCode(codeMaps.complexions, person.complexionCode) },
    { label: "Build", value: describeCode(codeMaps.builds, person.buildCode) },
    {
      label: "Hair colour",
      value: describeWithOther(codeMaps.hairColours, person.hairColourCode, person.hairColourOther),
    },
    { label: "Hair length", value: describeCode(codeMaps.hairLengths, person.hairLengthCode) },
    { label: "Additional hair descriptors", value: person.additionalHairDescriptors ?? "" },
    { label: "Eye colour", value: describeWithOther(codeMaps.eyeColours, person.eyeColourCode, person.eyeColourOther) },
    { label: "Facial hair", value: yesNo(person.facialHairIndicator) },
    {
      label: "Facial hair style",
      value: (person.facialHairStyleCodes ?? [])
        .map((ref) => describeCode(codeMaps.facialHairStyles, ref?.facialHairStyleCode))
        .filter(Boolean)
        .join(", "),
    },
    { label: "Has tattoos", value: yesNo(person.tattooIndicator) },
    { label: "Tattoos descriptors", value: person.tattooDescription ?? "" },
    { label: "Additional descriptors", value: person.additionalDescriptors ?? "" },
  ].filter((row) => row.value);

export const buildPersonReport = (
  person: ReportPerson,
  aliases: string,
  externalIds: ReportRow[],
  codeMaps: ReportCodeMaps,
  tz: string,
) => {
  const descriptors = buildPersonDescriptors(person, codeMaps);
  return {
    identifyingInformation: buildPersonIdentifyingInformation(person, aliases, externalIds, codeMaps, tz),
    hasDescriptors: descriptors.length > 0,
    descriptors,
    comments: person.comments ?? "",
  };
};
