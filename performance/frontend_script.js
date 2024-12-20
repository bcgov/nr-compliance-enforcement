import exec from "k6/execution";
import http from "k6/http";
import { browserTest } from "./tests/frontend/browser.js";
import { protocolTest } from "./tests/frontend/protocol.js";
import { INITIAL_TOKEN, INITIAL_REFRESH_TOKEN, generateRequestConfig } from "./common/auth.js";

/**
 * To run with an open browser, prepend the make command with K6_BROWSER_HEADLESS=false
 */
const defaultOptions = {
  executor: "constant-vus",
  // Due to the heavy nature of the front end tests experiment with the number of VUs
  // and maybe try running one scenario at a time to avoid overloading your system and getting errors
  vus: 1, // If running all 4 scenarios this is 1x4=4 VUs
  duration: "10000s",
  options: {
    browser: {
      type: "chromium",
    },
  },
};

export const options = {
  scenarios: {
    browserTest: {
      executor: "per-vu-iterations",
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
    protocolTest: {
      executor: "constant-vus",
      vus: 1,
      duration: "20s",
    },
  },
};

const TOKEN_REFRESH_TIME = 60;
var token = INITIAL_TOKEN;
var refreshToken = INITIAL_REFRESH_TOKEN;
var requestConfig = generateRequestConfig(token);

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
