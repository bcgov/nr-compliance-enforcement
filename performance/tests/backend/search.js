import http from "k6/http";
import { check } from "k6";
import { COS_USER_HEADERS } from "../../common/auth.js";

export const openSearchWithFilters = async (host) => {
  // Search for open HWCR complaints in the South Peace region
  check(
    await http.get(
      host +
        "/api/v1/complaint/search/HWCR?sortBy=incident_reported_utc_timestmp&orderBy=DESC&zone=SPCE&status=OPEN&page=1&pageSize=50",
      COS_USER_HEADERS,
    ),
    {
      "response status 200": (r) => r.status === 200,
      "response has entries": (r) => JSON.parse(r.body).totalCount > 0,
    },
  );
};

export const openSearchWithoutFilters = async (host) => {
  check(
    await http.get(
      host +
        "/api/v1/complaint/search/HWCR?sortBy=incident_reported_utc_timestmp&orderBy=DESC&status=OPEN&page=1&pageSize=50",
      COS_USER_HEADERS,
    ),
    {
      "response status 200": (r) => r.status === 200,
      "response has entries": (r) => r.totalCount > 0,
    },
  );
};

export const openSearchWithoutFilters = async (host) => {
  check(
    await http.get(
      host + "/api/v1/complaint/search/HWCR?sortBy=incident_reported_utc_timestmp&orderBy=DESC&page=1&pageSize=50",
      COS_USER_HEADERS,
    ),
    {
      "response status 200": (r) => r.status === 200,
      "response has entries": (r) => r.totalCount > 0,
    },
  );
};
