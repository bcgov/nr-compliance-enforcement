import { gql } from "graphql-request";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { CaseFileFilters, CaseFileResult } from "@/generated/graphql";

const SEARCH_CASE_FILES = gql`
  query SearchCaseFiles($page: Int, $pageSize: Int, $filters: CaseFileFilters) {
    searchCaseFiles(page: $page, pageSize: $pageSize, filters: $filters) {
      items {
        __typename
        caseIdentifier
        name
        openedTimestamp
        updatedTimestamp
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
        activities {
          activityIdentifier
          activityType {
            caseActivityTypeCode
          }
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

type UseCaseSearchQueryParams = {
  page?: number;
  pageSize?: number;
  filters?: CaseFileFilters;
  queryKey?: unknown[];
  enabled?: boolean;
};

export const useCaseSearchQuery = ({
  page = 1,
  pageSize = 25,
  filters = {},
  queryKey = [],
  enabled = true,
}: UseCaseSearchQueryParams = {}) => {
  const { data, isLoading, error } = useGraphQLQuery<{ searchCaseFiles: CaseFileResult }>(SEARCH_CASE_FILES, {
    queryKey: ["searchCaseFiles", ...queryKey],
    variables: { page, pageSize, filters },
    enabled,
    placeholderData: (previousData) => previousData,
  });

  return { data, isLoading, error };
};
