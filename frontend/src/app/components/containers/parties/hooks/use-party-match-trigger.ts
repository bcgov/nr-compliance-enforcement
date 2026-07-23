import { useState, useCallback } from "react";
import { useStore } from "@tanstack/react-form";
import { PartyMatchInput } from "@/generated/graphql";
import { PartyTypeCodes } from "@/app/constants/party-types";
import { useMatchParty } from "@/app/components/containers/parties/hooks/use-party-match";
import { ContactMethods } from "@/app/constants/contact-methods";
import { BusinessIdentifiers } from "@/app/constants/business-identifiers";

// The person-type match fields. Each populated scalar counts as 1; phone and
// address each contribute at most 1 regardless of how many rows exist.
const MINIMUM_MATCH_FIELDS = 2;

const hasText = (value: unknown): boolean => typeof value === "string" && value.trim().length > 0;

/**
 * Builds the shared party-level match conditions (phone, address line) common to both person and
 * business searches. Each of phone and address contributes at most 1 to the count, regardless of
 * how many rows exist. Returns the partial input fragment plus the count those fields contribute.
 */
const buildSharedMatchFields = (
  values: any,
): {
  contactMethods: PartyMatchInput["contactMethods"];
  addresses: PartyMatchInput["addresses"];
  populatedCount: number;
} => {
  let populatedCount = 0;

  const firstPhone = (values.phoneNumbers ?? []).find((p: { value?: string }) => hasText(p?.value));
  const contactMethods = firstPhone ? [{ typeCode: ContactMethods.PHONE, value: firstPhone.value.trim() }] : [];
  if (firstPhone) {
    populatedCount += 1;
  }

  const firstAddress = (values.addresses ?? []).find((a: { address?: string }) => hasText(a?.address));
  const addresses = firstAddress ? [{ address: firstAddress.address.trim() }] : [];
  if (firstAddress) {
    populatedCount += 1;
  }

  return { contactMethods, addresses, populatedCount };
};

/**
 * Builds the person branch of the match input from the form's live values, including
 * only fields that carry a value. Returns the input plus the count of populated
 * match-fields so the caller can enforce the minimum-two threshold.
 */
const buildPersonMatchInput = (values: any): { input: PartyMatchInput; populatedCount: number } => {
  const person: NonNullable<PartyMatchInput["person"]> = {};
  let populatedCount = 0;

  if (hasText(values.firstName)) {
    person.firstName = values.firstName.trim();
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
  if (hasText(values.genderCode)) {
    person.genderCode = values.genderCode;
    populatedCount += 1;
  }
  if (hasText(values.sexCode)) {
    person.sexCode = values.sexCode;
    populatedCount += 1;
  }
  if (hasText(values.driversLicenseNumber)) {
    person.driversLicenseNumber = values.driversLicenseNumber.trim();
    populatedCount += 1;
  }

  const shared = buildSharedMatchFields(values);
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
 * Builds the business branch of the match input from the form's live values, including only
 * fields that carry a value. Business match-fields: business name, business number, and the
 * shared party-level phone and address line. Returns the input plus the count of populated
 * match-fields so the caller can enforce the minimum-two threshold.
 */
const buildBusinessMatchInput = (values: any): { input: PartyMatchInput; populatedCount: number } => {
  const business: NonNullable<PartyMatchInput["business"]> = {};
  let populatedCount = 0;

  if (hasText(values.businessName)) {
    business.name = values.businessName.trim();
    populatedCount += 1;
  }

  // Business number lives in the businessNumber form value's identifierValue.
  const businessNumberValue = values.businessNumber?.identifierValue;
  if (hasText(businessNumberValue)) {
    business.businessIdentifiers = [
      { identifierCode: BusinessIdentifiers.BUSINESS_NUMBER, identifierValue: businessNumberValue.trim() },
    ];
    populatedCount += 1;
  }

  const shared = buildSharedMatchFields(values);
  populatedCount += shared.populatedCount;

  const input: PartyMatchInput = {
    partyTypeCode: PartyTypeCodes.BUSINESS,
    business,
    ...(shared.contactMethods?.length ? { contactMethods: shared.contactMethods } : {}),
    ...(shared.addresses?.length ? { addresses: shared.addresses } : {}),
  };

  return { input, populatedCount };
};

export const usePartyMatchTrigger = (form: any, isLinkedParty: boolean) => {
  const [enabled, setEnabled] = useState(false);

  const values = useStore(form.store, (state: any) => state.values);
  const { input, populatedCount } =
    values.partyType === PartyTypeCodes.BUSINESS ? buildBusinessMatchInput(values) : buildPersonMatchInput(values);

  // Called from each match-field's onBlur. Enables the query once the threshold is met;
  // disables it again if the user has cleared fields back below the minimum.
  const handleFieldBlur = useCallback(() => {
    setEnabled(!isLinkedParty && populatedCount >= MINIMUM_MATCH_FIELDS);
  }, [isLinkedParty, populatedCount]);

  const { data, isLoading, error } = useMatchParty(input, enabled);

  return {
    matches: data?.matchParty ?? [],
    isLoading,
    error,
    handleFieldBlur,
  };
};
