import format from "date-fns/format";
import { Coordinates } from "../types/app/coordinate-type";
import COMPLAINT_TYPES from "../types/app/complaint-types";

type Coordinate = number[] | string[] | undefined;

export const getAvatarInitials = (input: string): string => {
  const tokens = input.split(" ");

  if (tokens && tokens.length >= 1) {
    let result = tokens.map((item) => {
      return item.charAt(0);
    });

    return result.join("");
  } else {
    return input.charAt(0);
  }
};

export const formatDate = (input: string | undefined): string => {
  if (!input) {
    return "";
  }

  return format(Date.parse(input), "yyyy-MM-dd");
};

export const formatTime = (input: string | undefined): string => {
  if (!input) {
    return "";
  }

  return format(Date.parse(input), "HH:mm");
};

export const formatDateTime = (input: string | undefined): string => {
  if (!input) {
    return "";
  }

  return format(Date.parse(input), "yyyy-MM-dd HH:mm");
};

// Used to retrieve the coordinates in the decimal format
export const parseDecimalDegreesCoordinates = (
  coordinates: Coordinate
): { lat: number; lng: number } => {
  if (!coordinates) {
    return { lat: 0, lng: 0 };
  }

  return { lat: +coordinates[0], lng: +coordinates[1] };
};

// given coordinates, return true if within BC or false if not within BC
export const isWithinBC = (
  coordinates: Coordinate
): boolean => {
  const bcBoundaries = {
    minLatitude: 48.2513,
    maxLatitude: 60.0,
    minLongitude: -139.0596,
    maxLongitude: -114.0337,
  };

  if (!coordinates) {
    return false;
  }

  const latitude = +coordinates[0];
  const longitude = +coordinates[1];

  return (
    latitude >= bcBoundaries.minLatitude &&
    latitude <= bcBoundaries.maxLatitude &&
    longitude >= bcBoundaries.minLongitude &&
    longitude <= bcBoundaries.maxLongitude
  );
};

export const parseCoordinates = (
  coordinates: Coordinate,
  coordinateType: Coordinates
): number | string => {
  if (!coordinates) {
    return 0;
  }

  return coordinateType === Coordinates.Latitude
    ? coordinates[0]
    : coordinates[1];
};

export const getComplaintTypeFromUrl = (): number => {
  let p = new URLPattern({ pathname: "/complaints/:type" });
  let r = p.exec(window.location.href);

  if (r) {
    return r.pathname.groups.type === COMPLAINT_TYPES.HWCR ? 0 : 1;
  }

  return -1;
};

export const renderCoordinates = (
  coordinates: Coordinate,
  coordinateType: Coordinates
): JSX.Element => {
  const result = parseCoordinates(coordinates, coordinateType);

  return result === 0 ? <>{"Not Provided"}</> : <>{result}</>;
};
