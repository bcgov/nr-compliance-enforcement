import { useMutation, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { useRequest } from "@graphql/client";

interface UseGraphQLMutationOptions<TData, TError, TVariables>
  extends Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn"> {}

export const useGraphQLMutation = <TData = any, TError = Error, TVariables = any>(
  mutation: any,
  options?: UseGraphQLMutationOptions<TData, TError, TVariables>,
): UseMutationResult<TData, TError, TVariables> => {
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      return await useRequest(mutation, variables || {});
    },
    ...options,
  });
};
