import { FC } from "react";
import PhoneInput from "react-phone-number-input/input";

interface ValidationPhoneInputProps {
  className: string;
  id: string;
  onChange: Function;
  errMsg: string;
  defaultValue?: string;
  maxLength?: number;
  international?: boolean;
}

export const ValidationPhoneInput: FC<ValidationPhoneInputProps> = ({
  className,
  defaultValue,
  id,
  onChange,
  errMsg,
  maxLength,
  international,
}) => {
  const errClass = errMsg === "" ? "" : "error-message";
  const calulatedClass = errMsg === "" ? "comp-form-control" : "comp-form-control error-border";
  return (
    <div>
      <div className={className}>
        <PhoneInput
          id={id}
          country="CA"
          className={calulatedClass}
          value={defaultValue}
          onChange={(e) => onChange(e)}
          maxLength={maxLength} //phone input counts () - space, so this is actually a 10 character number
          international={international}
        />
      </div>
      <div className={errClass}>{errMsg}</div>
    </div>
  );
};
