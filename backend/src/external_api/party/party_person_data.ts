import { format, toZonedTime } from "date-fns-tz";
import { describeCode, ReportCodeMaps } from "src/external_api/party/party_data";

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

export const buildPersonReport = (person: ReportPerson, codeMaps: ReportCodeMaps, tz: string) => {
  const descriptors = buildPersonDescriptors(person, codeMaps);
  return {
    ...buildPersonIdentifyingInformation(person, codeMaps, tz),
    ...descriptors,
    hasDescriptors: Object.values(descriptors).some(Boolean),
    comments: person.comments ?? "",
  };
};
