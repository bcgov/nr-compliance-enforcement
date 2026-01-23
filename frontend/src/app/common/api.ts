import { Dispatch } from "redux";
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import config from "@/config";
import { AUTH_TOKEN } from "@service/user-service";
import { ApiRequestParameters } from "@apptypes/app/api-request-parameters";
import { toggleLoading, toggleNotification } from "@store/reducers/app";
import { store } from "@store/store";
import { ToggleError } from "./toast";
import { displayBackendErrors } from "./methods";

interface NatComRequestConfig extends AxiosRequestConfig {
  toggleLoading: boolean;
}

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
  Conflict: 409,
};

let blockingRequestCounter = 0;

// Request interceptor to enable the loading indicator
axios.interceptors.request.use((config) => {
  if ((config as NatComRequestConfig).toggleLoading !== false) {
    blockingRequestCounter++;
    store.dispatch(toggleLoading(true));
  }
  return config;
});

// Response interceptor to hide the loading indicator
axios.interceptors.response.use(
  (response) => {
    const config = response.config as NatComRequestConfig;
    if (config.toggleLoading !== false) {
      blockingRequestCounter--;
      if (blockingRequestCounter <= 0) store.dispatch(toggleLoading(false));
    }
    return response;
  },
  (error) => {
    const config = error.config as NatComRequestConfig;
    if (config.toggleLoading !== false) {
      blockingRequestCounter--;
      if (blockingRequestCounter <= 0) store.dispatch(toggleLoading(false));
    }
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    // Successful response, just return the data
    return response;
  },
  (error: AxiosError) => {
    const { response } = error;

    if (response && response.status === STATUS_CODES.Unauthorized) {
      globalThis.location.href = "/not-authorized";
    }

    if (response && response.status === STATUS_CODES.Forbiden) {
      ToggleError("User is not authorized to perform this action");
    }

    if (response && response.status === STATUS_CODES.Conflict) {
      const backendErrorText = (response.data as any)?.message;
      if (backendErrorText) {
        displayBackendErrors(backendErrorText);
      }
    }
  },
);

const { KEYCLOAK_URL } = config;

export const generateApiParameters = <T = {}>(
  url: string,
  params?: T,
  enableNotification: boolean = false,
  requiresAuthentication: boolean = true,
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
  parameters: ApiRequestParameters<M>,
  headers?: {},
  toggleLoading: boolean = true,
): Promise<T> => {
  let config: NatComRequestConfig = { headers: headers, toggleLoading: toggleLoading };
  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication, params } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
    }

    if (params) {
      config.params = params;
    }

    axios
      .get(url, config)
      .then((response: AxiosResponse) => {
        if (!response) {
          return reject(new Error("No response"));
        }
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

//-- this function is named this way becasue 'delete' is a reserved word
//-- in javascript, don't try to rename
export const deleteMethod = <T, M = {}>(
  dispatch: Dispatch,
  parameters: ApiRequestParameters<M>,
  headers?: {},
  toggleLoading: boolean = true,
): Promise<T> => {
  let config: NatComRequestConfig = { headers: headers, toggleLoading: toggleLoading };
  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication, params } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
    }

    if (params) {
      config.params = params;
    }

    axios
      .delete(url, config)
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
  parameters: ApiRequestParameters<M>,
  toggleLoading: boolean = true,
): Promise<T> => {
  let config: NatComRequestConfig = { headers: {}, toggleLoading: toggleLoading };
  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication, params } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
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
  parameters: ApiRequestParameters<M>,
  toggleLoading: boolean = true,
): Promise<T> => {
  let config: NatComRequestConfig = { headers: {}, toggleLoading: toggleLoading };
  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication, params: data } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
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
  parameters: ApiRequestParameters<M>,
  toggleLoading: boolean = true,
): Promise<T> => {
  let config: NatComRequestConfig = { headers: {}, toggleLoading: toggleLoading };
  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication, params: data } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
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

export const putFile = <T, M = {}>(
  dispatch: Dispatch,
  parameters: ApiRequestParameters<M>,
  headers: {},
  file: File,
  toggleLoading: boolean = true,
): Promise<T> => {
  let config: NatComRequestConfig = { headers: headers, toggleLoading: toggleLoading };

  const formData = new FormData();
  if (file) formData.append("file", file);

  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
    }

    axios
      .put(url, file, config)
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
