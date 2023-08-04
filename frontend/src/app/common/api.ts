import { Dispatch } from "redux";
import axios, {
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
} from "axios";
import config from "../../config";
import { AUTH_TOKEN } from "../service/user-service";
import { ApiRequestParameters } from "../types/app/api-request-parameters";
import { toggleNotification } from "../store/reducers/app";

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

export const generateApiParameters = <T = {}>(
  url: string,
  params?: T,
  enableNotification: boolean = false,
  requiresAuthentication: boolean = true
): ApiRequestParameters<T> => {
  let result = {
    url,
    requiresAuthentication,
    enableNotification,
  } as ApiRequestParameters<T>;

  if (params) {
    return { ...result, params };
  }

  return result;
};

export const get = <T, M = {}>(
  dispatch: Dispatch,
  parameters: ApiRequestParameters<M>
): Promise<T> => {
  let config: AxiosRequestConfig = { headers: {} };
  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication, params } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
    }

    if (params) {
      config.params = params;
    }

    axios
      .get(url, config)
      .then((response: AxiosResponse) => {
        const { data, status } = response;
        
        if (status === STATUS_CODES.Unauthorized) {
          window.location = KEYCLOAK_URL;
        }

        resolve(data as T);
      })
      .catch((error: AxiosError) => {
        if (parameters.enableNotification) {
          const { message } = error;
          dispatch(toggleNotification("error", message));
        }
        reject(error);
      });
  });
};

export const post = <T, M = {}>(
	dispatch: Dispatch,
	parameters: ApiRequestParameters<M>
): Promise<T> => {
	let config: AxiosRequestConfig = { headers: {} };
	return new Promise<T>((resolve, reject) => {
		const { url, requiresAuthentication, params } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
    }

		axios
			.post(url, params, config)
			.then((response: AxiosResponse) => {
				resolve(response.data as T);
			})
			.catch((error: AxiosError) => {
				if (parameters.enableNotification) {
          dispatch(toggleNotification("error", error.message));
        }
				reject(error);
			});
	});
};

export const patch = <T, M = {}>(
  dispatch: Dispatch,
  parameters: ApiRequestParameters<M>
): Promise<T> => {
  let config: AxiosRequestConfig = { headers: {} };
  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication, params: data } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
    }

    axios
      .patch(url, data, config)
      .then((response: AxiosResponse) => {
        const { status } = response;

        if (status === STATUS_CODES.Unauthorized) {
          window.location = KEYCLOAK_URL;
        }

        resolve(response.data as T);
      })
      .catch((error: AxiosError) => {
        if (parameters.enableNotification) {
          dispatch(toggleNotification("error", error.message));
        }
        reject(error);
      });
  });
};

export const put = <T, M = {}>(
  dispatch: Dispatch,
  parameters: ApiRequestParameters<M>
): Promise<T> => {
  let config: AxiosRequestConfig = { headers: {} };
  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication, params: data } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
    }

    axios
      .put(url, data, config)
      .then((response: AxiosResponse) => {
        const { status } = response;

        if (status === STATUS_CODES.Unauthorized) {
          window.location = KEYCLOAK_URL;
        }

        resolve(response.data as T);
      })
      .catch((error: AxiosError) => {
        if (parameters.enableNotification) {
          dispatch(toggleNotification("error", error.message));
        }
        reject(error);
      });
  });
};