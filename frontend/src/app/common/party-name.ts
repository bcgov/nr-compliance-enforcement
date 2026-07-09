import { InspectionParty, InvestigationParty, Party } from "@/generated/graphql";

export const getPartyName = (party: InvestigationParty | InspectionParty | Party): string => {
  if (party.person) {
    const { firstName, lastName } = party.person;
    const name = [lastName, firstName].filter(Boolean).join(", ");
    console.log(name);
    if (name) return name;
  }
  if (party.business?.name) return party.business.name;
  if ("placeholderName" in party && party.placeholderName) return party.placeholderName;
  return "-";
};
