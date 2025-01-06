import exec from "k6/execution";
import http from "k6/http";
import { browserTest } from "./tests/frontend/browser.js";
import { protocolTest } from "./tests/frontend/protocol.js";
import { INITIAL_TOKEN, INITIAL_REFRESH_TOKEN, generateRequestConfig } from "./common/auth.js";

// Use activeBrowserOptions for the browser test if you aren't running it headless
const activeBrowserOptions = {
  executor: "per-vu-iterations",
  vus: 1,
  options: {
    browser: {
      type: "chromium",
    },
  },
};

const defaultOptions = {
  executor: "ramping-vus",
  stages: STAGES[`${__ENV.LOAD}`],
};

/**
 * To run with an open browser, prepend the make command with:
 * K6_BROWSER_HEADLESS=false
 * It is suggested to use the activeBrowserOptions when doing so as browsers will eat up a significant amount of local
 * resources which may affect the results of the tests in a way that is not representative of the servers performance.
 */
export const options = {
  scenarios: {
    browserTest: activeBrowserOptions,
    protocolTest: defaultOptions,
  },
  thresholds: {
    http_req_duration: ["p(99)<2000"], // ms that 99% of requests must be completed within
  },
  // rps: 50, // Do not increase to over 50 without informing Platform Services
};

const TOKEN_REFRESH_TIME = 60;
let token = INITIAL_TOKEN;
let refreshToken = INITIAL_REFRESH_TOKEN;
let requestConfig = generateRequestConfig(token);

export default function () {
  const HOST = __ENV.APP_HOST;
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
  if (exec.scenario.name === "browserTest") {
    browserTest(HOST);
  }

  if (exec.scenario.name === "protocolTest") {
    protocolTest(HOST, requestConfig);
  }
}
