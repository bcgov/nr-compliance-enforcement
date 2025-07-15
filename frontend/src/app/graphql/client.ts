import { GraphQLClient } from "graphql-request";
import { AUTH_TOKEN } from "@service/user-service";

const GRAPHQL_URL = "http://localhost:3003/graphql";

const getClient = () => {
  const accessToken = localStorage.getItem(AUTH_TOKEN);
  return new GraphQLClient(GRAPHQL_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const useRequest = async (QUERY: any, input = {}) => {
  const client = getClient();
  return client.request<any>(QUERY, input);
};
