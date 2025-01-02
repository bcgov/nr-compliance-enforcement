import http from "k6/http";
import exec from "k6/execution";
import { STAGES } from "./common/params.js";
import {
  searchWithDefaultFilters,
  searchWithoutFilters,
  openSearchWithoutFilters,
  searchWithCMFilter,
} from "./tests/backend/search.js";
import {
  mapSearchDefaultFilters,
  mapSearchAllOpenComplaints,
  mapSearchAllComplaints,
  mapSearchWithCMFilter,
} from "./tests/backend/mapSearch.js";
import { getComplaintDetails, addAndRemoveComplaintOutcome } from "./tests/backend/complaint_details.js";
import { INITIAL_TOKEN, INITIAL_REFRESH_TOKEN, generateRequestConfig } from "./common/auth.js";

const defaultOptions = {
  executor: "ramping-vus",
  stages: STAGES[`${__ENV.LOAD}`],
};

export const options = {
  scenarios: {
    // Search
    // searchWithDefaultFilters: defaultOptions,
    // searchWithoutFilters: defaultOptions,
    // openSearchWithoutFilters: defaultOptions,
    // searchWithCMFilter: defaultOptions,

    // Map Search
    // mapSearchDefaultFilters: defaultOptions,
    // mapSearchAllOpenComplaints: defaultOptions,
    // mapSearchAllComplaints: defaultOptions,
    // mapSearchWithCMFilter: defaultOptions,

    // Complaint Details
    getComplaintDetails: defaultOptions,
    addAndRemoveComplaintOutcome: defaultOptions,
  },
  thresholds: {
    http_req_duration: ["p(99)<2000"], // 99% of requests must complete below 2s
  },
  rps: __ENV.RPS, // If over 50, notify platform services first.
};

/**
 * In order to keep the token active, refresh it often enough to avoid any false 401, but not so often that it will
 * interfere with the testing. The RPS * refresh time is a rough approximation so tokenRefreshSeconds slightly
 * conservatively, not the exact token expiry period.
 * The token and config vars are set outside of the function to take advantage of some scope to allow the refresh to
 * happen conditionally rather than on every iteration.
 */

const TOKEN_REFRESH_TIME = 60;
var token = INITIAL_TOKEN;
var refreshToken = INITIAL_REFRESH_TOKEN;
var requestConfig = generateRequestConfig(token);

export default function () {
  const HOST = __ENV.SERVER_HOST;
  // Refresh the token if necessary based on iteration number, refresh time and rate of requests
  if (__ITER === 0 || __ITER % (__ENV.RPS * TOKEN_REFRESH_TIME) === 0) {
    const refreshRes = http.post(
      "https://dev.loginproxy.gov.bc.ca/auth/realms/standard/protocol/openid-connect/token",
      {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: "compliance-and-enforcement-digital-services-web-4794",
      },
    );

    token = JSON.parse(refreshRes.body).access_token;
    refreshToken = JSON.parse(refreshRes.body).refresh_token;
    requestConfig = generateRequestConfig(token);
  }
  // search
  if (exec.scenario.name === "searchWithDefaultFilters") {
    searchWithDefaultFilters(HOST, requestConfig);
  }
  if (exec.scenario.name === "searchWithoutFilters") {
    searchWithoutFilters(HOST, requestConfig);
  }
  if (exec.scenario.name === "openSearchWithoutFilters") {
    openSearchWithoutFilters(HOST, requestConfig);
  }
  if (exec.scenario.name === "searchWithCMFilter") {
    searchWithCMFilter(HOST, requestConfig);
  }
  // map search
  if (exec.scenario.name === "mapSearchDefaultFilters") {
    mapSearchDefaultFilters(HOST, requestConfig);
  }
  if (exec.scenario.name === "mapSearchAllOpenComplaints") {
    mapSearchAllOpenComplaints(HOST, requestConfig);
  }
  if (exec.scenario.name === "mapSearchAllComplaints") {
    mapSearchAllComplaints(HOST, requestConfig);
  }
  if (exec.scenario.name === "mapSearchWithCMFilter") {
    mapSearchWithCMFilter(HOST, requestConfig);
  }
  // complaint details
  if (exec.scenario.name === "getComplaintDetails") {
    getComplaintDetails(HOST, requestConfig);
  }
  if (exec.scenario.name === "addAndRemoveComplaintOutcome") {
    addAndRemoveComplaintOutcome(HOST, requestConfig);
  }
}
