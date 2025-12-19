import { FC } from "react";

interface ValidationTextAreaProps {
  className: string;
  defaultValue?: string;
  value?: string;
  id: string;
  onChange: Function;
  errMsg: string;
  rows: number;
  maxLength?: number;
  placeholderText?: string;
  disabled?: boolean;
}

export const ValidationTextArea: FC<ValidationTextAreaProps> = ({
  className,
  defaultValue,
  value,
  id,
  onChange,
  errMsg,
  rows,
  maxLength,
  placeholderText,
  disabled,
}) => {
  const errClass = errMsg === "" ? "" : "error-message";
  const calulatedClass = errMsg === "" ? className : className + " error-border";

  // Use controlled value if provided, otherwise uncontrolled with defaultValue
  const valueProp = value ? { value } : { defaultValue };

  return (
    <div className="width-full">
      <div>
        <textarea
          id={id}
          className={calulatedClass}
          {...valueProp}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          placeholder={placeholderText}
          disabled={disabled}
        />
      </div>
      <div className={errClass}>{errMsg}</div>
    </div>
  );
};
