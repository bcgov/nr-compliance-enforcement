import exec from "k6/execution";
import { STAGES } from "./common/params.js";
import { openSearchWithFilters, openSearchWithoutFilters, searchWithoutFilters } from "./tests/backend/search.js";
import { mapSearchAllComplaints, mapSearchAllOpenComplaints, mapSearchWithFilters } from "./tests/backend/mapSearch.js";

const RPS = __ENV.RPS;

const defaultOptions = {
  executor: "ramping-vus",
  stages: STAGES[`${__ENV.LOAD}`],
};

export const options = {
  scenarios: {
    // search
    openSearchWithFilters: defaultOptions,
    openSearchWithoutFilters: defaultOptions,
    searchWithoutFilters: defaultOptions,
    // map search
    mapSearchAllComplaints: defaultOptions,
    mapSearchAllOpenComplaints: defaultOptions,
    mapSearchWithFilters: defaultOptions,
  },
  thresholds: {
    http_req_duration: ["p(99)<2000"], // 99% of requests must complete below 2s
  },
  rps: RPS, // If over 50, notify platform services first.
};

export default function () {
  const HOST = __ENV.SERVER_HOST;
  // search
  if (exec.scenario.name === "openSearchWithFilters") {
    openSearchWithFilters(HOST);
  }
  if (exec.scenario.name === "openSearchWithoutFilters") {
    openSearchWithoutFilters(HOST);
  }
  if (exec.scenario.name === "searchWithoutFilters") {
    searchWithoutFilters(HOST);
  }
  // map search
  if (exec.scenario.name === "mapSearchAllComplaints") {
    mapSearchAllComplaints(HOST);
  }
  if (exec.scenario.name === "mapSearchAllOpenComplaints") {
    mapSearchAllOpenComplaints(HOST);
  }
  if (exec.scenario.name === "mapSearchWithFilters") {
    mapSearchWithFilters(HOST);
  }
}
