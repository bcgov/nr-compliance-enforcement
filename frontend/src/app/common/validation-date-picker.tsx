import { FC } from "react";
import DatePicker from "react-datepicker";

// Accepts callbacks that take Date, Date | undefined, or Date | null. We always invoke with Date | undefined
// null gets normalized to undefined below.
export type ValidationDatePickerOnChange =
  | ((date: Date) => void)
  | ((date: Date | undefined) => void)
  | ((date: Date | null) => void);

interface ValidationDatePickerProps {
  className: string;
  selectedDate: Date | undefined | null;
  maxDate?: Date;
  minDate?: Date;
  onChange: ValidationDatePickerOnChange;
  id: string;
  classNamePrefix: string;
  errMsg: string;
  isDisabled?: boolean;
  showPreviousMonths?: boolean;
  showTimePicker?: boolean;
  vertical?: boolean;
  showYearDropdown?: boolean; // When true, shows a year dropdown for year selection
  yearDropdownItemNumber?: number; // Number of years to show in year dropdown
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
  vertical = false,
  showYearDropdown = false,
  yearDropdownItemNumber,
}) => {
  const handleDateChange = (date: Date | null) => {
    // Normalize null to undefined
    (onChange as (date: Date | undefined) => void)(date ?? undefined);
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
            selected={selectedDate ? new Date(selectedDate) : undefined}
            onChange={(date) => {
              if (date) {
                handleDateChange(date);
              }
            }}
            onBlur={(event) => {
              const rawValue = event.target.value;
              if (rawValue === "" && selectedDate) {
                handleDateChange(null as any);
              }
            }}
            placeholderText="yyyy-mm-dd"
            className={`${calculatedBorderClass} ${classNamePrefix}`}
            id={id}
            dateFormat="yyyy-MM-dd"
            {...(maxDate && { maxDate })}
            minDate={minDate}
            autoComplete="false"
            monthsShown={2}
            disabled={isDisabled}
            showIcon={false}
            showPreviousMonths={showPreviousMonths}
            showYearDropdown={showYearDropdown}
            scrollableYearDropdown={showYearDropdown}
            {...(yearDropdownItemNumber != null && { yearDropdownItemNumber })}
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
              onChange={(date) => {
                if (date) {
                  handleDateChange(date);
                }
              }}
              onChangeRaw={(event) => {
                const rawValue = event.target.value;
                if (rawValue === "" && selectedDate) {
                  selectedDate.setHours(0, 0, 0, 0);
                  handleDateChange(selectedDate);
                }
              }}
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
