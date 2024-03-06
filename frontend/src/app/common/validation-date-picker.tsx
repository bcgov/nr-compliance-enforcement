import { useState } from 'react';
import { FC } from "react";
import DatePicker from 'react-datepicker';

interface ValidationDatePickerProps {
  className: string;
  selectedDate: Date | undefined | null;
  onChange: (date: Date | null) => void;
  placeholder: string;
  id: string;
  classNamePrefix: string;
  errMsg: string;
}

export const ValidationDatePicker: FC<ValidationDatePickerProps> = ({
  className,
  selectedDate,
  onChange,
  placeholder,
  id,
  classNamePrefix,
  errMsg,
}) => {
  const [isDateValid, setIsDateValid] = useState<boolean>(true);

  const handleDateChange = (date: Date | null) => {
    onChange(date);
    setIsDateValid(!!date); // Example: Date is considered valid if it's not null
  };

  const calculatedClass = errMsg === '' ? '' : 'error-message';
  const calculatedBorderClass = errMsg === '' ? '' : 'error-border';

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
          maxDate={new Date()}
          autoComplete='false'
        />
      </div>
      <div className={calculatedClass}>{errMsg}</div>
    </div>
  );
};
