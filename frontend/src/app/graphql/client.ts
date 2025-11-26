import { GraphQLClient } from "graphql-request";
import { AUTH_TOKEN } from "@service/user-service";
import config from "@/config";

const getClient = () => {
  const accessToken = localStorage.getItem(AUTH_TOKEN);

  const graphqlUrl = config.GRAPHQL_URL.startsWith("http")
    ? config.GRAPHQL_URL
    : `${window.location.origin}${config.GRAPHQL_URL}`;

  return new GraphQLClient(graphqlUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const graphqlRequest = async (QUERY: any, input = {}) => {
  const client = getClient();
  return client.request<any>(QUERY, input);
};
