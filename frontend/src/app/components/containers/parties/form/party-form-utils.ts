import { Address, PersonFacialHairStyleCode, PersonInput, PersonUpdateInput } from "@/generated/graphql";
import { ContactMethods } from "@/app/constants/contact-methods";
import { BusinessIdentifiers } from "@/app/constants/business-identifiers";
import { isValidEmail } from "@/app/common/validate-email";
import { v4 as uuidv4 } from "uuid";

export type ContactMethodFormValue = {
  contactMethodGuid?: string;
  typeCode?: string;
  value?: string;
  isPrimary?: boolean;
};

export type AddressFormValue = {
  // client-generated for new addresses
  addressGuid?: string;
  addressName?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  isPrimary?: boolean;
  displayInInvestigation?: boolean;
  phoneNumber?: string;
  phoneNumberGuid?: string;
  emailAddress?: string;
  emailAddressGuid?: string;
};

export type ContactPersonFormValue = {
  businessPersonXrefGuid?: string;
  business: { businessGuid?: string };
  person: { personGuid?: string; firstName?: string; lastName?: string };
  contactMethods: ContactMethodFormValue[];
  title?: string;
  displayInInvestigation?: boolean;
  isPrimary?: boolean;
  officeAddressGuids?: string[];
};

export const CANADA_COUNTRY_CODE = "CA";

export const createEmptyAddress = (): AddressFormValue => ({
  addressGuid: uuidv4(),
  addressName: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  country: "",
  isPrimary: false,
  displayInInvestigation: true,
  phoneNumber: "",
  emailAddress: "",
});

export const createEmptyContactMethod = (isPrimary = false): ContactMethodFormValue => ({
  contactMethodGuid: "",
  value: "",
  isPrimary,
});

// contacts always show at least one phone and one email row
export const seedContactMethods = (methods: ContactMethodFormValue[] = []): ContactMethodFormValue[] => {
  const seeded = [...methods];
  if (!seeded.some((cm) => cm.typeCode === ContactMethods.PHONE))
    seeded.push({ contactMethodGuid: undefined, typeCode: ContactMethods.PHONE, value: "", isPrimary: true });
  if (!seeded.some((cm) => cm.typeCode === ContactMethods.EMAIL))
    seeded.push({ contactMethodGuid: undefined, typeCode: ContactMethods.EMAIL, value: "", isPrimary: true });
  return seeded;
};

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

// an untouched row shouldn't be sent to the backend
const hasValue = (value?: string | null) => !!value?.trim();

export const validatePhoneNumberValue = (value?: string): string | undefined => {
  if (!value?.startsWith("+")) return undefined;
  if (value.length !== 12) return "Phone number must be 10 digits";
  if (value.startsWith("+11") || value.startsWith("+10")) return "Invalid Format";
  return undefined;
};

export const validateEmailValue = (value?: string): string | undefined => {
  if (!value?.trim()) return undefined;
  return isValidEmail(value.trim()) ? undefined : "Please enter a valid email";
};

export const mapContactMethodsFromPartyData = (
  contactMethods:
    | Array<{
        contactMethodGuid?: string | null;
        typeCode?: string | null;
        value?: string | null;
        isPrimary?: boolean | null;
      } | null>
    | null
    | undefined,
  typeCode: string,
): ContactMethodFormValue[] => {
  const mapped =
    contactMethods
      ?.filter((c): c is NonNullable<typeof c> => c?.typeCode === typeCode)
      .map((c, index: number) => ({
        contactMethodGuid: c.contactMethodGuid ?? undefined,
        value: c.value ?? "",
        isPrimary: c.isPrimary ?? index === 0,
      })) || [];
  // multi item fields always show at least one row
  return mapped.length ? mapped : [createEmptyContactMethod(true)];
};

// Helper function to map addresses from party data
export const mapAddressesFromPartyData = (addresses: Array<Address | null> | null | undefined): AddressFormValue[] => {
  const mapped =
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
        displayInInvestigation: address.displayInInvestigation ?? true,
        phoneNumber: pickAddressContactMethod(address, ContactMethods.PHONE)?.value ?? "",
        phoneNumberGuid: pickAddressContactMethod(address, ContactMethods.PHONE)?.contactMethodGuid ?? undefined,
        emailAddress: pickAddressContactMethod(address, ContactMethods.EMAIL)?.value ?? "",
        emailAddressGuid: pickAddressContactMethod(address, ContactMethods.EMAIL)?.contactMethodGuid ?? undefined,
      })) ?? [];
  return mapped.length ? mapped : [{ ...createEmptyAddress(), isPrimary: true }];
};

export const mapAliasesFromPartyData = (
  aliases: Array<{ aliasGuid?: string | null; name?: string | null } | null> | null | undefined,
): Array<{ aliasGuid?: string; name: string }> => {
  const mapped =
    aliases
      ?.filter((a): a is NonNullable<typeof a> => a != null)
      .map((a) => ({ aliasGuid: a.aliasGuid ?? undefined, name: a.name ?? "" })) ?? [];
  return mapped.length ? mapped : [{ aliasGuid: undefined, name: "" }];
};

const pickAddressContactMethod = (address: Address, typeCode: string) =>
  address.contactMethods?.filter((cm) => cm?.typeCode === typeCode).find(Boolean) ?? undefined;

// an untouched row should not be saved
export const isDefaultAddress = (a: AddressFormValue): boolean =>
  !hasValue(a.addressName) &&
  !hasValue(a.address) &&
  !hasValue(a.city) &&
  !hasValue(a.postalCode) &&
  !hasValue(a.province) &&
  !hasValue(a.country);

// an untouched contact person should not be saved
export const isDefaultContact = (c: {
  person?: { firstName?: string | null; lastName?: string | null } | null;
  title?: string | null;
  contactMethods?: Array<{ value?: string | null } | null> | null;
  officeAddressGuids?: string[] | null;
}): boolean =>
  !hasValue(c.person?.firstName) &&
  !hasValue(c.person?.lastName) &&
  !hasValue(c.title) &&
  !(c.contactMethods ?? []).some((cm) => hasValue(cm?.value)) &&
  !(c.officeAddressGuids ?? []).length;

// keep guids so edits update the existing rows
const buildAddressContactMethods = (address: AddressFormValue) => {
  const methods = [];
  if (hasValue(address.phoneNumber))
    methods.push({
      ...(address.phoneNumberGuid ? { contactMethodGuid: address.phoneNumberGuid } : {}),
      typeCode: ContactMethods.PHONE,
      value: address.phoneNumber!.trim(),
      isPrimary: true,
    });
  if (hasValue(address.emailAddress))
    methods.push({
      ...(address.emailAddressGuid ? { contactMethodGuid: address.emailAddressGuid } : {}),
      typeCode: ContactMethods.EMAIL,
      value: address.emailAddress!.trim(),
      isPrimary: true,
    });
  return methods.length ? methods : undefined;
};

export const buildAddresses = (addresses: AddressFormValue[] | undefined) =>
  (addresses ?? [])
    .filter((address) => !isDefaultAddress(address))
    .map((address) => ({
      addressGuid: address.addressGuid,
      addressName: address.addressName?.trim() ?? "",
      address: address.address?.trim() || null,
      city: address.city?.trim() || null,
      province: address.province?.trim() || null,
      postalCode: address.postalCode?.trim() || null,
      country: address.country?.trim() || null,
      isPrimary: address.isPrimary ?? false,
      displayInInvestigation: address.displayInInvestigation ?? true,
      contactMethods: buildAddressContactMethods(address),
    }));

export const buildContactMethods = (
  phoneNumbers: ContactMethodFormValue[] | undefined,
  emailAddresses: ContactMethodFormValue[] | undefined,
  includeGuid: boolean,
) => {
  const methods = [];

  if (phoneNumbers) {
    methods.push(
      ...phoneNumbers
        .filter((p) => hasValue(p.value))
        .map((p) => ({
          ...(includeGuid && p.contactMethodGuid ? { contactMethodGuid: p.contactMethodGuid } : {}),
          typeCode: ContactMethods.PHONE,
          value: p.value ?? "",
          isPrimary: p.isPrimary ?? false,
        })),
    );
  }

  if (emailAddresses) {
    methods.push(
      ...emailAddresses
        .filter((e) => hasValue(e.value))
        .map((e) => ({
          ...(includeGuid && e.contactMethodGuid ? { contactMethodGuid: e.contactMethodGuid } : {}),
          typeCode: ContactMethods.EMAIL,
          value: e.value ?? "",
          isPrimary: e.isPrimary ?? false,
        })),
    );
  }

  return methods;
};

export const buildAliases = (
  aliases: Array<{ aliasGuid?: string; name?: string | null }> | undefined,
  includeGuid: boolean,
) =>
  (aliases ?? [])
    .filter((a) => hasValue(a.name))
    .map((a) => ({
      ...(includeGuid && a.aliasGuid ? { aliasGuid: a.aliasGuid } : {}),
      name: a.name!.trim(),
    }));

export const buildInvestigationContactPeople = (
  contacts: ContactPersonFormValue[] | undefined,
  isUpdate: boolean,
): any[] | undefined => {
  const built = (contacts ?? [])
    .filter((c) => !isDefaultContact(c))
    .map((c) => ({
      ...(isUpdate && c.businessPersonXrefGuid ? { businessPersonXrefGuid: c.businessPersonXrefGuid } : {}),
      person: {
        ...(isUpdate && c.person.personGuid ? { personGuid: c.person.personGuid } : {}),
        firstName: c.person.firstName || null,
        lastName: c.person.lastName || null,
      },
      title: c.title || null,
      displayInInvestigation: c.displayInInvestigation ?? true,
      isPrimary: c.isPrimary ?? false,
      contactMethods: (c.contactMethods ?? [])
        .filter((cm) => hasValue(cm.value))
        .map((cm) => ({
          ...(isUpdate && cm.contactMethodGuid ? { contactMethodGuid: cm.contactMethodGuid } : {}),
          typeCode: cm.typeCode ?? ContactMethods.PHONE,
          value: cm.value ?? "",
          isPrimary: cm.isPrimary ?? false,
        })),
      officeAddressGuids: c.officeAddressGuids ?? [],
    }));
  return built.length ? built : undefined;
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
  const missingNameIndex = addresses.findIndex((address) => !isDefaultAddress(address) && !address.addressName?.trim());
  if (missingNameIndex >= 0) {
    return "Address name is required.";
  }

  const contacts = (value.contacts as ContactPersonFormValue[] | undefined) ?? [];
  for (const contact of contacts) {
    if (isDefaultContact(contact)) continue;
    if (!contact.person?.firstName?.trim()) return "Contact first name is required.";
    if (!contact.person?.lastName?.trim()) return "Contact last name is required.";
  }

  return null;
};

// Shared base fields for person create/update.
export function buildPersonBase(value: any) {
  return {
    firstName: value.firstName,
    middleNames: value.middleNames?.trim() || null,
    lastName: value.lastName,
    dateOfBirth: value?.dateOfBirth ? new Date(value.dateOfBirth) : null,
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
    businessIdentifiers: buildIdentifiers(value.businessNumber, value.worksafeBCNumber),
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
  aliases: [{ aliasGuid: undefined, name: "" }] as Array<{ aliasGuid?: string; name: string }>,
  phoneNumbers: [createEmptyContactMethod(true)] as ContactMethodFormValue[],
  emailAddresses: [createEmptyContactMethod(true)] as ContactMethodFormValue[],
  addresses: [{ ...createEmptyAddress(), isPrimary: true }] as AddressFormValue[],
  contacts: [] as ContactPersonFormValue[],
});
