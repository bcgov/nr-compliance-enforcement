import format from "date-fns/format";
import { Coordinates } from "../types/app/coordinate-type";
import COMPLAINT_TYPES from "../types/app/complaint-types";
import { ComplaintStatus } from "../types/app/code-tables/complaint-status";
import { from } from "linq-to-typescript";
import { Violation } from "../types/app/code-tables/violation";
import { Species } from "../types/app/code-tables/species";
import { NatureOfComplaint } from "../types/app/code-tables/nature-of-complaint";
import { UUID } from "crypto";
import { Complaint as ComplaintDto } from "../types/app/complaints/complaint";
import { GifReader } from "omggif";
import { fromImage } from "imtool";
import AttachmentEnum from "../constants/attachment-enum";
import Option from "../types/app/option";
import { GirType } from "../types/app/code-tables/gir-type";
let utmObj = require("utm-latlng");

type Coordinate = number[] | string[] | undefined;

const SLIDE_HEIGHT = 130;
const SLIDE_WIDTH = 289; // width of the carousel slide, in pixels

export const loadGifFrameList = async (gifUrl: string): Promise<HTMLCanvasElement[]> => {
  const response = await fetch(gifUrl);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const intArray = new Uint8Array(arrayBuffer);

  const reader = new GifReader(intArray as Buffer);

  const info = reader.frameInfo(0);

  return new Array(reader.numFrames()).fill(0).map((_, k) => {
    const image = new ImageData(info.width, info.height);

    reader.decodeAndBlitFrameRGBA(k, image.data as any);

    let canvas = document.createElement("canvas");

    canvas.width = info.width;
    canvas.height = info.height;

    canvas.getContext("2d")!.putImageData(image, 0, 0);

    return canvas;
  });
};

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

// handy for those times where we want to set a selected option, but we only have the value.
// Useful for Compselect, which requires an Option.  In the future, best to refactor CompSelect to accept a value
// instead of an Option
export const getSelectedItem = (value: string, options: Option[]): Option => {
  const selectedOption = options.find((option) => option.value === value);
  if (selectedOption) {
    return selectedOption;
  } else {
    return { value: "", label: "" };
  }
};

export const getSelectedOfficer = (
  officers: Option[],
  personGuid: UUID | string,
  update: ComplaintDto | undefined,
): any => {
  if (update && personGuid) {
    const { delegates } = update;

    const assignees = delegates.filter((item) => item.type === "ASSIGNEE" && item.isActive);
    if (!from(assignees).any()) {
      return undefined;
    }

    const selected = officers.find(({ value }) => {
      const first = from(assignees).firstOrDefault();
      if (first) {
        const {
          person: { id },
        } = first;
        return value === id;
      }

      return false;
    });

    return selected;
  }

  return undefined;
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
    const firstName = words[0];
    const lastName = words[words.length - 1];

    // Concatenate the first initial and last name with a space
    return `${lastName}, ${firstName}`;
  }
};

export const getFileExtension = (filename: string) => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
};

export const formatDate = (input: string | undefined): string => {
  if (!input) {
    return "";
  }

  try {
    const parsedDate = Date.parse(input);

    if (isNaN(parsedDate)) {
      throw new Error("Invalid date format");
    }

    return format(parsedDate, "yyyy-MM-dd");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
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

  return format(Date.parse(input), "yyyy-MM-dd HH:mm:ss");
};

// given a filename and complaint identifier, inject the complaint identifier inbetween the file name and extension
export const injectComplaintIdentifierToFilename = (
  filename: string,
  complaintIdentifier: string,
  attachmentType: AttachmentEnum,
): string => {
  // Find the last dot in the filename to separate the extension
  const lastDotIndex = filename.lastIndexOf(".");

  // If there's no dot, just append the complaintId at the end
  if (lastDotIndex === -1) {
    return `${filename} ${complaintIdentifier} ${attachmentType}`;
  }

  const fileNameWithoutExtension = filename.substring(0, lastDotIndex);
  const fileExtension = filename.substring(lastDotIndex);

  // Otherwise, insert the complaintId before the extension
  return `${fileNameWithoutExtension} ${complaintIdentifier} ${attachmentType}${fileExtension}`;
};

export const isImage = (filename: string): boolean => {
  return ["jpg", "jpeg", "png", "gif", "bmp", "webp", "abif", "svg"].includes(getFileExtension(filename));
};

// given a filename and complaint identifier, inject the complaint identifier inbetween the file name and extension
export const injectComplaintIdentifierToThumbFilename = (
  filename: string,
  complaintIdentifier: string,
  attachmentType: AttachmentEnum,
): string => {
  // Find the last dot in the filename to separate the extension
  const lastDotIndex = filename.lastIndexOf(".");

  // If there's no dot, just append the complaintId at the end
  if (lastDotIndex === -1) {
    return `${filename} ${complaintIdentifier} ${attachmentType}`;
  }

  const fileNameWithoutExtension = filename.substring(0, lastDotIndex) + "-thumb";
  const fileExtension = filename.substring(lastDotIndex);

  // Otherwise, insert the complaintId before the extension
  return `${fileNameWithoutExtension} ${complaintIdentifier}${attachmentType}${fileExtension}`;
};

// Used to retrieve the coordinates in the decimal format
export const parseDecimalDegreesCoordinates = (coordinates: Coordinate): { lat: number; lng: number } => {
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

export const bcUtmBoundaries = {
  minEasting: 280220.6,
  maxEasting: 720184.9,
  minNorthing: 5346051.7,
  maxNorthing: 6655120.8,
};

export const bcUtmZoneNumbers = ["7", "8", "9", "10", "11"];

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

export const parseCoordinates = (coordinates: Coordinate, coordinateType: Coordinates): number | string => {
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

export const renderCoordinates = (coordinates: Coordinate, coordinateType: Coordinates): JSX.Element => {
  const result = parseCoordinates(coordinates, coordinateType);

  return result === 0 ? <>{""}</> : <>{result}</>;
};

export const applyStatusClass = (state: string): string => {
  switch (state.toLowerCase()) {
    case "open":
      return "comp-status-badge-open";
    case "closed":
      return "comp-status-badge-closed";
    case "pendrev":
    case "pending review":
      return "comp-status-badge-pending-review";
    default:
      return "";
  }
};

export const truncateString = (str: string, maxLength: number): string => {
  if (str?.length > maxLength) {
    return str.substring(0, maxLength) + "..."; // Adds an ellipsis to indicate truncation
  } else {
    return str;
  }
};

export const removeFile = (fileList: FileList, fileToRemove: File): File[] => {
  // Convert the FileList to an array
  const filesArray = Array.from(fileList);

  // Filter out the file you want to remove
  const updatedFilesArray = filesArray.filter((file) => file !== fileToRemove);

  return updatedFilesArray;
};

export const getStatusByStatusCode = (code: string, codes: Array<ComplaintStatus>): string => {
  if (from(codes).any(({ complaintStatus }) => complaintStatus === code)) {
    const selected = from(codes).first(({ complaintStatus }) => complaintStatus === code);

    return selected.longDescription;
  }

  return "";
};

export const getViolationByViolationCode = (code: string, codes: Array<Violation>): string => {
  if (codes && from(codes).any(({ violation }) => violation === code)) {
    const selected = from(codes).first(({ violation }) => violation === code);

    return selected.longDescription;
  }

  return "";
};

export const getSpeciesBySpeciesCode = (code: string, codes: Array<Species>): string => {
  if (codes && from(codes).any(({ species }) => species === code)) {
    const selected = from(codes).first(({ species }) => species === code);

    return selected.longDescription;
  }

  return "";
};

export const getNatureOfComplaintByNatureOfComplaintCode = (code: string, codes: Array<NatureOfComplaint>): string => {
  if (codes && from(codes).any(({ natureOfComplaint }) => natureOfComplaint === code)) {
    const selected = from(codes).first(({ natureOfComplaint }) => natureOfComplaint === code);

    return selected.longDescription;
  }

  return "";
};

export const getGirTypeByGirTypeCode = (code: string, codes: Array<GirType>): string => {
  if (codes && from(codes).any(({ girType }) => girType === code)) {
    const selected = from(codes).first(({ girType }) => girType === code);

    return selected.longDescription;
  }

  return "";
};
export const pad = (num: string, size: number): string => {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
};

export const getThumbnailFile = async (file: File): Promise<File> => {
  try {
    const tool = await fromImage(file);
    const heightRatio = SLIDE_HEIGHT / tool.originalHeight;
    const widthRatio = SLIDE_WIDTH / tool.originalWidth;
    return await (heightRatio > widthRatio
      ? tool
          .scale(tool.originalWidth * heightRatio, tool.originalHeight * heightRatio)
          .crop(0, 0, SLIDE_WIDTH, SLIDE_HEIGHT)
          .toFile(file.name + "-thumb.jpg")
      : tool
          .scale(tool.originalWidth * widthRatio, tool.originalHeight * widthRatio)
          .crop(0, 0, SLIDE_WIDTH, SLIDE_HEIGHT)
          .toFile(file.name + "-thumb.jpg"));
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getThumbnailDataURL = async (file: File): Promise<string> => {
  try {
    const tool = await fromImage(file);
    const heightRatio = SLIDE_HEIGHT / tool.originalHeight;
    const widthRatio = SLIDE_WIDTH / tool.originalWidth;
    return await (heightRatio > widthRatio
      ? tool
          .scale(tool.originalWidth * heightRatio, tool.originalHeight * heightRatio)
          .crop(0, 0, SLIDE_WIDTH, SLIDE_HEIGHT)
          .toDataURL()
      : tool
          .scale(tool.originalWidth * widthRatio, tool.originalHeight * widthRatio)
          .crop(0, 0, SLIDE_WIDTH, SLIDE_HEIGHT)
          .toDataURL());
  } catch {
    return "";
  }
};

export function isPositiveNum(number: string) {
  return !isNaN(Number(number)) && Number(number) >= 0;
}

export const formatLatLongCoordinate = (input: string | undefined): string | undefined => {
  const regex = /^-?\d*\.?\d*$/;
  let result = input;
  if (regex.exec(input ?? "")) {
    result = input ? Number(Number(input).toFixed(7)).toString() : "";
    if (input && input.endsWith(".")) {
      result = result + ".";
    }
  }
  return result;
};

export const latLngToUtm = (lat: string, lng: string): { easting: string; northing: string; zone: string } => {
  const regex = /^-?\d*\.?\d*$/;
  if (regex.exec(lat) && regex.exec(lng) && ![lat, lng].includes("0")) {
    let utm = new utmObj();
    const utmCoordinates = utm.convertLatLngToUtm(lat, lng, 3);
    return {
      easting: utmCoordinates.Easting.toFixed(0),
      northing: utmCoordinates.Northing.toFixed(0),
      zone: utmCoordinates.ZoneNumber ?? "",
    };
  }
  return { easting: "", northing: "", zone: "" };
};
