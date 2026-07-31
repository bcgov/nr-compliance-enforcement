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
 * parseUTCTimestampToLocal or parseUTCDateToLocal first. Do NOT pass a stored column string
 * here; strings won't format correctly and will return `whenAbsent`.
 *
 * All output is read from the Date's local getters; no timezone conversion happens in this function.
 *
 * @param date   a local Date, or null/undefined
 * @param format output shape — "date" (yyyy-MM-dd), "time" (HH:mm), or "dateTime" (yyyy-MM-dd HH:mm:ss). Defaults to "date".
 * @param whenAbsent returned when the input is missing or is an invalid Date. Defaults to "".
 * @param includeRelative appends a relative distance suffix, e.g. "2026-07-01 (3 months ago)". Defaults to false.
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
 * Converts a local Date (+ optional "HH:mm" time) to UTC values for storage. Inverse of
 * parseUTCDateTimeToLocal.
 *
 * When a time is supplied, both returned values derive from one combined UTC instant, so the stored
 * date and time can never disagree across a UTC-midnight boundary. When no time is supplied, the
 * date passes through unchanged and utcTime is null.
 *
 * Note on storage conventions this supports:
 *   - date-only records store a literal calendar date with a null time
 *   - timed records store both fields derived from the same UTC instant
 *
 * @param date a local Date
 * @param time a local "HH:mm" string, or null/undefined for the date-only case
 * @returns { utcDate, utcTime } — utcTime is "HH:mm" when a time was supplied, otherwise null
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
 * Reconstructs a single local Date from separately stored UTC date and time column values.
 *
 * Calling convention depends on the column type:
 *   - DATE column:            parseUTCDateToLocal(dateValue, null)   — date taken literally, no shift
 *   - split DATE + TIME:      parseUTCDateToLocal(dateCol, timeCol)  — combined, then converted to local
 *   - single timestamp column: use parseUTCTimestampToLocal(value) instead
 *
 * @param date a UTC date string or Date, or null/undefined
 * @param time a UTC time (or timestamp) string, or null for the date-only case
 * @returns a local Date, or null when no date is supplied
 */
export const parseUTCDateToLocal = (date: OptionalDateTimeInput, time?: OptionalDateTimeInput): Date | null => {
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

/**
 * Parses a single UTC timestamp column value into a local Date.
 *
 * For `timestamp` columns, the one stored value carries both date and time. Use this rather than
 * parseUTCDateToLocal(date, time) when working with timestamps to avoid date shifts.
 *
 * @param value a UTC timestamp string (e.g. "2026-07-01T05:00:00.000Z"), or null/undefined
 * @returns a local Date, or null when no value is supplied
 */
export const parseUTCTimestampToLocal = (value: OptionalDateTimeInput): Date | null =>
  parseUTCDateToLocal(value, value);
