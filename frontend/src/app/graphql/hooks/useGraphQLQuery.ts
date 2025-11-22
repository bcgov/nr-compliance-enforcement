import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { graphqlRequest } from "@graphql/client";

/**
 * Generic GraphQL query hook that provides type-safe GraphQL queries with TanStack Query
 *
 * @example
 * ```typescript
 * const { data, isLoading, error } = useGraphQLQuery<MyQueryType, Error, MyVariablesType>(
 *   MY_GRAPHQL_QUERY,
 *   {
 *     queryKey: ['myQuery', someId],
 *     variables: { someId },
 *     enabled: !!someId,
 *   }
 * );
 * ```
 */
interface UseGraphQLQueryOptions<TData, TError, TVariables>
  extends Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn"> {
  queryKey: unknown[];
  variables?: TVariables;
  enabled?: boolean;
}

export const useGraphQLQuery = <TData = any, TError = Error, TVariables = any>(
  query: any, // GraphQL query
  options: UseGraphQLQueryOptions<TData, TError, TVariables>,
): UseQueryResult<TData, TError> => {
  const { queryKey, variables, enabled = true, ...queryOptions } = options;

  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      return await graphqlRequest(query, variables ?? {});
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes default
    gcTime: 10 * 60 * 1000, // 10 minutes default
    refetchOnMount: true, // Ensure refetch data on component mount
    ...queryOptions,
  });
};
