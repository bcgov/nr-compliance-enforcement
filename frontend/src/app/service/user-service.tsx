import _kc from "@/app/keycloak";
import config from "@/config";
import { AgencyType } from "@apptypes/app/agency-types";
import type { KeycloakTokenParsed } from "keycloak-js";

export const AUTH_TOKEN = "__auth_token";

const REFRESH_BUFFER_SECONDS = 60;
const REFRESH_CHECK_INTERVAL_MS = 30000;

let activeRefreshPromise: Promise<string> | null = null;
let refreshIntervalId: ReturnType<typeof setInterval> | null = null;

const TOKEN_REFRESH_RETRIES = 2;
const TOKEN_REFRESH_RETRY_DELAY_MS = 1000;
const TOKEN_FORMAT = /^([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)$/;
const MAX_TOKEN_LENGTH = 8192;

// Rebuilds the token so the value written to local storage is a fresh string
// not the original network payload.
const sanitizeToken = (value: unknown): string | null => {
  if (typeof value !== "string" || value.length === 0 || value.length > MAX_TOKEN_LENGTH) {
    return null;
  }
  const match = TOKEN_FORMAT.exec(value);
  if (!match) {
    return null;
  }
  return `${match[1]}.${match[2]}.${match[3]}`;
};

const decodeJwt = (token: string): KeycloakTokenParsed => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replaceAll("-", "+").replaceAll("_", "/");
  return JSON.parse(atob(base64));
};

// calls the Keycloak token endpoint directly via bypassing keycloak-js to avoid issues with long-running uploads and token refresh.  This is used as part of the refreshToken function which is called by the 401 interceptor and the refresh interval timer.
const tokenRefresh = async (): Promise<string> => {
  if (!_kc.refreshToken) {
    throw new Error("No refresh token available");
  }

  const tokenUrl = `${config.KEYCLOAK_URL}/realms/${config.KEYCLOAK_REALM}/protocol/openid-connect/token`;

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: _kc.refreshToken,
      client_id: config.KEYCLOAK_CLIENT_ID,
    }),
  });

  if (!response.ok) {
    throw new Error(`token refresh failed: ${response.status}`);
  }

  const data = await response.json();

  // sync keycloak-js state
  if (data.access_token) {
    _kc.token = data.access_token;
    _kc.tokenParsed = decodeJwt(data.access_token);
  }
  if (data.refresh_token) {
    _kc.refreshToken = data.refresh_token;
    _kc.refreshTokenParsed = decodeJwt(data.refresh_token);
  }
  if (data.id_token) {
    _kc.idToken = data.id_token;
    _kc.idTokenParsed = decodeJwt(data.id_token);
  }

  const sanitized = sanitizeToken(data.access_token);
  if (!sanitized) {
    throw new Error("token refresh returned an invalid access token");
  }
  localStorage.setItem(AUTH_TOKEN, sanitized);
  return sanitized;
};

// refreshes the Keycloak token and updates localStorage
export const refreshToken = (): Promise<string> => {
  if (activeRefreshPromise) {
    return activeRefreshPromise;
  }

  const attemptRefresh = async (): Promise<string> => {
    // Check if token actually needs refreshing
    if (_kc.tokenParsed?.exp) {
      const expiresIn = _kc.tokenParsed.exp - Math.ceil(Date.now() / 1000) + (_kc.timeSkew ?? 0);
      if (expiresIn > REFRESH_BUFFER_SECONDS) {
        return _kc.token!;
      }
    }

    for (let attempt = 0; attempt <= TOKEN_REFRESH_RETRIES; attempt++) {
      if (attempt > 0) {
        await new Promise((resolve) => setTimeout(resolve, TOKEN_REFRESH_RETRY_DELAY_MS));
      }
      try {
        return await tokenRefresh();
      } catch {
        // continue
      }
    }

    throw new Error("Token refresh failed after all attempts");
  };

  activeRefreshPromise = attemptRefresh().finally(() => {
    activeRefreshPromise = null;
  });

  return activeRefreshPromise;
};

const startRefresh = () => {
  if (refreshIntervalId) return;
  refreshIntervalId = setInterval(() => {
    refreshToken().catch(() => {
      // Bypass redirect here as the 401 interceptor handles login redirect as a last resort
      console.warn("token refresh failed, will retry next interval");
    });
  }, REFRESH_CHECK_INTERVAL_MS);
};

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (onAuthenticatedCallback: () => void) => {
  _kc
    .init({
      onLoad: "login-required",
      pkceMethod: "S256",
      checkLoginIframe: false,
    })
    .then((authenticated) => {
      if (authenticated) {
        const sanitized = sanitizeToken(_kc.token);
        if (!sanitized) {
          console.error("Keycloak returned an invalid access token");
          return;
        }
        localStorage.setItem(AUTH_TOKEN, sanitized);
        startRefresh();
      } else {
        console.log("User is not authenticated.");
      }
      onAuthenticatedCallback();
    })
    .catch(console.error);

  _kc.onTokenExpired = () => {
    refreshToken().catch(() => {
      // bypass redirect here as the 401 interceptor handles login redirect as a last resort
      console.warn("token refresh failed, will retry on next 401");
    });
  };
};

export const doLogin = () => _kc.login();

const doLogout = _kc.logout;

const getToken = () => _kc.token;

const isLoggedIn = () => !!_kc.token;

const updateToken = (successCallback: ((value: boolean) => boolean | PromiseLike<boolean>) | null | undefined) =>
  _kc.updateToken(5).then(successCallback).catch(doLogin);

const getUsername = () => _kc.tokenParsed?.display_name;

/**
 * Determines if a user's role(s) overlap with the role on the private route.  The user's role is determined via jwt.client_roles
 * @param roles
 * @returns True or false, inidicating if the user has the role or not.
 */
const hasRole = (roles: any) => {
  const jwt = _kc.tokenParsed;
  const userroles = jwt?.client_roles;
  const includesRoles =
    typeof roles === "string" ? userroles?.includes(roles) : roles.some((r: any) => userroles?.includes(r));
  return includesRoles;
};

export const getUserAgency = () => {
  let agency = AgencyType.SECTOR;
  if (hasRole("COS")) {
    agency = AgencyType.COS;
  }
  if (hasRole("CEEB")) {
    agency = AgencyType.CEEB;
  }
  if (hasRole("PARKS")) {
    agency = AgencyType.PARKS;
  }
  if (hasRole("NROS")) {
    agency = AgencyType.NROS;
  }
  return agency;
};

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  updateToken,
  getUsername,
  hasRole,
  getUserAgency,
};

export default UserService;
