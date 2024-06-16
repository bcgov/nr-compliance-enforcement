import { format } from "date-fns";

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
