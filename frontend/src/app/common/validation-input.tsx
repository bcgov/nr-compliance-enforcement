
import { FC } from "react";

interface ValidationInputProps {
    className: string,
    defaultValue: string,
    placeholder: string,
    id: string,
    classNamePrefix: string,
    onChange: Function,
    errMsg: string,
  }

  export const ValidationInput: FC<ValidationInputProps> = ({
    className,
    defaultValue,
    id,
    onChange,
    errMsg,
  }) => {
    const errClass = (errMsg === "" ? "" : "error-message");
    const calulatedClass = (errMsg === "" ? className : className + " error-border");
    return (<div>
        <div>
        <input
                    type="text"
                    id={id}
                    className={calulatedClass}
                    defaultValue={defaultValue}
                    onChange={e => onChange(e.target.value)}
                  />
        </div>
        <div className={errClass}>
            {errMsg}
        </div>
    </div>)
  };