import format from "date-fns/format";
import { formatDistanceToNow } from "date-fns";

type DateFormatPreset = "date" | "time" | "dateTime";

interface FormatDateObjectOptions {
  /** Output shape. Defaults to "date". */
  format?: DateFormatPreset;
  /** Returned when the input is missing or is an invalid Date. Defaults to "". */
  whenAbsent?: string;
  /** Appends a relative distance suffix, e.g. "2026-07-01 (3 months ago)". Defaults to false. */
  includeRelative?: boolean;
}

const DATE_FORMAT_PATTERNS: Record<DateFormatPreset, string> = {
  date: "yyyy-MM-dd",
  time: "HH:mm",
  dateTime: "yyyy-MM-dd HH:mm:ss",
};

/**
 * Formats a local Date for display.
 *
 * The Date passed in must already carry the correct local wall-clock value — build it with
 * parseUTCDateTimeToLocal if required, passing both the date and time columns where the record has them.
 * A Date constructed from a time column alone cannot resolve daylight saving and will be an
 * hour out for part of the year.
 *
 * All output is read from the Date's local getters; no timezone conversion happens here.
 */
export const formatDateObjectAsString = (
  date: Date | null | undefined,
  { format: preset = "date", whenAbsent = "", includeRelative = false }: FormatDateObjectOptions = {},
): string => {
  if (!date || Number.isNaN(date.getTime())) {
    return whenAbsent;
  }

  const formatted = format(date, DATE_FORMAT_PATTERNS[preset]);

  if (includeRelative) {
    return `${formatted} (${formatDistanceToNow(date, { addSuffix: true })})`;
  }

  return formatted;
};
