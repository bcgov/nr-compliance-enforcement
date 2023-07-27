import { Dispatch } from "redux";
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import config from "../../config";
import { AUTH_TOKEN } from "../service/user-service";
import { ApiRequestParameters } from "../types/app/api-request-parameters";

const STATUS_CODES = {
  Ok: 200,
  BadRequest: 400,
  Unauthorized: 401,
  Forbiden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  InternalServerError: 500,
  BadGateway: 502,
  ServiceUnavailable: 503,
};

const { KEYCLOAK_URL } = config;

const getToken = (): string => {
  let token = localStorage.getItem(AUTH_TOKEN);
  return token ? token : "";
};

export const get = <T, M = {}>(
  dispatch: Dispatch,
  parameters: ApiRequestParameters<M>
): Promise<T> => {
  let config: AxiosRequestConfig = { headers: {} };
  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication, params } = parameters;

    if (requiresAuthentication) {
      config.headers = Object.assign({}, config.headers, {
        RequestVerificationToken: getToken(),
      });
    }

    if (params) {
      config.params = params;
    }

    axios
      .get(url, config)
      .then((response: AxiosResponse) => {
        const { data, status, statusText } = response;

        if (status === STATUS_CODES.Ok) {
            console.log("unauthorized, login!")
          axios.get(KEYCLOAK_URL);
        }

        resolve(data as T);
      })
      .catch((error: AxiosError) => {
        if (parameters.enableNotification) {
          //dispatch(toggleErrorNotification(error.message));
        }
        reject(error);
      });
  });
};
