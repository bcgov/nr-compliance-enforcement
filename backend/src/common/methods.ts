import { format } from "date-fns";
import { formatPhoneNumber } from "react-phone-number-input/input";
import { Role } from "../enum/role.enum";
import { UUID } from "crypto";

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

//--
//-- attempt to format a phone number using the 10 digit NA format
//-- if the number can't be formatted return the value provided
//--
export const formatPhonenumber = (input: string): string => {
  //Exit early if nothing passed in
  if (!input) {
    return;
  }
  //-- check the incoming phone number to see if its been formatted
  //-- correctly. Expecting input to be formatted as: +12505551234
  //-- if this is correct format the number and return it
  if (input.match(/\+1\d{7,10}/g)) {
    return formatPhoneNumber(input);
  }

  //-- if the number isn't in the correct format try and fix the formatting
  //-- by sanitizing the number and adding the +1 prefix
  const sanitized = input.replace(/\D/g, "");
  if (sanitized.length <= 10) {
    const padded = `+1${sanitized.padStart(10, "0")}`;

    return formatPhoneNumber(padded);
  }

  //-- we can't format the input into the format needed
  //-- return the phone number as its stored
  return input;
};

export const getFileType = (input: string): string => {
  const extension = getFileExtension(input);
  return mapExtensiontoFileType(extension);
};

export const getFileExtension = (input: string): string => {
  return input
    .substring(input.lastIndexOf(".") + 1)
    .toLowerCase()
    .trim();
};

export const mapExtensiontoFileType = (input: string): string => {
  if (["bmp", "gif", "heif", "heic", "jpg", "jpeg", "png", "psd", "svg", "tif", "tiff"].includes(input)) {
    return "Image";
  }
  if (["doc", "docx", "md", "odt", "pdf", "ppt", "rtf", "txt", "xls", "xlsx"].includes(input)) {
    return "Document";
  }
  if (["flac", "mp3", "aac", "ogg", "wma", "wav", "wave"].includes(input)) {
    return "Audio";
  }
  if (["avi", "flv", "mov", "mp4"].includes(input)) {
    return "Video";
  }
  if (["7z", "jar", "rar", "zip"].includes(input)) {
    return "Archive";
  }
  if (["eml", "msg", "ost", "pst"].includes(input)) {
    return "Email";
  }
  return "Unknown";
};

export const getAgenciesFromRoles = (roles: string[]): string[] => {
  const roleToAgencyMap = {
    [Role.COS]: "COS",
    [Role.CEEB]: "EPO",
    [Role.PARKS]: "PARKS",
    [Role.SECTOR]: "NRS",
  };

  return Object.keys(roleToAgencyMap)
    .filter((role) => roles.includes(role))
    .map((role) => roleToAgencyMap[role]);
};

export function asUUID(value: string): UUID {
  return value as UUID;
}
