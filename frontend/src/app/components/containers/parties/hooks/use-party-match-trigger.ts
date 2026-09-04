import { useState, useCallback, useEffect, useRef } from "react";
import { useStore } from "@tanstack/react-form";
import { BusinessIdentifierMatchInput, BusinessPersonMatchInput, PartyMatchInput } from "@/generated/graphql";
import { PartyTypeCodes } from "@/app/constants/party-types";
import { useMatchParty } from "@/app/components/containers/parties/hooks/use-party-match";
import { ContactMethods } from "@/app/constants/contact-methods";
import { BusinessIdentifiers } from "@/app/constants/business-identifiers";
import {
  AddressFormValue,
  ContactMethodFormValue,
  ContactPersonFormValue,
} from "@/app/components/containers/parties/form/party-form-utils";

// Only fields the backend can search on count towards the minimum
const MINIMUM_MATCH_FIELDS = 1;

// Trailing delay after the last value change.
const MATCH_DEBOUNCE_MS = 2000;

const hasText = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

const pickContactValue = (methods: ContactMethodFormValue[] | undefined): string | undefined =>
  (methods ?? []).find((cm) => hasText(cm?.value))?.value?.trim();

const pickContactValueByType = (methods: ContactMethodFormValue[] | undefined, typeCode: string): string | undefined =>
  (methods ?? []).find((cm) => cm?.typeCode === typeCode && hasText(cm?.value))?.value?.trim();

const buildMatchAddress = (address: AddressFormValue) => ({
  ...(hasText(address.address) ? { address: address.address.trim() } : {}),
  ...(hasText(address.city) ? { city: address.city.trim() } : {}),
  ...(hasText(address.province) ? { province: address.province.trim() } : {}),
  ...(hasText(address.postalCode) ? { postalCode: address.postalCode.trim() } : {}),
  ...(hasText(address.country) ? { country: address.country.trim() } : {}),
});

/**
 * Builds the shared party-level match conditions (phone, email, address) common to both person and
 * business searches. Each of phone, email and address contributes at most 1 to the count, regardless
 * of how many rows exist. Postal code only counts for people — it is unscored for businesses.
 * Returns the partial input fragment plus the count those fields contribute.
 */
const buildSharedMatchFields = (
  values: any,
  countPostalCode: boolean,
): {
  contactMethods: PartyMatchInput["contactMethods"];
  addresses: PartyMatchInput["addresses"];
  populatedCount: number;
} => {
  let populatedCount = 0;
  const contactMethods: NonNullable<PartyMatchInput["contactMethods"]> = [];

  const phone = pickContactValue(values.phoneNumbers);
  if (phone) {
    contactMethods.push({ typeCode: ContactMethods.PHONE, value: phone });
    populatedCount += 1;
  }

  const email = pickContactValue(values.emailAddresses);
  if (email) {
    contactMethods.push({ typeCode: ContactMethods.EMAIL, value: email });
    populatedCount += 1;
  }

  const addresses: NonNullable<PartyMatchInput["addresses"]> = [];
  const firstAddress = (values.addresses ?? []).find(
    (a: AddressFormValue) =>
      hasText(a?.address) || hasText(a?.city) || hasText(a?.province) || hasText(a?.postalCode) || hasText(a?.country),
  );

  if (firstAddress) {
    addresses.push(buildMatchAddress(firstAddress));
    if (hasText(firstAddress.address)) {
      populatedCount += 1;
    }
    if (countPostalCode && hasText(firstAddress.postalCode)) {
      populatedCount += 1;
    }
    if (hasText(firstAddress.city) || hasText(firstAddress.province) || hasText(firstAddress.country)) {
      populatedCount += 1;
    }
  }

  return { contactMethods, addresses, populatedCount };
};

// Searched together then scored field by field
const buildPersonDescriptors = (values: any): NonNullable<PartyMatchInput["person"]> => {
  const person: NonNullable<PartyMatchInput["person"]> = {};
  if (hasText(values.approximateAgeCode)) person.approximateAgeCode = values.approximateAgeCode;
  if (hasText(values.genderCode)) person.genderCode = values.genderCode;
  if (hasText(values.sexCode)) person.sexCode = values.sexCode;
  if (values.heightInCm != null) person.heightInCm = values.heightInCm;
  if (values.weightInKg != null) person.weightInKg = values.weightInKg;
  if (hasText(values.complexionCode)) person.complexionCode = values.complexionCode;
  if (hasText(values.buildCode)) person.buildCode = values.buildCode;
  if (hasText(values.hairColourCode)) person.hairColourCode = values.hairColourCode;
  if (hasText(values.hairLengthCode)) person.hairLengthCode = values.hairLengthCode;
  if (hasText(values.eyeColourCode)) person.eyeColourCode = values.eyeColourCode;
  if (values.facialHairIndicator === true) person.facialHairIndicator = true;
  if (values.tattooIndicator === true) person.tattooIndicator = true;
  return person;
};

/**
 * Builds the person branch of the match input from the form's live values, including
 * only fields that carry a value. Returns the input plus the count of populated
 * match-fields so the caller can enforce the minimum threshold.
 */
const buildPersonMatchInput = (values: any): { input: PartyMatchInput; populatedCount: number } => {
  const person: NonNullable<PartyMatchInput["person"]> = {};
  let populatedCount = 0;

  if (hasText(values.firstName)) {
    person.firstName = values.firstName.trim();
    populatedCount += 1;
  }
  if (hasText(values.middleNames)) {
    person.middleNames = values.middleNames.trim();
    populatedCount += 1;
  }
  if (hasText(values.lastName)) {
    person.lastName = values.lastName.trim();
    populatedCount += 1;
  }
  if (values.dateOfBirth) {
    person.dateOfBirth = values.dateOfBirth;
    populatedCount += 1;
  }
  if (hasText(values.driversLicenseNumber)) {
    person.driversLicenseNumber = values.driversLicenseNumber.trim();
    populatedCount += 1;
  }

  const descriptors = buildPersonDescriptors(values);
  Object.assign(person, descriptors);
  // genderCode does not score currently
  if (Object.keys(descriptors).some((key) => key !== "genderCode")) {
    populatedCount += 1;
  }

  const shared = buildSharedMatchFields(values, true);
  populatedCount += shared.populatedCount;

  const input: PartyMatchInput = {
    partyTypeCode: PartyTypeCodes.PERSON,
    person,
    ...(shared.contactMethods?.length ? { contactMethods: shared.contactMethods } : {}),
    ...(shared.addresses?.length ? { addresses: shared.addresses } : {}),
  };

  return { input, populatedCount };
};

/**
 * Builds the business's contact people from the form's value
 */
const buildContactPeopleMatchInput = (
  contacts: ContactPersonFormValue[] | undefined,
): { contactPeople: BusinessPersonMatchInput[]; populatedCount: number } => {
  const contactPeople: BusinessPersonMatchInput[] = [];
  let populatedCount = 0;

  for (const contact of contacts ?? []) {
    const contactPerson: BusinessPersonMatchInput = {};
    const contactMethods: NonNullable<BusinessPersonMatchInput["contactMethods"]> = [];

    const firstName = contact.person?.firstName?.trim();
    if (firstName) {
      contactPerson.firstName = firstName;
      populatedCount += 1;
    }

    const lastName = contact.person?.lastName?.trim();
    if (lastName) {
      contactPerson.lastName = lastName;
      populatedCount += 1;
    }

    const phone = pickContactValueByType(contact.contactMethods, ContactMethods.PHONE);
    if (phone) {
      contactMethods.push({ typeCode: ContactMethods.PHONE, value: phone });
      populatedCount += 1;
    }

    const email = pickContactValueByType(contact.contactMethods, ContactMethods.EMAIL);
    if (email) {
      contactMethods.push({ typeCode: ContactMethods.EMAIL, value: email });
      populatedCount += 1;
    }

    if (contactMethods.length) {
      contactPerson.contactMethods = contactMethods;
    }
    if (Object.keys(contactPerson).length) {
      contactPeople.push(contactPerson);
    }
  }

  return { contactPeople, populatedCount };
};

/**
 * Builds the business branch of the match input from the form's live values, including only
 * fields that carry a value. Business match-fields: legal name, business and WorkSafeBC numbers,
 * contact people, and the shared party-level phone, email and address line. Returns the input plus
 * the count of populated match-fields so the caller can enforce the minimum threshold.
 */
const buildBusinessMatchInput = (values: any): { input: PartyMatchInput; populatedCount: number } => {
  const business: NonNullable<PartyMatchInput["business"]> = {};
  let populatedCount = 0;

  if (hasText(values.businessName)) {
    business.name = values.businessName.trim();
    populatedCount += 1;
  }

  // Business and WorkSafeBC numbers each live in their form value's identifierValue.
  const businessIdentifiers: BusinessIdentifierMatchInput[] = [];
  const businessNumberValue = values.businessNumber?.identifierValue;
  if (hasText(businessNumberValue)) {
    businessIdentifiers.push({
      identifierCode: BusinessIdentifiers.BUSINESS_NUMBER,
      identifierValue: businessNumberValue.trim(),
    });
    populatedCount += 1;
  }
  const worksafeBCNumberValue = values.worksafeBCNumber?.identifierValue;
  if (hasText(worksafeBCNumberValue)) {
    businessIdentifiers.push({
      identifierCode: BusinessIdentifiers.WSBC_NUMBER,
      identifierValue: worksafeBCNumberValue.trim(),
    });
    populatedCount += 1;
  }
  if (businessIdentifiers.length) {
    business.businessIdentifiers = businessIdentifiers;
  }

  const contacts = buildContactPeopleMatchInput(values.contacts);
  populatedCount += contacts.populatedCount;
  if (contacts.contactPeople.length) {
    business.contactPeople = contacts.contactPeople;
  }

  const shared = buildSharedMatchFields(values, false);
  populatedCount += shared.populatedCount;

  // The organization form captures phone and email on its addresses, not in their own sections
  const contactMethods = [...(shared.contactMethods ?? [])];
  const officePhones = (values.addresses ?? []).filter((a: AddressFormValue) => hasText(a?.phoneNumber));
  for (const address of officePhones) {
    contactMethods.push({ typeCode: ContactMethods.PHONE, value: address.phoneNumber.trim() });
  }
  if (officePhones.length) {
    populatedCount += 1;
  }
  const officeEmails = (values.addresses ?? []).filter((a: AddressFormValue) => hasText(a?.emailAddress));
  for (const address of officeEmails) {
    contactMethods.push({ typeCode: ContactMethods.EMAIL, value: address.emailAddress.trim() });
  }
  if (officeEmails.length) {
    populatedCount += 1;
  }

  const input: PartyMatchInput = {
    partyTypeCode: PartyTypeCodes.BUSINESS,
    business,
    ...(contactMethods.length ? { contactMethods } : {}),
    ...(shared.addresses?.length ? { addresses: shared.addresses } : {}),
  };

  return { input, populatedCount };
};

export const usePartyMatchTrigger = (form: any, isLinkedParty: boolean) => {
  const [dispatchedInput, setDispatchedInput] = useState<PartyMatchInput>();

  const values = useStore(form.store, (state: any) => state.values);
  const { input, populatedCount } =
    values.partyType === PartyTypeCodes.BUSINESS ? buildBusinessMatchInput(values) : buildPersonMatchInput(values);

  const timer = useRef<ReturnType<typeof setTimeout>>();
  const pendingInput = useRef<PartyMatchInput>();

  pendingInput.current = !isLinkedParty && populatedCount >= MINIMUM_MATCH_FIELDS ? input : undefined;

  const dispatchMatch = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = undefined;
    if (pendingInput.current) {
      setDispatchedInput(pendingInput.current);
    }
  }, []);

  const serializedInput = JSON.stringify(input);
  const previousInput = useRef(serializedInput);

  // Re-arm the timer on each value change, but only if the input has changed.
  useEffect(() => {
    if (serializedInput === previousInput.current) {
      return;
    }
    previousInput.current = serializedInput;
    timer.current = setTimeout(dispatchMatch, MATCH_DEBOUNCE_MS);
    return () => clearTimeout(timer.current);
  }, [serializedInput, dispatchMatch]);

  // Fires the armed match search without waiting out the delay.
  const handleFieldBlur = useCallback(() => {
    if (timer.current) {
      dispatchMatch();
    }
  }, [dispatchMatch]);

  const { data, isFetching, isSuccess, error } = useMatchParty(dispatchedInput, !!dispatchedInput);

  return {
    matches: data?.matchParty ?? [],
    isFetching,
    hasSearched: isSuccess,
    error,
    handleFieldBlur,
  };
};
