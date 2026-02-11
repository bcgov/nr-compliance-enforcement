import { FC } from "react";
import DatePicker from "react-datepicker";
import { enGB } from "date-fns/locale";

interface ValidationDatePickerProps {
  className: string;
  selectedDate: Date | undefined | null;
  selectedTime?: string | null;
  maxDate?: Date;
  minDate?: Date;
  onChange: (date: Date, time: string | null) => void;
  id: string;
  classNamePrefix: string;
  errMsg: string;
  isDisabled?: boolean;
  showPreviousMonths?: boolean;
  showTimePicker?: boolean;
  nullableTime?: boolean;
  onTimeWithoutDate?: () => void;
  vertical?: boolean;
}

type TimeSegment = "hour" | "minute";

const dateWithTime = (date: Date, time: string | null): Date => {
  const result = new Date(date);
  if (time) {
    const [hh, mm] = time.split(":").map(Number);
    result.setHours(hh, mm, 0, 0);
  } else {
    result.setHours(0, 0, 0, 0);
  }
  return result;
};

// Allows the user to type dates like '2025 02 02' and have it parse out to the standard
// date format of '2025-02-02'
const parseDateInput = (raw: string): Date | null => {
  const stripped = raw.replace(/[\s\-\/\.]/g, "");
  if (stripped.length !== 8 || !/^\d{8}$/.test(stripped)) {
    return null;
  }
  const year = Number.parseInt(stripped.substring(0, 4), 10);
  const month = Number.parseInt(stripped.substring(4, 6), 10);
  const day = Number.parseInt(stripped.substring(6, 8), 10);
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
};

const buildTimeFromPickerDate = (
  date: Date,
  currentTime: string | null,
  segment: TimeSegment,
): string => {
  const [currentHour, currentMin] = (currentTime ?? "00:00").split(":");
  if (segment === "hour") {
    return `${date.getHours().toString().padStart(2, "0")}:${currentMin}`;
  }
  return `${currentHour}:${date.getMinutes().toString().padStart(2, "0")}`;
};

const handleTimeRawInput = (
  event: React.FocusEvent<HTMLInputElement>,
  selectedDate: Date | undefined | null,
  selectedTime: string | null,
  segment: TimeSegment,
  onChange: (date: Date, time: string | null) => void,
): void => {
  const rawValue = event.target.value;
  if (rawValue === "" && selectedDate) {
    onChange(selectedDate, null);
    return;
  }
  const digits = rawValue.replace(/\D/g, "");
  if (digits.length > 2) {
    event.preventDefault();
    const truncated = digits.slice(-2);
    event.target.value = truncated;
    const value = parseInt(truncated, 10);
    const max = segment === "hour" ? 23 : 59;
    if (selectedDate && value >= 0 && value <= max) {
      const [h, m] = (selectedTime ?? "00:00").split(":");
      const newTime =
        segment === "hour"
          ? `${truncated.padStart(2, "0")}:${m}`
          : `${h}:${truncated.padStart(2, "0")}`;
      onChange(selectedDate, newTime);
    }
  }
};

export const ValidationDatePicker: FC<ValidationDatePickerProps> = ({
  className,
  selectedDate,
  selectedTime = null,
  maxDate,
  minDate,
  onChange,
  id,
  classNamePrefix,
  errMsg,
  isDisabled,
  showPreviousMonths = true,
  showTimePicker = false,
  nullableTime = false,
  onTimeWithoutDate,
  vertical = false,
}) => {
  const displayDate = selectedDate ? dateWithTime(selectedDate, selectedTime) : undefined;
  const displayTime = nullableTime && !selectedTime ? undefined : displayDate;

  const handleDatePickerBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    if (rawValue === "" && selectedDate) {
      onChange(null as any, null);
    } else if (rawValue) {
      const parsed = parseDateInput(rawValue);
      if (parsed) {
        onChange(parsed, selectedTime);
      }
    }
  };

  const calculatedClass = errMsg === "" ? "" : "error-message";
  const calculatedBorderClass = errMsg === "" ? "" : "error-border";

  return (
    <div className={`comp-lat-long-input ${vertical ? "d-flex flex-column" : ""}`}>
      <div className="d-flex flex-row gap-2">
        <div
          className={`d-flex comp-date-time-picker align-items-center ${calculatedBorderClass}`}
          style={vertical ? undefined : { maxWidth: "180px" }}
        >
          <i className="bi bi-calendar" />
          <DatePicker
            selected={displayDate}
            onChange={(date) => {
              if (date) {
                onChange(date, selectedTime);
              }
            }}
            onBlur={handleDatePickerBlur}
            placeholderText="yyyy-mm-dd"
            className={`${calculatedBorderClass} ${classNamePrefix}`}
            id={`${id}-date`}
            dateFormat="yyyy-MM-dd"
            {...(maxDate && { maxDate })}
            minDate={minDate}
            autoComplete="false"
            monthsShown={2}
            disabled={isDisabled}
            showIcon={false}
            showPreviousMonths={showPreviousMonths}
          />
        </div>

        {showTimePicker && (
          <div
            className={`d-flex comp-date-time-picker comp-date-time-picker-split align-items-center ${calculatedBorderClass}`}
          >
            <i className="bi bi-clock" />
            <DatePicker
              id={`${id}-hour`}
              selected={displayTime}
              onFocus={() => {
                if (!selectedDate && onTimeWithoutDate) onTimeWithoutDate();
              }}
              onChange={(date) => {
                if (!selectedDate) {
                  if (onTimeWithoutDate) onTimeWithoutDate();
                  return;
                }
                if (date) {
                  onChange(selectedDate, buildTimeFromPickerDate(date, selectedTime, "hour"));
                }
              }}
              onChangeRaw={(event) => {
                handleTimeRawInput(event, selectedDate, selectedTime, "hour", onChange);
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={60}
              timeCaption="Hour"
              timeFormat="HH"
              dateFormat="HH"
              placeholderText="HH"
              locale={enGB}
            />
            <span>:</span>
            <DatePicker
              id={`${id}-minute`}
              selected={displayTime}
              onFocus={() => {
                if (!selectedDate && onTimeWithoutDate) onTimeWithoutDate();
              }}
              onChange={(date) => {
                if (!selectedDate) {
                  if (onTimeWithoutDate) onTimeWithoutDate();
                  return;
                }
                if (date) {
                  onChange(selectedDate, buildTimeFromPickerDate(date, selectedTime, "minute"));
                }
              }}
              onChangeRaw={(event) => {
                handleTimeRawInput(event, selectedDate, selectedTime, "minute", onChange);
              }}
              showTimeSelect
              showTimeSelectOnly
              // Note that we have to use custom css to hide the rest of the repeating minutes due to a lib limitation
              calendarClassName="minute-picker"
              timeIntervals={5}
              timeCaption="Min"
              timeFormat="mm"
              dateFormat="mm"
              placeholderText="mm"
              minTime={new Date(0, 0, 0, 0, 0)}
              maxTime={new Date(0, 0, 0, 0, 55)}
            />
          </div>
        )}
      </div>
      <div className={calculatedClass}>{errMsg}</div>
    </div>
  );
};
