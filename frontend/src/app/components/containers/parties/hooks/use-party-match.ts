// use-match-party.ts
import { useGraphQLQuery } from "@graphql/hooks";
import { keepPreviousData } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { PartyMatchInput, PartyMatchResult } from "@/generated/graphql";

const MATCH_PARTY = gql`
  query MatchParty($input: PartyMatchInput!) {
    matchParty(input: $input) {
      party {
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
          driversLicenseNumber
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
      score
      matchedFields {
        field
        exact
        points
      }
    }
  }
`;

export const useMatchParty = (input: PartyMatchInput | undefined, enabled: boolean) => {
  return useGraphQLQuery<{ matchParty: PartyMatchResult[] }>(MATCH_PARTY, {
    queryKey: ["matchParty", JSON.stringify(input)],
    variables: { input },
    enabled,
    retry: 0,
    placeholderData: keepPreviousData,
  });
};
