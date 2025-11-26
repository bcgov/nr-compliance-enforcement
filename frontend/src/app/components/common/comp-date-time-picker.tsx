import { FC, useState, useEffect } from "react";
import { format, isValid } from "date-fns";

type Props = {
  value: Date | undefined | null;
  onChange: Function;
  maxDate: Date | undefined;
};

export const CompDateTimePicker: FC<Props> = ({ value, onChange, maxDate }) => {
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");

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
    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center comp-details-form-row">
      <div className="comp-details-edit-input">
        <input
          id="incident-date"
          type="date"
          value={dateStr}
          placeholder="yyyy-mm-dd"
          aria-label="Date picker input, format yyyy-mm-dd"
          onChange={(e) => {
            setDateStr(e.target.value);
          }}
          max={maxDate ? format(maxDate, "yyyy-MM-dd") : undefined}
          required
          className="comp-form-control placeholder-input"
        />
      </div>

      <div className="comp-details-edit-input">
        <input
          id="incident-time"
          type="time"
          placeholder="hh:mm"
          value={timeStr}
          onChange={(e) => {
            setTimeStr(e.target.value);
          }}
          required
          step="60"
          className="comp-form-control placeholder-input"
        />
      </div>
    </div>
  );
};
