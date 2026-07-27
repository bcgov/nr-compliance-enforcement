import format from "date-fns/format";
import { formatDistanceToNow } from "date-fns";

type DateFormatPreset = "date" | "time" | "dateTime";
type OptionalDateTimeInput = string | Date | null | undefined;

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
 * parseUTCDateTimeToLocal or parseUTCTimestampToLocal if required, passing both the date and time columns where the record has them.
 * A Date constructed from a time column alone cannot resolve daylight saving and will be an
 * hour out for part of the year.
 *
 * All output is read from the Date's local getters; no timezone conversion happens here.
 *
 */
export const formatDateObjectAsString = (
  date: Date | null | undefined,
  { format: preset = "date", whenAbsent = "", includeRelative = false }: FormatDateObjectOptions = {},
): string => {
  // Getting an error on the next line? You forgot to call a parse method!
  if (!date || Number.isNaN(date.getTime())) {
    return whenAbsent;
  }

  const formatted = format(date, DATE_FORMAT_PATTERNS[preset]);

  if (includeRelative) {
    return `${formatted} (${formatDistanceToNow(date, { addSuffix: true })})`;
  }

  return formatted;
};

/**
 * Parses a single UTC TIMESTAMP column value into a local Date.
 *
 * For TIMESTAMP columns, the one stored value carries both date and time, so it is passed to
 * parseUTCDateTimeToLocal as both arguments — the date argument reads the date portion, the time
 * argument reads the time portion, and they recombine into a single local instant.
 *
 * For DATE columns use parseUTCDateTimeToLocal(value).
 * For split DATE/TIME columns use parseUTCDateTimeToLocal(dateColumn, timeColumn).
 * For TIMESTAMP columns use parseUTCTimestampToLocal(value).
 */
export const parseUTCTimestampToLocal = (value: OptionalDateTimeInput): Date | null =>
  parseUTCDateTimeToLocal(value, value);

/**
 * Converts a local Date + "HH:MM" time string to UTC date and UTC time string for API storage.
 */
export const parseLocalDateTimeToUTC = (
  date: Date,
  time: string | null | undefined,
): { utcDate: Date; utcTime: string | null } => {
  if (!time) return { utcDate: date, utcTime: null };
  const combined = new Date(date);
  const [hh, mm] = time.split(":").map(Number);
  combined.setHours(hh, mm, 0, 0);
  const utcHH = combined.getUTCHours().toString().padStart(2, "0");
  const utcMM = combined.getUTCMinutes().toString().padStart(2, "0");
  return {
    utcDate: new Date(Date.UTC(combined.getUTCFullYear(), combined.getUTCMonth(), combined.getUTCDate())),
    utcTime: `${utcHH}:${utcMM}`,
  };
};

/**
 * Reconstructs a single Date from separate date/time ISO-string fields.
 *
 * For DATE columns use parseUTCDateTimeToLocal(value).
 * For split DATE/TIME columns use parseUTCDateTimeToLocal(dateColumn, timeColumn).
 * For TIMESTAMP columns use parseUTCTimestampToLocal(value).
 */
export const parseUTCDateTimeToLocal = (date: OptionalDateTimeInput, time?: OptionalDateTimeInput): Date | null => {
  if (!date) return null;
  const dateStr =
    date instanceof Date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
      : String(date).split("T")[0];
  if (!time) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  const raw = String(time);
  const timeStr = raw.includes("T") ? raw.split("T")[1]?.replace("Z", "") || "00:00:00" : raw.replace("Z", "");
  return new Date(`${dateStr}T${timeStr}Z`);
};
