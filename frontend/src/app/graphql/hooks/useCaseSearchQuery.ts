import { gql } from "graphql-request";
import { useCaseSearch } from "@/app/components/containers/cases/hooks/use-case-search";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { CaseFileResult } from "@/generated/graphql";

const SEARCH_CASE_FILES = gql`
  query SearchCaseFiles($page: Int, $pageSize: Int, $filters: CaseFileFilters) {
    searchCaseFiles(page: $page, pageSize: $pageSize, filters: $filters) {
      items {
        __typename
        caseIdentifier
        name
        openedTimestamp
        caseStatus {
          caseStatusCode
          shortDescription
          longDescription
        }
        leadAgency {
          agencyCode
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

export const useCaseSearchQuery = (searchString: string) => {
  const { searchValues } = useCaseSearch();

  const { data, isLoading, error } = useGraphQLQuery<{ searchCaseFiles: CaseFileResult }>(SEARCH_CASE_FILES, {
    queryKey: [
      "searchCaseFiles",
      searchValues.search,
      searchValues.caseStatus,
      searchValues.leadAgency,
      searchValues.startDate,
      searchValues.endDate,
      searchValues.sortBy,
      searchValues.sortOrder,
      searchValues.page,
      searchValues.pageSize,
    ],
    variables: {
      page: searchValues.page,
      pageSize: searchValues.pageSize,
      filters: { search: searchString },
    },
    placeholderData: (previousData) => previousData,
  });

  return { data, isLoading, error };
};
