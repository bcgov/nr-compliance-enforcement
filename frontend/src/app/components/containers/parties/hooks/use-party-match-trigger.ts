import { useState, useCallback } from "react";
import { useStore } from "@tanstack/react-form";
import { PartyMatchInput } from "@/generated/graphql";
import { PartyTypeCodes } from "@/app/constants/party-types";
import { useMatchParty } from "@/app/components/containers/parties/hooks/use-party-match";
import { ContactMethods } from "@/app/constants/contact-methods";

// The person-type match fields. Each populated scalar counts as 1; phone and
// address each contribute at most 1 regardless of how many rows exist.
const MINIMUM_MATCH_FIELDS = 2;

const hasText = (value: unknown): boolean => typeof value === "string" && value.trim().length > 0;

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
  if (hasText(values.driversLicenseNumber)) {
    person.driversLicenseNumber = values.driversLicenseNumber.trim();
    populatedCount += 1;
  }

  // Phone: the first populated phone value contributes a single count and a single condition.
  const firstPhone = (values.phoneNumbers ?? []).find((p: { value?: string }) => hasText(p?.value));
  const contactMethods = firstPhone ? [{ typeCode: ContactMethods.PHONE, value: firstPhone.value.trim() }] : [];
  if (firstPhone) {
    populatedCount += 1;
  }

  // Address: the first populated address line contributes a single count and a single condition.
  const firstAddress = (values.addresses ?? []).find((a: { address?: string }) => hasText(a?.address));
  const addresses = firstAddress ? [{ address: firstAddress.address.trim() }] : [];
  if (firstAddress) {
    populatedCount += 1;
  }

  const input: PartyMatchInput = {
    partyTypeCode: PartyTypeCodes.PERSON,
    person,
    ...(contactMethods.length ? { contactMethods } : {}),
    ...(addresses.length ? { addresses } : {}),
  };

  return { input, populatedCount };
};

export const usePartyMatchTrigger = (form: any, isLinkedParty: boolean) => {
  const [enabled, setEnabled] = useState(false);

  const values = useStore(form.store, (state: any) => state.values);
  const { input, populatedCount } = buildPersonMatchInput(values);

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
