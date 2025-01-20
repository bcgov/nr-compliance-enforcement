import { FC } from "react";
import DatePicker from "react-datepicker";

interface ValidationDatePickerProps {
  className: string;
  selectedDate: Date | undefined | null;
  maxDate: Date;
  minDate?: Date;
  onChange: (date: Date) => void;
  placeholder: string;
  id: string;
  classNamePrefix: string;
  errMsg: string;
  isDisabled?: boolean | undefined;
}

export const ValidationDatePicker: FC<ValidationDatePickerProps> = ({
  className,
  selectedDate,
  maxDate,
  minDate,
  onChange,
  placeholder,
  id,
  classNamePrefix,
  errMsg,
  isDisabled,
}) => {
  const handleDateChange = (date: Date) => {
    onChange(date);
  };

  const calculatedClass = errMsg === "" ? "" : "error-message";
  const calculatedBorderClass = errMsg === "" ? "" : "error-border";

  return (
    <div className={className}>
      <div>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          placeholderText={placeholder}
          className={`${calculatedBorderClass} ${classNamePrefix}`}
          id={id}
          showIcon
          dateFormat="yyyy-MM-dd"
          wrapperClassName="comp-details-edit-calendar-input"
          maxDate={maxDate}
          minDate={minDate}
          autoComplete="false"
          monthsShown={2}
          showPreviousMonths
          disabled={isDisabled}
        />
      </div>
      <div className={calculatedClass}>{errMsg}</div>
    </div>
  );
};
