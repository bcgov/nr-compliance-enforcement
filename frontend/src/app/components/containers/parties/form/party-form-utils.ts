import {
  Address,
  BusinessIdentifier,
  BusinessPerson,
  BusinessPersonAddress,
  ContactMethod,
  CreateAttachmentReferenceInput,
  InvestigationBusinessIdentifier,
  InvestigationParty,
  InvestigationPersonFacialHairStyleCodeRef,
  Party,
  PersonFacialHairStyleCode,
  PersonInput,
  PersonUpdateInput,
} from "@/generated/graphql";
import { formatDateObjectAsString, parseUTCDateToLocal } from "@/app/common/date-utils";
import { ContactMethods } from "@/app/constants/contact-methods";
import { BusinessIdentifiers } from "@/app/constants/business-identifiers";
import { isValidEmail } from "@/app/common/validate-email";
import { v4 as uuidv4 } from "uuid";
import { PartyTypeCodes } from "@/app/constants/party-types";

export type ContactMethodFormValue = {
  contactMethodGuid?: string;
  contactMethodReference?: string;
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
  phoneNumberReference?: string;
  emailAddress?: string;
  emailAddressGuid?: string;
  emailAddressReference?: string;
  addressReference?: string;
};

export type ContactPersonFormValue = {
  businessPersonXrefGuid?: string;
  businessPersonXrefReference?: string;
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

// Shared mapper for business/investigation contact people (BusinessPerson | InvestigationBusinessPerson)
export const mapContactPeopleFromPartyData = (contactPeople: any): ContactPersonFormValue[] =>
  (contactPeople ?? [])
    .filter((cp: any) => cp != null)
    .map((cp: any): ContactPersonFormValue => {
      const methods = (cp.contactMethods ?? []).filter((cm: any) => cm != null);
      return {
        businessPersonXrefGuid: cp.businessPersonXrefGuid ?? undefined,
        business: { businessGuid: cp.business?.businessGuid ?? undefined },
        person: {
          personGuid: cp.person?.personGuid ?? undefined,
          firstName: cp.person?.firstName ?? "",
          lastName: cp.person?.lastName ?? "",
        },
        contactMethods: seedContactMethods(
          methods.map((cm: any) => ({
            contactMethodGuid: cm.contactMethodGuid ?? undefined,
            typeCode: cm.typeCode ?? undefined,
            value: cm.value ?? "",
            isPrimary: cm.isPrimary ?? methods.filter((m: any) => m.typeCode === cm.typeCode).indexOf(cm) === 0,
          })),
        ),
        title: cp.title ?? "",
        displayInInvestigation: cp.displayInInvestigation ?? true,
        isPrimary: cp.isPrimary ?? false,
        officeAddressGuids: (cp.associatedAddresses ?? [])
          .map((aa: any) => aa?.address?.addressGuid)
          .filter((guid: any): guid is string => !!guid),
      };
    });

const pickAddressContactMethod = (address: Address, typeCode: string) =>
  address.contactMethods?.filter((cm) => cm?.typeCode === typeCode).find(Boolean) ?? undefined;

// an untouched row should not be saved
export const isDefaultAddress = (a: AddressFormValue): boolean =>
  !hasValue(a.addressName) &&
  !hasValue(a.address) &&
  !hasValue(a.city) &&
  !hasValue(a.postalCode) &&
  !hasValue(a.province) &&
  !hasValue(a.country) &&
  !hasValue(a.phoneNumber) &&
  !hasValue(a.emailAddress);

// keep guids so edits update the existing rows
const buildAddressContactMethods = (address: AddressFormValue) => {
  const methods = [];
  if (hasValue(address.phoneNumber))
    methods.push({
      ...(address.phoneNumberGuid ? { contactMethodGuid: address.phoneNumberGuid } : {}),
      contactMethodReference: address.phoneNumberReference,
      typeCode: ContactMethods.PHONE,
      value: address.phoneNumber!.trim(),
      isPrimary: true,
    });
  if (hasValue(address.emailAddress))
    methods.push({
      ...(address.emailAddressGuid ? { contactMethodGuid: address.emailAddressGuid } : {}),
      contactMethodReference: address.emailAddressReference,
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
      addressReference: address.addressReference,
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
          ...(p.contactMethodReference ? { contactMethodReference: p.contactMethodReference } : {}),
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
          ...(e.contactMethodReference ? { contactMethodReference: e.contactMethodReference } : {}),
          typeCode: ContactMethods.EMAIL,
          value: e.value ?? "",
          isPrimary: e.isPrimary ?? false,
        })),
    );
  }

  return methods;
};

export const buildAliases = (
  aliases: Array<{ aliasGuid?: string; name?: string | null; aliasReference?: string }> | undefined,
  includeGuid: boolean,
) =>
  (aliases ?? [])
    .filter((a) => hasValue(a.name))
    .map((a) => ({
      ...(includeGuid && a.aliasGuid ? { aliasGuid: a.aliasGuid } : {}),
      name: a.name!.trim(),
      ...(a.aliasReference ? { aliasReference: a.aliasReference } : {}),
    }));

export const buildContactPeople = (
  contacts: ContactPersonFormValue[] | undefined,
  isUpdate: boolean,
): any[] | undefined => {
  const buildContactPersonGuid = (isUpdate: boolean, personGuid?: string) => {
    // If it is a create return nothing - there is no personGuid on the type
    if (!isUpdate) return {};
    // Otherwise return the personGuid if it exists, or create one
    return personGuid ? { personGuid } : { personGuid: uuidv4() };
  };

  const built = (contacts ?? []).map((c) => ({
    ...(isUpdate && c.businessPersonXrefGuid ? { businessPersonXrefGuid: c.businessPersonXrefGuid } : {}),
    ...(c.businessPersonXrefReference ? { businessPersonXrefReference: c.businessPersonXrefReference } : {}),
    person: {
      ...buildContactPersonGuid(isUpdate, c.person.personGuid),
      firstName: c.person.firstName?.trim() ?? "",
      lastName: c.person.lastName?.trim() ?? "",
    },
    title: c.title || null,
    displayInInvestigation: c.displayInInvestigation ?? true,
    isPrimary: c.isPrimary ?? false,
    contactMethods: (c.contactMethods ?? [])
      .filter((cm) => hasValue(cm.value))
      .map((cm) => ({
        ...(isUpdate && cm.contactMethodGuid ? { contactMethodGuid: cm.contactMethodGuid } : {}),
        ...(cm.contactMethodReference ? { contactMethodReference: cm.contactMethodReference } : {}),
        typeCode: cm.typeCode ?? ContactMethods.PHONE,
        value: cm.value ?? "",
        isPrimary: cm.isPrimary ?? false,
      })),
    officeAddressGuids: c.officeAddressGuids ?? [],
  }));
  return built.length ? built : undefined;
};

// Helper to build identifiers array
export const buildIdentifiers = (businessNumber: any, worksafeBCNumber: any, includeGuid: boolean) => {
  const identifiers = [];

  if (businessNumber?.identifierValue) {
    identifiers.push({
      ...(includeGuid && businessNumber.businessIdentifierGuid
        ? { businessIdentifierGuid: businessNumber.businessIdentifierGuid }
        : {}),
      ...(businessNumber.businessIdentifierGuid
        ? { businessIdentifierReference: businessNumber.businessIdentifierGuid }
        : {}),
      identifierCode: BusinessIdentifiers.BUSINESS_NUMBER,
      identifierValue: businessNumber.identifierValue,
    });
  }

  if (worksafeBCNumber?.identifierValue) {
    identifiers.push({
      ...(includeGuid && worksafeBCNumber.businessIdentifierGuid
        ? { businessIdentifierGuid: worksafeBCNumber.businessIdentifierGuid }
        : {}),
      ...(worksafeBCNumber.businessIdentifierGuid
        ? { businessIdentifierReference: worksafeBCNumber.businessIdentifierGuid }
        : {}),
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

  // only validate if there are multiple, a single empty item is allowed
  const addresses = (value.addresses as AddressFormValue[] | undefined) ?? [];
  const missingNameIndex = addresses.findIndex(
    (address) => (addresses.length > 1 || !isDefaultAddress(address)) && !address.addressName?.trim(),
  );
  if (missingNameIndex >= 0) {
    return "Address name is required.";
  }

  const contacts = (value.contacts as ContactPersonFormValue[] | undefined) ?? [];
  for (const contact of contacts) {
    if (!contact.person?.firstName?.trim()) return "Contact first name is required.";
    if (!contact.person?.lastName?.trim()) return "Contact last name is required.";
  }

  return null;
};

// at least one field must be entered
export const validatePersonForm = (value: any): string | null => {
  const hasSomeText = [
    value.firstName,
    value.middleNames,
    value.lastName,
    value.approximateAgeCode,
    value.driversLicenseNumber,
    value.driversLicenseClass,
    value.driversLicenseCountryCode,
    value.driversLicenseCountrySubdivisionCode,
    value.genderCode,
    value.sexCode,
    value.complexionCode,
    value.buildCode,
    value.hairColourCode,
    value.hairLengthCode,
    value.hairColourOther,
    value.eyeColourCode,
    value.eyeColourOther,
    value.additionalHairDescriptors,
    value.tattooDescription,
    value.additionalDescriptors,
    value.comments,
  ].some(hasValue);

  const hasSomeValue =
    !!value.dateOfBirth ||
    value.heightInCm != null ||
    value.weightInKg != null ||
    !!value.facialHairIndicator ||
    !!value.tattooIndicator ||
    !!value.safetyConcernIndicator ||
    (value.facialHairStyleCodes ?? []).length > 0 ||
    (value.aliases ?? []).some((a: any) => hasValue(a?.name)) ||
    (value.phoneNumbers ?? []).some((p: any) => hasValue(p?.value)) ||
    (value.emailAddresses ?? []).some((e: any) => hasValue(e?.value)) ||
    (value.addresses ?? []).some((a: AddressFormValue) => !isDefaultAddress(a));

  return hasSomeText || hasSomeValue ? null : "A party can't be saved without any identifying information.";
};

// Shared base fields for person create/update.
export function buildPersonBase(value: any) {
  return {
    firstName: value.firstName?.trim() ?? "",
    middleNames: value.middleNames?.trim() || null,
    lastName: value.lastName?.trim() ?? "",
    dateOfBirth: value?.dateOfBirth ? new Date(value.dateOfBirth) : null,
    approximateAgeCode: value.approximateAgeCode || null,
    driversLicenseNumber: value.driversLicenseNumber || null,
    driversLicenseClass: value.driversLicenseClass || null,
    driversLicenseCountryCode: value.driversLicenseCountryCode || null,
    driversLicenseCountrySubdivisionCode: value.driversLicenseCountrySubdivisionCode || null,
    genderCode: value.genderCode || null,
    sexCode: value.sexCode || null,
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
      value.facialHairStyleCodes?.map((fhs: any) => ({
        personFacialStyleHairCodeGuid: fhs.personFacialStyleHairCodeGuid,
        personGuid: fhs.personGuid,
        facialHairStyleCode: fhs.facialHairStyleCode,
        personFacialHairStyleCodeReference: fhs.personFacialHairStyleCodeReference,
      })) || [],
    additionalHairDescriptors: value.additionalHairDescriptors || null,
    comments: value.comments || null,
    tattooIndicator: value.tattooIndicator || null,
    tattooDescription: value.tattooDescription || null,
    additionalDescriptors: value.additionalDescriptors || null,
    safetyConcernIndicator: value.safetyConcernIndicator || null,
    safetyConcernReason: value.safetyConcernReason || null,
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
    name: value.businessName?.trim(),
    businessIdentifiers: buildIdentifiers(value.businessNumber, value.worksafeBCNumber, true),
    safetyConcernIndicator: value.businessSafetyConcernIndicator || null,
    safetyConcernReason: value.businessSafetyConcernReason || null,
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
  sexCode: "",
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
  safetyConcernIndicator: "",
  safetyConcernReason: "",
  comments: "",
  tattooIndicator: "",
  tattooDescription: "",
  additionalDescriptors: "",
  businessName: "",
  businessSafetyConcernIndicator: "" as any,
  businessSafetyConcernReason: "",
  businessNumber: {} as any,
  worksafeBCNumber: {} as any,
  aliases: [{ aliasGuid: undefined, name: "" }] as Array<{ aliasGuid?: string; name: string }>,
  phoneNumbers: [createEmptyContactMethod(true)] as ContactMethodFormValue[],
  emailAddresses: [createEmptyContactMethod(true)] as ContactMethodFormValue[],
  addresses: [{ ...createEmptyAddress(), isPrimary: true }] as AddressFormValue[],
  contacts: [] as ContactPersonFormValue[],
});

export const mapInvestigationPartyToDefaultValues = (
  editParty: InvestigationParty,
  { mapContacts = false }: { mapContacts?: boolean } = {},
) => ({
  partyType: editParty.partyTypeCode || "",
  personGuid: editParty.person?.personGuid || "",
  firstName: editParty.person?.firstName || "",
  middleNames: editParty.person?.middleNames || "",
  lastName: editParty.person?.lastName || "",
  dateOfBirth: editParty.person?.dateOfBirth
    ? formatDateObjectAsString(parseUTCDateToLocal(editParty.person.dateOfBirth), { format: "date" })
    : undefined,
  approximateAgeCode: editParty.person?.approximateAgeCode || "",
  driversLicenseNumber: editParty.person?.driversLicenseNumber || null,
  driversLicenseClass: editParty.person?.driversLicenseClass || null,
  driversLicenseCountryCode: editParty.person?.driversLicenseCountryCode || null,
  driversLicenseCountrySubdivisionCode: editParty.person?.driversLicenseCountrySubdivisionCode || null,
  genderCode: editParty.person?.genderCode || "",
  sexCode: editParty.person?.sexCode || "",
  heightInCm: editParty.person?.heightInCm || null,
  weightInKg: editParty.person?.weightInKg || null,
  complexionCode: editParty.person?.complexionCode || "",
  buildCode: editParty.person?.buildCode || "",
  hairColourCode: editParty.person?.hairColourCode || "",
  hairLengthCode: editParty.person?.hairLengthCode || "",
  hairColourOther: editParty.person?.hairColourOther || null,
  eyeColourCode: editParty.person?.eyeColourCode || "",
  eyeColourOther: editParty.person?.eyeColourOther || null,
  facialHairIndicator: editParty.person?.facialHairIndicator || null,
  facialHairStyleCodes: (editParty.person?.facialHairStyleCodes ?? [])
    .filter((fhs): fhs is InvestigationPersonFacialHairStyleCodeRef => fhs != null)
    .map((fhs) => ({
      personFacialStyleHairCodeGuid: fhs.personFacialStyleHairCodeGuid,
      personGuid: fhs.personGuid,
      facialHairStyleCode: fhs.facialHairStyleCode,
      personFacialHairStyleCodeReference: fhs.personFacialHairStyleCodeReference,
    })),
  additionalHairDescriptors: editParty.person?.additionalHairDescriptors || null,
  tattooIndicator: editParty.person?.tattooIndicator || null,
  tattooDescription: editParty.person?.tattooDescription || null,
  additionalDescriptors: editParty.person?.additionalDescriptors || null,
  comments: editParty.person?.comments || null,
  safetyConcernIndicator: editParty.person?.safetyConcernIndicator || null,
  safetyConcernReason: editParty.person?.safetyConcernReason || null,
  businessSafetyConcernIndicator: editParty.business?.safetyConcernIndicator || null,
  businessSafetyConcernReason: editParty.business?.safetyConcernReason || null,
  businessName: editParty.business?.name || "",
  businessNumber: (() => {
    const found = (editParty.business?.businessIdentifiers ?? [])
      .filter((bi): bi is InvestigationBusinessIdentifier => bi != null)
      .find((bi) => bi.identifierCode === BusinessIdentifiers.BUSINESS_NUMBER);
    return found
      ? { businessIdentifierGuid: found.businessIdentifierGuid, identifierValue: found.identifierValue }
      : { identifierValue: "" };
  })(),
  worksafeBCNumber: (() => {
    const found = (editParty.business?.businessIdentifiers ?? [])
      .filter((bi): bi is InvestigationBusinessIdentifier => bi != null)
      .find((bi) => bi.identifierCode === BusinessIdentifiers.WSBC_NUMBER);
    return found
      ? { businessIdentifierGuid: found.businessIdentifierGuid, identifierValue: found.identifierValue }
      : {};
  })(),
  aliases: mapAliasesFromPartyData(editParty.aliases),
  phoneNumbers: mapContactMethodsFromPartyData(editParty.contactMethods, ContactMethods.PHONE),
  emailAddresses: mapContactMethodsFromPartyData(editParty.contactMethods, ContactMethods.EMAIL),
  addresses: mapAddressesFromPartyData(editParty.addresses as Address[]),
  contacts: mapContacts
    ? mapContactPeopleFromPartyData(editParty.business?.contactPeople)
    : ([] as ContactPersonFormValue[]),
  partyAssociationRole: editParty.partyAssociationRole || "",
});

/** Finds a business identifier value by code on the source party. */
const findIdentifierValue = (party: Party, code: string) =>
  (party.business?.businessIdentifiers ?? [])
    .filter((bi): bi is BusinessIdentifier => bi != null)
    .find((bi) => bi.identifierCode === code)?.identifierValue;

const findIdentifierGuid = (party: Party, code: string) =>
  (party.business?.businessIdentifiers ?? [])
    .filter((bi): bi is BusinessIdentifier => bi != null)
    .find((bi) => bi.identifierCode === code)?.businessIdentifierGuid;

/** Maps a published business contact person onto the form-value shape buildContactPeople expects. */
const mapCopyContactPerson = (
  contact: BusinessPerson,
  addressGuidMap: Map<string, string>,
): ContactPersonFormValue => ({
  business: {},
  person: {
    firstName: contact.person?.firstName ?? "",
    lastName: contact.person?.lastName ?? "",
  },
  contactMethods: (contact.contactMethods ?? [])
    .filter((cm): cm is ContactMethod => cm != null)
    .map((cm) => ({
      typeCode: cm.typeCode ?? ContactMethods.PHONE,
      value: cm.value ?? "",
      isPrimary: cm.isPrimary ?? false,
      contactMethodReference: cm.contactMethodGuid ?? undefined,
    })),
  title: contact.title ?? "",
  displayInInvestigation: contact.displayInInvestigation ?? true,
  isPrimary: contact.isPrimary ?? false,
  businessPersonXrefReference: contact.businessPersonXrefGuid ?? undefined,
  // Office associations are re-pointed at the copied addresses. Source addresses that weren't
  // copied resolve to nothing and drop out rather than pointing at the source party's rows.
  officeAddressGuids: (contact.associatedAddresses ?? [])
    .filter((aa): aa is BusinessPersonAddress => aa != null)
    .map((aa) => addressGuidMap.get(aa.address?.addressGuid ?? ""))
    .filter((guid): guid is string => !!guid),
});

const buildPersonCopy = (party: Party, copiedAddresses: AddressFormValue[]) => {
  const personBase = buildPersonBase(party.person);

  const facialHairStyleCodes = personBase.facialHairStyleCodes.map((fhs: PersonFacialHairStyleCode) => ({
    ...fhs,
    personFacialStyleHairCodeGuid: undefined,
    personFacialHairStyleCodeReference: fhs.personFacialStyleHairCodeGuid,
    personGuid: undefined,
  }));

  return {
    partyTypeCode: PartyTypeCodes.PERSON,
    person: {
      ...personBase,
      facialHairStyleCodes,
      personReference: party.person?.personGuid,
    },
    addresses: buildAddresses(
      copiedAddresses.map((a) => ({
        ...a,
        addressGuid: undefined,
        addressReference: a.addressGuid,
        phoneNumberGuid: undefined,
        phoneNumberReference: a.phoneNumberGuid,
        emailAddressGuid: undefined,
        emailAddressReference: a.emailAddressGuid,
      })),
    ),
  };
};

const buildBusinessCopy = (party: Party, copiedAddresses: AddressFormValue[]) => {
  // Copied addresses get client-generated GUIDs so contact office associations can point at the
  // copies rather than the source party's addresses.
  const addressGuidMap = new Map<string, string>();

  const addresses = copiedAddresses.map((a) => {
    const copiedAddressGuid = uuidv4();
    if (a.addressGuid) {
      addressGuidMap.set(a.addressGuid, copiedAddressGuid);
    }
    return {
      ...a,
      addressGuid: copiedAddressGuid,
      addressReference: a.addressGuid,
      phoneNumberGuid: undefined,
      phoneNumberReference: a.phoneNumberGuid,
      emailAddressGuid: undefined,
      emailAddressReference: a.emailAddressGuid,
    };
  });

  const contacts = (party.business?.contactPeople ?? [])
    .filter((cp): cp is BusinessPerson => cp != null)
    .map((cp) => mapCopyContactPerson(cp, addressGuidMap));

  return {
    partyTypeCode: PartyTypeCodes.BUSINESS,
    business: {
      name: party.business?.name ?? "",
      businessReference: party.business?.businessGuid,
      businessIdentifiers: buildIdentifiers(
        {
          identifierValue: findIdentifierValue(party, BusinessIdentifiers.BUSINESS_NUMBER),
          businessIdentifierGuid: findIdentifierGuid(party, BusinessIdentifiers.BUSINESS_NUMBER),
        },
        {
          identifierValue: findIdentifierValue(party, BusinessIdentifiers.WSBC_NUMBER),
          businessIdentifierGuid: findIdentifierGuid(party, BusinessIdentifiers.WSBC_NUMBER),
        },
        false,
      ),
      contactPeople: buildContactPeople(contacts, false),
    },
    addresses: buildAddresses(addresses),
  };
};

/**
 * Maps a full published Party (from findOne) into a CreateInvestigationPartyInput for copying a
 * matched party into an investigation. Reuses the existing build/map helpers and applies the copy
 * rules: fresh child rows (no source GUIDs carried over) and party/person/business level references
 * linking the copy back to the published profile.
 */
export const mapPartyToInvestigationPartyInput = (
  party: Party,
  partyAssociationRole: string,
  attachmentReferences?: CreateAttachmentReferenceInput[],
) => {
  console.log(party);
  const aliases = mapAliasesFromPartyData(party.aliases)
    .filter((a) => a.name.trim().length > 0)
    .map((a) => ({ name: a.name, aliasReference: a.aliasGuid }));

  const phoneNumbers = mapContactMethodsFromPartyData(party.contactMethods, ContactMethods.PHONE)
    .filter((c) => (c.value ?? "").trim().length > 0)
    .map((c) => ({ ...c, contactMethodReference: c.contactMethodGuid, contactMethodGuid: undefined }));

  const emailAddresses = mapContactMethodsFromPartyData(party.contactMethods, ContactMethods.EMAIL)
    .filter((c) => (c.value ?? "").trim().length > 0)
    .map((c) => ({ ...c, contactMethodReference: c.contactMethodGuid, contactMethodGuid: undefined }));

  const copiedAddresses = mapAddressesFromPartyData(party.addresses as Address[]).filter(
    (a) => (a.address ?? "").trim().length > 0 || (a.city ?? "").trim().length > 0,
  );

  const common = {
    partyReference: party.partyIdentifier,
    partyAssociationRole,
    attachmentReferences,
    aliases: buildAliases(aliases, false),
    contactMethods: buildContactMethods(phoneNumbers, emailAddresses, false),
  };

  if (party.partyTypeCode === PartyTypeCodes.BUSINESS) {
    return { ...common, ...buildBusinessCopy(party, copiedAddresses) };
  }

  return { ...common, ...buildPersonCopy(party, copiedAddresses) };
};
