
import { FC } from "react";
import PhoneInput from 'react-phone-number-input/input';

interface ValidationPhoneInputProps {
    className: string,
    id: string,
    onChange: Function,
    errMsg: string,
    defaultValue?: string,
    country?: string,
    maxLength?: number,
    international?: boolean,
  }

  export const ValidationPhoneInput: FC<ValidationPhoneInputProps> = ({
    className,
    defaultValue,
    id,
    onChange,
    errMsg,
  }) => {
    const errClass = (errMsg === "" ? "" : "error-message");
    const calulatedClass = (errMsg === "" ? "comp-form-control" : "comp-form-control" + " error-border");
    return (<div>
        <div className={className}>
        <PhoneInput
                    id={id}
                    country="CA"
                    displayInitialValueAsLocalNumber
                    className={calulatedClass}
                    value={defaultValue}
                    onChange={e => onChange(e)} 
                    onKeyUp={(e: any) => {
                      var index = (e.target.value.length - 1);
                      var key = e.code;

                      if (index === 0 && (key === 'Numpad0' || key === 'Digit0' || key === "Numpad1" || key === "Digit1")) {
                        e.preventDefault(); 
                      } else {
                        return true;
                      }
                      return false;
                    }}
                    maxLength={14} //phone input counts () - space, so this is actually a 10 character number
                    international={false}
                    initialValueFormat="national"
                  />
        </div>
        <div className={errClass}>
            {errMsg}
        </div>
    </div>)
  };