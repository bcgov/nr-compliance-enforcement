import { generateApiParameters, get } from "@/app/common/api";
import { AppDispatch } from "@/app/store/store";
import { Feature } from "@/app/types/maps/bcGeocoderType";
import config from "@/config";
import { Dispatch } from "redux";

// LocationGeometry type mirrors custom GraphQL scalar for FE type safety
export type LocationGeometry = {
  type: string;
  coordinates: number[];
};

const MIN_CONFIDENCE_SCORE = 90;

//  Helper function to build the URL for the geocoder
const buildGeocoderUrl = (area: string | undefined, address: string | undefined): string => {
  const queryParts: string[] = [];

  if (area) {
    queryParts.push(`localityName=${encodeURIComponent(area)}`);
  }
  if (address) {
    queryParts.push(`addressString=${encodeURIComponent(address)}`);
  }

  return `${config.API_BASE_URL}/bc-geo-coder/address?${queryParts.join("&")}`;
};

// Helper function to call geocoder and retrieve the response.
// Logic is applied by the caller
export const fetchRawGeocoderResponse = async (
  area: string | undefined,
  address: string | undefined,
  dispatch: Dispatch,
): Promise<Feature | null> => {
  if (!area && !address) {
    return null;
  }

  try {
    const parameters = generateApiParameters(buildGeocoderUrl(area, address));
    const response = await get<Feature>(dispatch, parameters);
    return response ?? null;
  } catch (error) {
    console.error("Error fetching geocoder response", error);
    return null;
  }
};

// Helper function to represent "no coordinates entered".
// Treats null, undefined, empty array, and [0, 0] as empty.
const areCoordinatesEmpty = (coordinates: number[] | null | undefined): boolean => {
  if (!coordinates || coordinates.length === 0) {
    return true;
  }

  const [first, second] = coordinates;
  return first === 0 && second === 0;
};

// Attempts to geocode the given address/community when the caller does not already
// have coordinates.   Enforces high level of confidence in the result.
export const geocodeAddressIfNeeded = async (
  area: string | undefined,
  address: string | undefined,
  currentCoordinates: number[] | null | undefined,
  dispatch: Dispatch,
): Promise<number[]> => {
  const originalCoordinates = currentCoordinates ?? [];

  if (!areCoordinatesEmpty(currentCoordinates)) {
    return originalCoordinates;
  }

  const response = await fetchRawGeocoderResponse(area, address, dispatch);

  if (response?.features?.length === 1 && response.minScore >= MIN_CONFIDENCE_SCORE) {
    return response.features[0].geometry.coordinates;
  }

  return originalCoordinates;
};

// Helper function that returns a LocationGeometery type for use with GQL
export const resolveLocationGeometry = async (
  community: string | undefined,
  locationAddress: string | undefined,
  locationGeometry: LocationGeometry | null | undefined,
  dispatch: AppDispatch,
): Promise<LocationGeometry | null | undefined> => {
  const currentCoordinates = locationGeometry?.coordinates;
  const resolvedCoordinates = await geocodeAddressIfNeeded(community, locationAddress, currentCoordinates, dispatch);

  return resolvedCoordinates === currentCoordinates
    ? locationGeometry
    : { type: "Point", coordinates: resolvedCoordinates };
};

// Returns Zoom level based on if we have coordinates, a community or nothing (Province)
export const getMapZoom = (
  recordCoordinates: number[] | null | undefined,
  communityCenter: { lat: number; lng: number } | null,
): number => {
  if (recordCoordinates && recordCoordinates.length > 0) {
    return 14;
  }
  if (communityCenter) {
    return 12;
  }
  return 5;
};
