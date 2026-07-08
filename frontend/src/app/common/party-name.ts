import { InspectionParty, InvestigationParty, Party } from "@/generated/graphql";

export const getPartyName = (party: InvestigationParty | InspectionParty | Party): string => {
  if (party.__typename === "InvestigationParty" && party.placeholderName) return party.placeholderName;
  if (party.person) {
    const { firstName, lastName } = party.person;
    return [lastName, firstName].filter(Boolean).join(", ");
  }
  if (party.business) return party.business.name ?? "";
  return "-";
};
