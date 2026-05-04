import { gql } from "graphql-request";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { InvestigationFilters, InvestigationResult } from "@/generated/graphql";

const SEARCH_INVESTIGATIONS = gql`
  query SearchInvestigations($page: Int, $pageSize: Int, $filters: InvestigationFilters) {
    searchInvestigations(page: $page, pageSize: $pageSize, filters: $filters) {
      items {
        __typename
        investigationGuid
        name
        openedTimestamp
        leadAgency
        community
        caseIdentifier
        locationGeometry
        investigationStatus {
          investigationStatusCode
          shortDescription
          longDescription
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

type UseInvestigationSearchQueryParams = {
  page?: number;
  pageSize?: number;
  filters?: InvestigationFilters;
  queryKey?: unknown[];
  enabled?: boolean;
};

export const useInvestigationSearchQuery = ({
  page = 1,
  pageSize = 25,
  filters = {},
  queryKey = [],
  enabled = true,
}: UseInvestigationSearchQueryParams = {}) => {
  const { data, isLoading, error } = useGraphQLQuery<{ searchInvestigations: InvestigationResult }>(
    SEARCH_INVESTIGATIONS,
    {
      queryKey: ["searchInvestigations", ...queryKey],
      variables: { page, pageSize, filters },
      enabled,
      placeholderData: (previousData) => previousData,
    },
  );

  return { data, isLoading, error };
};
