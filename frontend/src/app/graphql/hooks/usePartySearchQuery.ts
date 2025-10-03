import { gql } from "graphql-request";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { usePartySearch } from "@/app/components/containers/parties/hooks/use-party-search";
import { PartyResult } from "@/generated/graphql";

const SEARCH_PARTIES = gql`
  query SearchParties($page: Int, $pageSize: Int, $filters: PartyFilters) {
    searchParties(page: $page, pageSize: $pageSize, filters: $filters) {
      items {
        __typename
        partyIdentifier
        partyTypeCode
        shortDescription
        longDescription
        createdDateTime
        person {
          personGuid
          firstName
          lastName
        }
        business {
          businessGuid
          name
        }
      }
      pageInfo {
        currentPage
        pageSize
        totalPages
        totalCount
      }
    }
  }
`;

export const usePartySearchQuery = () => {
  const { searchValues, getFilters } = usePartySearch();
  const { data, isLoading, error } = useGraphQLQuery<{ searchParties: PartyResult }>(SEARCH_PARTIES, {
    queryKey: [
      "searchParties",
      searchValues.search,
      searchValues.partyTypeCode,
      searchValues.sortBy,
      searchValues.sortOrder,
      searchValues.page,
      searchValues.pageSize,
    ],
    variables: {
      page: searchValues.page,
      pageSize: searchValues.pageSize,
      filters: getFilters(),
    },
    placeholderData: (previousData) => previousData,
  });

  return { data, isLoading, error };
};
