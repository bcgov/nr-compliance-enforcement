
import { FC } from "react";
import Option from "../types/app/option";
import Select from 'react-select';

interface ValidationSelectProps {
    className: string,
    options: Option[],
    defaultValue: Option | undefined,
    placeholder: string,
    id: string,
    classNamePrefix: string,
    onChange: (selectedOption: Option | null) => void,
    errMsg: string,
  }

  export const ValidationSelect: FC<ValidationSelectProps> = ({
    className,
    options,
    defaultValue,
    placeholder,
    id,
    classNamePrefix,
    onChange,
    errMsg,
  }) => {
    const calulatedClass = (errMsg === "" ? "" : "error-message");
    return (<div className={className}>
        <div>
        <Select 
                id={id}
                options={options} 
                onChange={onChange} 
                placeholder={placeholder} 
                classNamePrefix={classNamePrefix}
                defaultValue={defaultValue}/>
        </div>
        <div className={calulatedClass}>
            {errMsg}
        </div>
    </div>)
  };