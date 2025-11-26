import { FC, useState, useEffect, useRef } from "react";
import { format, isValid } from "date-fns";

type Props = {
  value: Date | undefined | null;
  onChange: Function;
  maxDate: Date | undefined;
};

export const CompDateTimePicker: FC<Props> = ({ value, onChange, maxDate }) => {
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  const openDatePicker = () => dateInputRef.current?.showPicker?.() ?? dateInputRef.current?.focus();
  const openTimePicker = () => timeInputRef.current?.showPicker?.() ?? timeInputRef.current?.focus();

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
      if (isValid(newDateTime)) {
        onChange(newDateTime);
      } else {
        onChange(null);
      }
    } else {
      onChange(null);
    }
  }, [dateStr, timeStr]);

  return (
    <div
      className="comp-details-form-row gap-2"
      style={{ maxWidth: "350px" }}
    >
      <div className="comp-details-edit-input">
        <div
          className="comp-form-control"
          style={{ display: "flex" }}
        >
          <i
            className="bi bi-calendar"
            style={{ fontSize: "1.1rem", cursor: "pointer" }}
            onClick={openDatePicker}
            role="button"
            tabIndex={0}
            aria-label="Open date picker"
            onKeyDown={(e) => e.key === "Enter" && openDatePicker()}
          />
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
            list="date-placeholders"
          />
          <datalist id="date-placeholders">
            <option value="">yyyy-MM-dd</option>
          </datalist>
        </div>
      </div>

      <div className="comp-details-edit-input">
        <div
          className="comp-form-control"
          style={{ display: "flex" }}
        >
          <i
            className="bi bi-clock"
            style={{ fontSize: "1.1rem", cursor: "pointer" }}
            onClick={openTimePicker}
            role="button"
            tabIndex={0}
            aria-label="Open time picker"
            onKeyDown={(e) => e.key === "Enter" && openTimePicker()}
          />
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
            list="time-placeholders"
          />
          <datalist id="time-placeholders">
            <option value="">hh:mm (24 hours)</option>
          </datalist>
        </div>
      </div>
    </div>
  );
};
