import { ChefsTransform } from "src/types/chefs/chefs-transform-type";

// Copies the first map marker's coordinates into the WebEOC address coordinate fields.
export const mapCoordinatesTransform: ChefsTransform = (data) => {
  const marker = data.incidentLocation?.features?.find((feature) => feature.type === "marker");
  if (!marker) {
    return data;
  }

  return {
    ...data,
    address_coordinates_lat: String(marker.coordinates.lat),
    address_coordinates_long: String(marker.coordinates.lng),
  };
};
