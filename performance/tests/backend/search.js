import http from "k6/http";
import { check } from "k6";

// Search with default parameters (open HWCR complaints in the South Peace region)
export const searchWithDefaultFilters = async (host, requestConfig) => {
  check(
    await http.get(
      host +
        "/api/v1/complaint/search/HWCR?sortBy=incident_reported_utc_timestmp&orderBy=DESC&zone=SPCE&status=OPEN&page=1&pageSize=50",
      requestConfig,
    ),
    {
      "Search with default parameters response status 200": (r) => r.status === 200,
      "Search with default parameters response has entries": (r) => JSON.parse(r.body).totalCount > 0,
    },
  );
};

// Searches for all complaints
export const searchWithoutFilters = async (host, requestConfig) => {
  check(
    await http.get(
      host + "/api/v1/complaint/search/HWCR?sortBy=incident_reported_utc_timestmp&orderBy=DESC&page=1&pageSize=50",
      requestConfig,
    ),
    {
      "Search for all HWCR complaints response status 200": (r) => r.status === 200,
      "Search for all HWCR complaints response has entries": (r) => JSON.parse(r.body).totalCount > 0,
    },
  );
};

// Searches for all open complaints
export const openSearchWithoutFilters = async (host, requestConfig) => {
  check(
    await http.get(
      host +
        "/api/v1/complaint/search/HWCR?sortBy=incident_reported_utc_timestmp&orderBy=DESC&status=OPEN&page=1&pageSize=50",
      requestConfig,
    ),
    {
      "Search for all open HWCR complaints response status 200": (r) => r.status === 200,
      "Search for all open HWCR complaints response has entries": (r) => JSON.parse(r.body).totalCount > 0,
    },
  );
};

// This search is for all complaints with an outcome date after June 1 2023.
// This filter will hit the Case Management database.
export const searchWithCMFilter = async (host, requestConfig) => {
  check(
    await http.get(
      host +
        "/api/v1/complaint/search/HWCR?sortBy=incident_reported_utc_timestmp&orderBy=DESC&outcomeAnimalStartDate=2024-11-11T08:00:00.000Z&page=1&pageSize=50",
      requestConfig,
    ),
    {
      "Search with case management filters response status 200": (r) => r.status === 200,
      "Search with case management filters response has entries": (r) => JSON.parse(r.body).totalCount > 0,
    },
  );
};
