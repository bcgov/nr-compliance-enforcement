import { FC } from "react";
import Option from "@apptypes/app/option";
import Select from "react-select";

interface ValidationMultiSelectProps {
  className: string;
  options: Option[];
  defaultValue?: Option[];
  placeholder: string;
  id: string;
  classNamePrefix: string;
  onChange: Function;
  errMsg: string;
  values?: Option[];
}

export const ValidationMultiSelect: FC<ValidationMultiSelectProps> = ({
  className,
  options,
  defaultValue,
  placeholder,
  id,
  classNamePrefix,
  onChange,
  errMsg,
  values,
}) => {
  const errClass = errMsg === "" ? "" : "error-message";
  const calulatedClass = errMsg === "" ? "" : "error-border";
  return (
    <div>
      <div className={calulatedClass}>
        <Select
          id={id}
          options={options}
          onChange={(values) => {
            onChange(values);
          }}
          placeholder={placeholder}
          classNamePrefix={classNamePrefix}
          className={calulatedClass}
          defaultValue={defaultValue}
          value={values}
          isMulti
        />
      </div>
      <div className={errClass}>{errMsg}</div>
    </div>
  );
};
