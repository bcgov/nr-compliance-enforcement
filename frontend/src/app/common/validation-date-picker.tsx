import { FC } from 'react';
import DatePicker from 'react-datepicker';

interface ValidationDatePickerProps {
  className: string;
  selectedDate: Date | undefined | null;
  onChange: (date: Date | null) => void;
  placeholder: string;
  id: string;
  classNamePrefix: string;
  errMsg: string;
  maxDate?: Date;
}

export const ValidationDatePicker: FC<ValidationDatePickerProps> = ({
  className,
  selectedDate,
  onChange,
  placeholder,
  id,
  classNamePrefix,
  errMsg,
  maxDate,
}) => {

  const handleDateChange = (date: Date | null) => {
    onChange(date);
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
          maxDate={maxDate}
          autoComplete='false'
        />
      </div>
      <div className={calculatedClass}>{errMsg}</div>
    </div>
  );
};
