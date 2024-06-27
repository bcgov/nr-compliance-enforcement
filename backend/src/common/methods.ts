import { format } from "date-fns";
import { formatPhoneNumber } from "react-phone-number-input/input";

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
