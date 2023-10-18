import format from "date-fns/format";
import { Coordinates } from "../types/app/coordinate-type";
import COMPLAINT_TYPES from "../types/app/complaint-types";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { TimezoneCode } from "../types/code-tables/timezone-code";

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

export const getFirstInitialAndLastName = (fullName: string): string => {
  const NOT_ASSIGNED = "Not Assigned";

  if (NOT_ASSIGNED === fullName) {
    return NOT_ASSIGNED;
  }

  // Split the full name into an array of words
  const words = fullName.trim().split(" ");

  if (words.length === 0) {
    // If there are no words, return an empty string
    return "";
  } else if (words.length === 1) {
    // If there is only one word, return the entire word as the last name
    return words[0];
  } else {
    // Extract the first initial and last name
    const firstInitial = words[0].charAt(0).toUpperCase();
    const lastName = words[words.length - 1];

    // Concatenate the first initial and last name with a space
    return `${firstInitial}. ${lastName}`;
  }
};

export const formatDate = (input: string | undefined): string => {
  if (!input) {
    return "";
  }

  return format(Date.parse(input), "yyyy-MM-dd");
};

export const formatDateWithOffset = (
  input: string | undefined,
  timezoneCode: TimezoneCode | undefined
): string => {
  if (!input) {
    return "";
  }

  const offset = extractOffsetFromUTC(timezoneCode);

  const date = new Date(new Date(input).getTime() + offset * 60 * 60 * 1000);

  const isoDate = date.toISOString().split("T")[0]; // Split the string at 'T' to get the date portion

  const [year, month, day] = isoDate.split("-"); // Split the date into year, month, and day

  return `${year}-${month}-${day}`;
};

export const formatTimeWithOffset = (
  input: string | undefined,
  timezoneCode: TimezoneCode | undefined
): string => {
  if (!input) {
    return "";
  }
  debugger;
  const offset = extractOffsetFromUTC(timezoneCode);

  const date = new Date(new Date(input).getTime() + offset * 60 * 60 * 1000);
  const isoTime = date.toISOString().split("T")[1]; // Split the string at 'T' to get the date portion

  const [time] = isoTime.split("."); // Split the time into hours, minutes, seconds, and timezone

  const [hours, minutes] = time.split(":");

  return `${hours}:${minutes}`;
};

function extractOffsetFromUTC(input: TimezoneCode | undefined): number {
  if (input) {
    const regex = /UTC(-?\d+)/;
    const match = input.long_description?.match(regex);

    if (match) {
      const offset = parseInt(match[1], 10);
      return offset;
    } else {
      return 0; // Return null if the string doesn't match the expected format
    }
  } else {
    return 0;
  }
}

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

// returns the short timezone code for the user (e.g. PDT, PST, MDT, or MST)
export const getTimezoneCode = (): string => {
  const timeZoneCode = new Date()
    .toLocaleTimeString("en-us", { timeZoneName: "short" })
    .split(" ")[2];
  return timeZoneCode;
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

export const bcBoundaries = {
  minLatitude: 48.2513,
  maxLatitude: 60.0,
  minLongitude: -139.0596,
  maxLongitude: -114.0337,
};

// given coordinates, return true if within BC or false if not within BC
export const isWithinBC = (coordinates: Coordinate): boolean => {
  if (!coordinates) {
    return false;
  }

  const latitude = +coordinates[Coordinates.Latitude];
  const longitude = +coordinates[Coordinates.Longitude];

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
    ? coordinates[Coordinates.Latitude]
    : coordinates[Coordinates.Longitude];
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

export const applyStatusClass = (state: string): string => {
  switch (state.toLowerCase()) {
    case "open":
      return "comp-status-badge-open";
    case "closed":
      return "comp-status-badge-closed";
    default:
      return "";
  }
};
