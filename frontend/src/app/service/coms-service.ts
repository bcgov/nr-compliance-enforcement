import jwtDecode from "jwt-decode";
import { AUTH_TOKEN } from "./user-service";
import { SsoToken } from "../types/app/sso-token";
import { generateApiParameters } from "../common/api";
import config from "../../config";
import { AppThunk } from "../store/store";
import { ComsUser } from "../types/app/services/coms/coms-user";
import { ApiRequestParameters } from "../types/app/api-request-parameters";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import STATUS_CODES from "../constants/status-codes";
import { ComsBucket } from "../types/app/services/coms/coms-bucket";
import { from } from "linq-to-typescript";

const source = localStorage.getItem(AUTH_TOKEN) || "";
const token: SsoToken = jwtDecode<SsoToken>(source);
const { KEYCLOAK_URL, COMS_BUCKET } = config;

const getUsernameFromToken = () => {
  const { idir_user_guid: idir } = token;
  return idir;
};

const _get = <T, M = {}>(parameters: ApiRequestParameters<M>, headers?: {}): Promise<T> => {
  let config: AxiosRequestConfig = { headers: headers };
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
        const { data, status } = response;

        if (status === STATUS_CODES.Unauthorized) {
          window.location = KEYCLOAK_URL;
        }

        resolve(data as T);
      })
      .catch((error: AxiosError) => {
        reject(error);
      });
  });
};

const _put = <T, M = {}>(parameters: ApiRequestParameters<M>): Promise<T> => {
  let config: AxiosRequestConfig = { headers: {} };
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
        reject(error);
      });
  });
};

const getUserIdByIdrGuid = async (): Promise<any> => {
  const identityId = getUsernameFromToken();
  const parameters = generateApiParameters(`${config.COMS_URL}/user?username=${identityId}`);

  const response = await _get<Array<ComsUser>>(parameters);

  if (response) {
    const user = response.find((r) => r.identityId === identityId);

    if (user) {
      return user.userId;
    }
  }

  return null;
};

const hasAccess = async (): Promise<boolean> => {
  try {
    const userId = await getUserIdByIdrGuid();

    if (userId) {
      console.log(userId);
      const parameters = generateApiParameters(
        `${config.COMS_URL}/permission/bucket?userId=${userId}&bucketId=${COMS_BUCKET}`,
      );

      const response = await _get<Array<ComsBucket>>(parameters);
      console.log(response);
      if (from(response).any((r) => r.bucketId === COMS_BUCKET)) {
        return true;
      }
    }

    return false;
  } catch (error) {
    return false;
  }
};
const applyAccess = async () => {
  try {
    const userId = await getUserIdByIdrGuid();

    if (userId) {
      const parameters = generateApiParameters(`${config.COMS_URL}/permission/bucket/${COMS_BUCKET}`, [
        {
          permCode: "UPDATE",
          userId: "ac246e31-c807-496c-bc93-cd8bc2f1b2b4",
        },
      ]);

      debugger
      const response = await _put<any>(parameters);

    }
  } catch (error) {
    debugger
  }
};

export { applyAccess };
export default hasAccess;
