import { FC } from "react";
import DatePicker from "react-datepicker";

interface ValidationDatePickerProps {
  className: string;
  selectedDate: Date | undefined | null;
  maxDate: Date;
  minDate?: Date;
  onChange: (date: Date) => void;
  id: string;
  classNamePrefix: string;
  errMsg: string;
  isDisabled?: boolean;
  showPreviousMonths?: boolean;
  showTimePicker?: boolean;
}

export const ValidationDatePicker: FC<ValidationDatePickerProps> = ({
  className,
  selectedDate,
  maxDate,
  minDate,
  onChange,
  id,
  classNamePrefix,
  errMsg,
  isDisabled,
  showPreviousMonths = true,
  showTimePicker = false,
}) => {
  const handleDateChange = (date: Date) => {
    onChange(date);
  };

  const calculatedClass = errMsg === "" ? "" : "error-message";
  const calculatedBorderClass = errMsg === "" ? "" : "error-border";

  return (
    <div className="comp-lat-long-input">
      <div className="d-flex flex-row gap-2">
        <div
          className={`d-flex comp-date-time-picker align-items-center ${calculatedBorderClass}`}
          style={{ maxWidth: "180px" }}
        >
          <i className="bi bi-calendar" />
          <DatePicker
            selected={selectedDate ? new Date(selectedDate) : undefined}
            onChange={handleDateChange}
            placeholderText="yyyy-mm-dd"
            className={`${calculatedBorderClass} ${classNamePrefix}`}
            id={id}
            dateFormat="yyyy-MM-dd"
            maxDate={maxDate}
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
            className={`d-flex comp-date-time-picker align-items-center ${calculatedBorderClass}`}
            style={{ maxWidth: "180px" }}
          >
            <i className="bi bi-clock" />
            <DatePicker
              id={`${id}-timepicker`}
              selected={selectedDate ? new Date(selectedDate) : undefined}
              onChange={handleDateChange}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={1}
              timeCaption="Time"
              timeFormat="HH:mm"
              dateFormat="HH:mm"
              placeholderText="hh:mm"
            />
          </div>
        )}
      </div>
      <div className={calculatedClass}>{errMsg}</div>
    </div>
  );
};
