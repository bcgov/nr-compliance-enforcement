import { ChefsTransform } from "src/types/chefs/chefs-transform-type";

// Combines the CHEFS first and last name fields into the WebEOC caller name field, separated by a space.
export const callerNameTransform: ChefsTransform = (data) => {
  const nameParts = [data.cos_caller_name_first, data.cos_caller_name_last].map((part) => part?.trim()).filter(Boolean);

  if (nameParts.length === 0) {
    return data;
  }

  return {
    ...data,
    cos_caller_name: nameParts.join(" "),
  };
};
