import { InvestigationBusiness, InvestigationParty } from "@/generated/graphql";
import { BusinessIdentifiers } from "@/app/constants/business-identifiers";

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

// Fields a party must have before an enforcement action can be logged against it
export const getPartyMissingFields = (party?: InvestigationParty | null): string[] => {
  if (!party) return [];
  const missing: string[] = [];
  if (party.person) {
    if (!party.person.firstName || !party.person.lastName) missing.push("first and last name");
    if (!party.person.dateOfBirth) missing.push("date of birth");
  } else if (party.business) {
    if (!party.business.name) missing.push("name");
    if (!getBusinessIdentifier(party.business, BusinessIdentifiers.BUSINESS_NUMBER)) missing.push("business number");
    if (!party.addresses?.some((addr) => addr?.isPrimary)) missing.push("address");
  }
  return missing;
};

export const isPartyProfileComplete = (party?: InvestigationParty | null): boolean =>
  !!party && getPartyMissingFields(party).length === 0;
