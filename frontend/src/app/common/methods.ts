import { Coordinates } from "../types/app/coordinate-type";
import COMPLAINT_TYPES from "../types/app/complaint-types";
import { format, parseISO } from "date-fns";
import { zonedTimeToUtc } from 'date-fns-tz'

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

  return format(Date.parse(input), "MM/dd/yyyy");
};

export const formatTime = (input: string | undefined): string => {
  if (!input) {
    return "";
  }
  // console.log(`input: ${input} parsed: ${parseISO(input)} converted: ${new Date(input)} formated: ${format(parseISO(input), "HH:mm:ss")}`)
  const timeZone = 'America/Vancouver'
  console.log(`input: ${input} parsed: ${zonedTimeToUtc(input, timeZone)}`)
  return format(Date.parse(input), "hh:mm:ss");
};

export const parseCoordinates = (
  coordinates: number[] | string[] | undefined,
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
