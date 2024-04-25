import { FC } from "react";

interface ValidationInputProps {
  className: string;
  defaultValue?: string;
  id: string;
  onChange: Function;
  errMsg: string;
  type: string;
  step?: string;
  maxLength?: number;
  value?: string;
}

export const ValidationInput: FC<ValidationInputProps> = ({
  className,
  defaultValue,
  id,
  onChange,
  errMsg,
  type,
  step,
  maxLength,
  value,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onChange(newValue); // Call the parent's onChange function
  };

  const errClass = errMsg === "" ? "" : "error-message";
  const calulatedClass = errMsg === "" ? className : className + " error-border";
  return (
    <div>
      <div>
        <input
          type={type}
          id={id}
          className={calulatedClass}
          defaultValue={defaultValue}
          value={value}
          onChange={handleInputChange}
          step={step}
          maxLength={maxLength}
        />
      </div>
      <div className={errClass}>{errMsg}</div>
    </div>
  );
};
