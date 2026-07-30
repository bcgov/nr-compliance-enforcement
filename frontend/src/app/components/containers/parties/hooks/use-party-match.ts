// use-match-party.ts
import { useGraphQLQuery } from "@graphql/hooks";
import { gql } from "graphql-request";
import { Party, PartyMatchInput } from "@/generated/graphql";

const MATCH_PARTY = gql`
  query MatchParty($input: PartyMatchInput!) {
    matchParty(input: $input) {
      __typename
      partyIdentifier
      partyTypeCode
      shortDescription
      longDescription
      createdDateTime
      aliases {
        name
      }
      contactMethods {
        typeCode
        value
        isPrimary
      }
      addresses {
        addressName
        address
        city
        province
        isPrimary
      }
      person {
        personGuid
        firstName
        middleNames
        lastName
        dateOfBirth
        genderCode
        sexCode
        approximateAgeCode
      }
      business {
        businessGuid
        name
        businessIdentifiers {
          identifierValue
          identifierCode
        }
      }
    }
  }
`;

export const useMatchParty = (input: PartyMatchInput, enabled: boolean) => {
  return useGraphQLQuery<{ matchParty: Party[] }>(MATCH_PARTY, {
    queryKey: ["matchParty", JSON.stringify(input)],
    variables: { input },
    enabled,
  });
};
