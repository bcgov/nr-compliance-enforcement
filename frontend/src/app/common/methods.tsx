import format from "date-fns/format";
import { Coordinates } from "../types/app/coordinate-type";
import COMPLAINT_TYPES from "../types/app/complaint-types";
import { CodeTable } from '../types/code-tables/code-table';
import Option from "../types/app/option";
import { from } from 'linq-to-typescript';

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

export const renderCoordinates = (
  coordinates: number[] | string[] | undefined,
  coordinateType: Coordinates
): JSX.Element => {
  const result = parseCoordinates(coordinates, coordinateType);

  return result === 0 ? <>{'Not Provided'}</> : <>{result}</>;
};


// export const convertToOptions = (input: Array<CodeTable>): Array<Option> => { 
//   if(!from(input).any()){ 
//     return input.map(({value, label}) => { 
//       return { value, label } as Option
//     }) as Array<Option>

//     return new Array<Option>;
//   }
// }