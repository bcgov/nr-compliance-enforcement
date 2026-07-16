import { InspectionParty, InvestigationParty, Party } from "@/generated/graphql";

export const getPartyName = (party: InvestigationParty | InspectionParty | Party): string => {
  if (party.person) {
    const { firstName, middleNames, lastName } = party.person;
    const givenNames = [firstName, middleNames].map((part) => part?.trim()).filter(Boolean).join(" ");
    const name = [lastName?.trim().toUpperCase(), givenNames].filter(Boolean).join(", ");
    if (name) return name;
  }
  if (party.business?.name) return party.business.name;
  if ("placeholderName" in party && party.placeholderName) return party.placeholderName;
  return "-";
};
