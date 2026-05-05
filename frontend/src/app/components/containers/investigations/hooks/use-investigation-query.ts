import { gql } from "graphql-request";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { Investigation } from "@/generated/graphql";

const GET_INVESTIGATIONS = gql`
  query GetInvestigations($ids: [String]) {
    getInvestigations(ids: $ids) {
      __typename
      investigationGuid
      name
      openedTimestamp
    }
  }
`;

type UseGetInvestigationsQueryParams = {
  ids?: string[];
  queryKey?: unknown[];
  enabled?: boolean;
};

export const useGetInvestigationsQuery = ({
  ids = [],
  queryKey = [],
  enabled = true,
}: UseGetInvestigationsQueryParams = {}) => {
  const { data, isLoading, error } = useGraphQLQuery<{ getInvestigations: Investigation[] }>(GET_INVESTIGATIONS, {
    queryKey: ["getInvestigations", ...queryKey],
    variables: { ids },
    enabled: enabled && ids.length > 0,
  });

  return { data, isLoading, error };
};
