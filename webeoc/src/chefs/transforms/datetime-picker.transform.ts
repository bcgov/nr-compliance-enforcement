import { formatInTimeZone } from "date-fns-tz";
import { ChefsTransform } from "src/types/chefs/chefs-transform-type";

// Fields set by CHEFS date/time pickers, which send ISO 8601 with an offset (e.g. 2026-11-01T04:20:00-07:00).
const DATETIME_PICKER_FIELDS = ["incident_datetime"] as const;

// The staging function reads date/times as Vancouver local time with no zone, as WebEOC sends them.
const WEBEOC_DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
const WEBEOC_TIME_ZONE = "America/Vancouver";

// Converts CHEFS date/time picker values into the WebEOC date/time format.
export const datetimePickerTransform: ChefsTransform = (data) => {
  const result = { ...data };

  for (const field of DATETIME_PICKER_FIELDS) {
    const value = result[field];
    // Only ISO values need converting; anything else is left as is.
    if (!value?.includes("T")) {
      continue;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      continue;
    }

    result[field] = formatInTimeZone(date, WEBEOC_TIME_ZONE, WEBEOC_DATETIME_FORMAT);
  }

  return result;
};
