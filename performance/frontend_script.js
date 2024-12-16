import exec from "k6/execution";
import { browserTest } from "./tests/frontend/browser.js";
import { protocolTest } from "./tests/frontend/protocol.js";

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
      vus: 5,
      duration: "30s",
    },
  },
};

export default function () {
  const HOST = __ENV.APP_HOST;
  if (exec.scenario.name === "browserTest") {
    browserTest(HOST);
  }

  if (exec.scenario.name === "protocolTest") {
    protocolTest(HOST);
  }
}
