import { InvestigationAddress, InvestigationBusiness, InvestigationParty } from "@/generated/graphql";

type PartyNameParts = {
  person?: { firstName?: string | null; middleNames?: string | null; lastName?: string | null } | null;
  business?: { name?: string | null } | null;
  placeholderName?: string | null;
};

export const getPartyName = (party?: PartyNameParts | null): string => {
  if (!party) return "Unknown party";
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

export const getBusinessIdentifier = (business: InvestigationBusiness, identifierCode: string): string =>
  (business.businessIdentifiers ?? []).find((id) => id?.identifierCode === identifierCode)?.identifierValue ?? "";

// An address counts toward minimum info when it has a name, address line 1 and country
export const hasCompleteAddress = (address?: InvestigationAddress | null): boolean =>
  !!(address?.addressName?.trim() && address?.address?.trim() && address?.country?.trim());

// Fields a party must have before an enforcement action can be logged against it
export const getPartyMissingFields = (party?: InvestigationParty | null): string[] => {
  if (!party) return [];
  const missing: string[] = [];
  if (party.person) {
    if (!party.person.firstName || !party.person.lastName) missing.push("first and last name");
    if (!party.person.dateOfBirth) missing.push("date of birth");
  } else if (party.business) {
    if (!party.business.name?.trim()) missing.push("legal name");
    if (!party.addresses?.some(hasCompleteAddress)) missing.push("address");
  }
  return missing;
};

export const isPartyProfileComplete = (party?: InvestigationParty | null): boolean =>
  !!party && getPartyMissingFields(party).length === 0;
