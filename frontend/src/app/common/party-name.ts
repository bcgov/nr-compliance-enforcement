import { InspectionParty, InvestigationParty, Party } from "@/generated/graphql";

export const getPartyName = (party?: InvestigationParty | InspectionParty | Party | null): string => {
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
  if ("placeholderName" in party && party.placeholderName) return party.placeholderName;
  return "-";
};

export const isPartyProfileComplete = (party?: InvestigationParty | null): boolean => {
  if (!party) return false;
  const primaryAddress = party.addresses?.find((addr) => addr?.isPrimary);
  if (party.person) {
    const rawDob = party.person?.dateOfBirth;
    const rawPhone = party.contactMethods?.find((m) => m?.typeCode === "PHONE")?.value;
    return !!primaryAddress && !!rawPhone && !!rawDob;
  } else {
    return !!primaryAddress;
  }
};
