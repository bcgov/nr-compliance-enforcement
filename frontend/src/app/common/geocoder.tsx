import { generateApiParameters, get } from "@/app/common/api";
import { Feature } from "@/app/types/maps/bcGeocoderType";
import config from "@/config";
import { Dispatch } from "redux";

const MIN_CONFIDENCE_SCORE = 90;

/**
 * Returns true when the provided coordinates represent "no coordinates entered".
 * Treats null, undefined, empty array, and [0, 0] as empty.
 */
const areCoordinatesEmpty = (coordinates: number[] | null | undefined): boolean => {
  if (!coordinates || coordinates.length === 0) {
    return true;
  }

  const [first, second] = coordinates;
  return first === 0 && second === 0;
};

/**
 * Attempts to geocode the given address/community when the caller does not already
 * have coordinates:
 *   - only geocodes when current coordinates are empty
 *   - only returns geocoded coordinates when exactly one feature is returned
 *     and the minScore is >= 90
 *   - swallows errors and returns the original coordinates so geocoding failures
 *     never block the caller's save flow
 */
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

  if (!area || !address) {
    return originalCoordinates;
  }

  try {
    const parameters = generateApiParameters(
      `${config.API_BASE_URL}/bc-geo-coder/address?localityName=${area}&addressString=${address}`,
    );
    const response = await get<Feature>(dispatch, parameters);

    if (response?.features?.length === 1 && response.minScore >= MIN_CONFIDENCE_SCORE) {
      return response.features[0].geometry.coordinates;
    }
  } catch (error) {
    console.error("Error returning geocoder coordinates", error);
  }

  return originalCoordinates;
};
