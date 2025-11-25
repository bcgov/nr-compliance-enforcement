import { useMutation, UseMutationOptions, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { graphqlRequest } from "@graphql/client";

interface QueryInvalidationOptions {
  /** Query keys to invalidate on successful mutation */
  invalidateQueries?: Array<string | Array<any>>;
}

interface UseGraphQLMutationOptions<TData, TError, TVariables>
  extends Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn" | "onSuccess">,
    QueryInvalidationOptions {
  onSuccess?: (data: TData, variables: TVariables, context: unknown) => void;
}

export const useGraphQLMutation = <TData = any, TError = Error, TVariables = any>(
  mutation: any,
  options?: UseGraphQLMutationOptions<TData, TError, TVariables>,
): UseMutationResult<TData, TError, TVariables> => {
  const queryClient = useQueryClient();
  const { invalidateQueries, onSuccess, ...mutationOptions } = options || {};

  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      return await graphqlRequest(mutation, variables || {});
    },
    onSuccess: (data, variables, context) => {
      if (invalidateQueries) {
        invalidateQueries?.forEach((queryKey) => {
          queryClient.invalidateQueries({
            queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
          });
        });
      } else {
        queryClient.invalidateQueries();
      }
      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    ...mutationOptions,
  });
};
