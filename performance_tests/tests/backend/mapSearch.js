import http from "k6/http";
import { check } from "k6";

// Search for open HWCR complaints in the South Peace region
export const mapSearchDefaultFilters = async (host, requestConfig) => {
  check(
    await http.get(
      host +
        "/api/v1/complaint/search/HWCR?sortBy=incident_reported_utc_timestmp&orderBy=DESC&zone=SPCE&status=OPEN&page=1&pageSize=50",
      requestConfig,
    ),
    {
      "mapSearchDefaultFilters response status 200": (r) => r.status === 200,
      "mapSearchDefaultFilters response has entries": (r) => JSON.parse(r.body).totalCount > 0,
    },
  );
};

export const mapSearchAllOpenComplaints = async (host, requestConfig) => {
  check(
    await http.get(
      host + "/api/v1/complaint/search/HWCR?sortBy=incident_reported_utc_timestmp&orderBy=DESC&page=1&pageSize=50",
      requestConfig,
    ),
    {
      "mapSearchAllOpenComplaints response status 200": (r) => r.status === 200,
      "mapSearchAllOpenComplaints response has entries": (r) => JSON.parse(r.body).totalCount > 0,
    },
  );
};

export const mapSearchAllComplaints = async (host, requestConfig) => {
  check(
    await http.get(host + "/api/v1/complaint/map/search/clustered/HWCR?zoom=0&query=&clusters=true", requestConfig),
    {
      "mapSearchAllComplaints response status 200": (r) => r.status === 200,
      "mapSearchAllComplaints response has entries": (r) => JSON.parse(r.body).mappedCount > 0,
    },
  );
  check(
    await http.get(host + "/api/v1/complaint/map/search/clustered/HWCR?zoom=0&query=&unmapped=true", requestConfig),
    {
      "mapSearchAllComplaints unmapped response status 200": (r) => r.status === 200,
      "mapSearchAllComplaints unmapped response has entries": (r) => JSON.parse(r.body).unmappedCount > 0,
    },
  );
};
export const mapSearchWithCMFilter = async (host, requestConfig) => {
  check(
    await http.get(
      host +
        "/api/v1/complaint/map/search/clustered/HWCR?zoom=0&outcomeAnimalStartDate=2023-06-01T07:00:00.000Z&query=&clusters=true",
      requestConfig,
    ),
    {
      "mapSearchWithCMFilter response status 200": (r) => r.status === 200,
      "mapSearchWithCMFilter response has entries": (r) => JSON.parse(r.body).mappedCount >= 0,
    },
  );
  check(
    await http.get(
      host +
        "/api/v1/complaint/map/search/clustered/HWCR?zoom=0&outcomeAnimalStartDate=2023-06-01T07:00:00.000Z&query=&unmapped=true",
      requestConfig,
    ),
    {
      "mapSearchWithCMFilter unmapped response status 200": (r) => r.status === 200,
      "mapSearchWithCMFilter unmapped response has entries": (r) => JSON.parse(r.body).unmappedCount >= 0,
    },
  );
};
