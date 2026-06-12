import {
  Address,
  Alias,
  ContactMethod,
  PersonFacialHairStyleCode,
  PersonInput,
  PersonUpdateInput,
} from "@/generated/graphql";
import { ContactMethods } from "@/app/constants/contact-methods";
import { BusinessIdentifiers } from "@/app/constants/business-identifiers";
import { toDateOfBirth } from "@/app/common/methods";

export type AddressFormValue = {
  addressGuid?: string;
  addressName?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  isPrimary?: boolean;
};

export const createEmptyAddress = (): AddressFormValue => ({
  addressName: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  country: "",
  isPrimary: false,
});

// heightWeightConversions.ts
// Canonical storage is centimetres (height) and kilograms (weight). These helpers
// convert between the canonical metric values and imperial display units.
// Display/entry only — the form and backend always work in cm/kg.

const CM_PER_INCH = 2.54;
const INCHES_PER_FOOT = 12;
const KG_PER_LB = 0.45359237;
const LB_PER_KG = 1 / KG_PER_LB; // 2.2046226218...

export interface FeetInches {
  feet: number;
  inches: number;
}

/** Centimetres to whole feet + inches (inches rounded, carrying 12 -> +1 foot). */
export function cmToFeetInches(cm: number): FeetInches {
  const totalInches = cm / CM_PER_INCH;
  let feet = Math.floor(totalInches / INCHES_PER_FOOT);
  let inches = Math.round(totalInches - feet * INCHES_PER_FOOT);
  if (inches === INCHES_PER_FOOT) {
    feet += 1;
    inches = 0;
  }
  return { feet, inches };
}

/** Feet + inches to centimetres, rounded to one decimal (matches numeric(5,1)). */
export function feetInchesToCm(feet: number, inches: number): number {
  const totalInches = feet * INCHES_PER_FOOT + inches;
  return Math.round(totalInches * CM_PER_INCH * 10) / 10;
}

/** Kilograms to whole pounds. */
export function kgToLb(kg: number): number {
  return Math.round(kg * LB_PER_KG);
}

/** Pounds to kilograms, rounded to one decimal (matches numeric(5,1)). */
export function lbToKg(lb: number): number {
  return Math.round(lb * KG_PER_LB * 10) / 10;
}

// Helper function to map contact methods from party data
export const mapContactMethodsFromPartyData = (contactMethods: ContactMethod[] | undefined, typeCode: string) => {
  return (
    contactMethods
      ?.filter((c: ContactMethod) => c.typeCode === typeCode)
      .map((c: ContactMethod, index: number) => ({
        contactMethodGuid: c.contactMethodGuid,
        value: c.value,
        isPrimary: c.isPrimary ?? index === 0,
      })) || []
  );
};

// Helper function to map addresses from party data
export const mapAddressesFromPartyData = (addresses: Array<Address | null> | null | undefined): AddressFormValue[] =>
  addresses
    ?.filter((address): address is Address => address != null)
    .map((address, index) => ({
      addressGuid: address.addressGuid ?? undefined,
      addressName: address.addressName ?? "",
      address: address.address ?? "",
      city: address.city ?? "",
      province: address.province ?? "",
      postalCode: address.postalCode ?? "",
      country: address.country ?? "",
      isPrimary: address.isPrimary ?? index === 0,
    })) ?? [];

// Helper to build addresses array for mutations
export const buildAddresses = (addresses: AddressFormValue[] | undefined, isUpdate: boolean) =>
  (addresses ?? []).map((address) => ({
    ...(isUpdate && address.addressGuid ? { addressGuid: address.addressGuid } : {}),
    addressName: address.addressName?.trim() ?? "",
    address: address.address?.trim() || null,
    city: address.city?.trim() || null,
    province: address.province?.trim() || null,
    postalCode: address.postalCode?.trim() || null,
    country: address.country?.trim() || null,
    isPrimary: address.isPrimary ?? false,
  }));

// Helper to build contact methods array
export const buildContactMethods = (
  phoneNumbers: ContactMethod[],
  emailAddresses: ContactMethod[],
  includeGuid: boolean,
) => {
  const methods = [];

  if (phoneNumbers) {
    methods.push(
      ...phoneNumbers.map((p: ContactMethod) => ({
        ...(includeGuid && { contactMethodGuid: p.contactMethodGuid }),
        typeCode: ContactMethods.PHONE,
        value: p.value ?? "",
        isPrimary: p.isPrimary ?? false,
      })),
    );
  }

  if (emailAddresses) {
    methods.push(
      ...emailAddresses.map((e: ContactMethod) => ({
        ...(includeGuid && { contactMethodGuid: e.contactMethodGuid }),
        typeCode: ContactMethods.EMAIL,
        value: e.value ?? "",
        isPrimary: e.isPrimary ?? false,
      })),
    );
  }

  return methods;
};

// Helper to build identifiers array
export const buildIdentifiers = (businessNumber: any, worksafeBCNumber: any) => {
  const identifiers = [];

  if (businessNumber?.identifierValue) {
    identifiers.push({
      businessIdentifierGuid: businessNumber.businessIdentifierGuid,
      identifierCode: BusinessIdentifiers.BUSINESS_NUMBER,
      identifierValue: businessNumber.identifierValue,
    });
  }

  if (worksafeBCNumber?.identifierValue) {
    identifiers.push({
      businessIdentifierGuid: worksafeBCNumber.businessIdentifierGuid,
      identifierCode: BusinessIdentifiers.WSBC_NUMBER,
      identifierValue: worksafeBCNumber.identifierValue,
    });
  }

  return identifiers.length ? identifiers : undefined;
};

// Helper to validate business form fields
export const validateBusinessForm = async (value: any): Promise<string | null> => {
  if (!value.businessName?.trim()) {
    return "Name is required.";
  }

  if (!value.businessNumber?.identifierValue?.trim()) {
    return "Business number is required.";
  }

  const addresses = (value.addresses as AddressFormValue[] | undefined) ?? [];
  const missingNameIndex = addresses.findIndex((address) => !address.addressName?.trim());
  if (missingNameIndex >= 0) {
    return "Address name is required.";
  }

  return null;
};

// Shared base fields for person create/update.
export function buildPersonBase(value: any) {
  return {
    firstName: value.firstName,
    middleNames: value.middleNames?.trim() || null,
    lastName: value.lastName,
    dateOfBirth: toDateOfBirth(value),
    approximateAgeCode: value.approximateAgeCode || null,
    driversLicenseNumber: value.driversLicenseNumber || null,
    driversLicenseClass: value.driversLicenseClass || null,
    driversLicenseCountryCode: value.driversLicenseCountryCode || null,
    driversLicenseCountrySubdivisionCode: value.driversLicenseCountrySubdivisionCode || null,
    genderCode: value.genderCode || null,
    heightInCm: value.heightInCm || null,
    weightInKg: value.weightInKg || null,
    complexionCode: value.complexionCode || null,
    buildCode: value.buildCode || null,
    hairColourCode: value.hairColourCode || null,
    hairLengthCode: value.hairLengthCode || null,
    hairColourOther: value.hairColourOther || null,
    eyeColourCode: value.eyeColourCode || null,
    eyeColourOther: value.eyeColourOther || null,
    facialHairIndicator: value.facialHairIndicator || null,
    facialHairStyleCodes:
      value.facialHairStyleCodes?.map((fhs: PersonFacialHairStyleCode) => ({
        personFacialStyleHairCodeGuid: fhs.personFacialStyleHairCodeGuid,
        personGuid: fhs.personGuid,
        facialHairStyleCode: fhs.facialHairStyleCode,
      })) || [],
    additionalHairDescriptors: value.additionalHairDescriptors || null,
    comments: value.comments || null,
    tattooIndicator: value.tattooIndicator || null,
    tattooDescription: value.tattooDescription || null,
    additionalDescriptors: value.additionalDescriptors || null,
    boloIndicator: value.boloIndicator || null,
  };
}

export function buildPersonForCreate(value: any): PersonInput {
  return buildPersonBase(value);
}

export function buildPersonForUpdate(value: any): PersonUpdateInput {
  return { personGuid: value.personGuid, ...buildPersonBase(value) };
}

// Helper to build business object for creates
export const buildBusinessCreateUpdate = (value: any, contactPeople?: any[]) => {
  return {
    name: value.businessName,
    identifiers: buildIdentifiers(value.businessNumber, value.worksafeBCNumber),
    ...(contactPeople === undefined ? {} : { contactPeople: contactPeople.length ? contactPeople : undefined }),
  };
};

// Empty form default values shared across party forms
export const createEmptyPartyFormValues = () => ({
  partyType: "",
  personGuid: "",
  firstName: "",
  middleNames: "",
  lastName: "",
  dateOfBirth: null as Date | null,
  approximateAgeCode: "",
  driversLicenseNumber: "",
  driversLicenseClass: "",
  driversLicenseCountryCode: "",
  driversLicenseCountrySubdivisionCode: "",
  genderCode: "",
  heightInCm: null as number | null,
  weightInKg: null as number | null,
  complexionCode: "",
  buildCode: "",
  hairColourCode: "",
  hairLengthCode: "",
  hairColourOther: "",
  eyeColourCode: "",
  eyeColourOther: "",
  facialHairIndicator: "",
  facialHairStyleCodes: [] as PersonFacialHairStyleCode[],
  additionalHairDescriptors: "",
  boloIndicator: "",
  comments: "",
  tattooIndicator: "",
  tattooDescription: "",
  additionalDescriptors: "",
  businessName: "",
  businessNumber: {} as any,
  worksafeBCNumber: {} as any,
  aliases: [] as Alias[],
  phoneNumbers: [] as ContactMethod[],
  emailAddresses: [] as ContactMethod[],
  addresses: [] as AddressFormValue[],
  contacts: [] as any[],
});
