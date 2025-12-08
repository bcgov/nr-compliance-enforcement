import { FC, useState, useEffect, useRef, useMemo } from "react";
import { format, isValid } from "date-fns";

type Props = {
  value: Date | undefined | null;
  onChange: Function;
  maxDate: Date | undefined;
  errorMessage?: string;
  onErrorChange?: (error: string) => void;
};

export const CompDateTimePicker: FC<Props> = ({ value, onChange, maxDate, onErrorChange }) => {
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  const openDatePicker = () => dateInputRef.current?.showPicker?.() ?? dateInputRef.current?.focus();
  const openTimePicker = () => timeInputRef.current?.showPicker?.() ?? timeInputRef.current?.focus();

  // Memo to prevent re-renders
  const errorMessage = useMemo(() => {
    if (dateStr) {
      const dt = new Date(timeStr ? `${dateStr}T${timeStr}:00` : `${dateStr}T00:00:00`);
      if (isValid(dt) && maxDate && dt > maxDate) {
        return "Date and time cannot be in the future";
      }
    }
    return "";
  }, [dateStr, timeStr, maxDate]);

  useEffect(() => {
    onErrorChange?.(errorMessage);
  }, [errorMessage, onErrorChange]);

  useEffect(() => {
    if (value) {
      setDateStr(format(value, "yyyy-MM-dd"));
      setTimeStr(format(value, "HH:mm"));
    } else {
      setDateStr("");
      setTimeStr("");
    }
  }, [value]);

  useEffect(() => {
    if (dateStr) {
      let newDateTime: Date;
      if (timeStr) {
        newDateTime = new Date(`${dateStr}T${timeStr}:00`);
      } else {
        newDateTime = new Date(`${dateStr}T00:00:00`);
      }
      if (isValid(newDateTime) && (!value || newDateTime.getTime() !== value.getTime())) {
        onChange(newDateTime);
      } else if (value != null) {
        onChange(null);
      }
    } else if (value != null) {
      onChange(null);
    }
  }, [dateStr, timeStr, value]);

  return (
    <>
      <div
        className="comp-details-form-row gap-2"
        style={{ maxWidth: "350px" }}
      >
        <div className="comp-details-edit-input">
          <div
            className={errorMessage ? `comp-form-control error-border` : "comp-form-control"}
            style={{ display: "flex" }}
          >
            <button
              type="button"
              onClick={openDatePicker}
              className="icon-button"
              aria-label="Open date picker"
            >
              <i className="bi bi-calendar" />
            </button>
            <input
              id="incident-date"
              ref={dateInputRef}
              type="date"
              value={dateStr}
              onChange={(e) => {
                setDateStr(e.target.value);
              }}
              max={maxDate ? format(maxDate, "yyyy-MM-dd") : undefined}
              required
            />
          </div>
        </div>

        <div className="comp-details-edit-input">
          <div
            className="comp-form-control"
            style={{ display: "flex" }}
          >
            <button
              type="button"
              onClick={openTimePicker}
              className="icon-button"
              aria-label="Open date picker"
            >
              <i className="bi bi-clock" />
            </button>
            <input
              id="incident-time"
              ref={timeInputRef}
              type="time"
              value={timeStr}
              onChange={(e) => {
                setTimeStr(e.target.value);
              }}
              required
              step="60"
            />
          </div>
        </div>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </>
  );
};
