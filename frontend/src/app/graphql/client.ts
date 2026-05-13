import { GraphQLClient, ClientError } from "graphql-request";
import { AUTH_TOKEN, refreshToken, doLogin } from "@service/user-service";
import config from "@/config";
import { STATUS_CODES } from "../common/api";
import { ToggleError } from "../common/toast";

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

const UNAUTHORIZED_ERROR_CODES = new Set(["UNAUTHORIZED", "FORBIDDEN"]);

const isUnauthorizedGraphqlError = (error: ClientError): boolean =>
  (error.response?.errors ?? []).some((gqlError) =>
    UNAUTHORIZED_ERROR_CODES.has(String(gqlError?.extensions?.code ?? "")),
  );

// Mirrors the axios auth-error handling in app/common/api.ts so REST and GraphQL behave the same.
export const graphqlRequest = async (QUERY: any, input = {}, _retry = false): Promise<any> => {
  const client = getClient();
  try {
    return await client.request<any>(QUERY, input);
  } catch (error) {
    if (!(error instanceof ClientError)) throw error;

    const status = error.response?.status;

    // On 401, refresh the token and retry the request once
    if (status === STATUS_CODES.Unauthorized && !_retry) {
      try {
        await refreshToken();
        return await graphqlRequest(QUERY, input, true);
      } catch {
        doLogin();
        throw error;
      }
    }

    // 401 on the retry means the login token was valid but the user truely isn't authorized. Redirect to not-authorized page.
    if (status === STATUS_CODES.Unauthorized || isUnauthorizedGraphqlError(error)) {
      globalThis.location.href = "/not-authorized";
      throw error;
    }

    if (status === STATUS_CODES.Forbiden) {
      ToggleError("User is not authorized to perform this action");
    }

    throw error;
  }
};
