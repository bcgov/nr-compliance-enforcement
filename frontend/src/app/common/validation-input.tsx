
import { FC } from "react";

interface ValidationInputProps {
    className: string,
    defaultValue: string,
    id: string,
    onChange: Function,
    errMsg: string,
    type: string,
    step?: string,
  }

  export const ValidationInput: FC<ValidationInputProps> = ({
    className,
    defaultValue,
    id,
    onChange,
    errMsg,
    type,
    step,
  }) => {
    const errClass = (errMsg === "" ? "" : "error-message");
    const calulatedClass = (errMsg === "" ? className : className + " error-border");
    return (<div>
        <div>
        <input
                    type={type}
                    id={id}
                    className={calulatedClass}
                    defaultValue={defaultValue}
                    onChange={e => onChange(e.target.value)}
                    step={step}
                  />
        </div>
        <div className={errClass}>
            {errMsg}
        </div>
    </div>)
  };