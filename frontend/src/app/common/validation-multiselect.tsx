import { FC } from "react";
import Option from "@apptypes/app/option";
import { default as Select, components } from "react-select";

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
  isDisabled?: boolean;
  isClearable?: boolean;
  showInactive?: boolean;
}

const CustomOption = (props: any) => {
  return (
    <components.Option {...props}>
      <input
        type="checkbox"
        checked={props.isSelected}
        onChange={() => null} // Prevent direct checkbox toggle; react-select handles selection
        style={{ marginRight: "8px" }}
      />
      {props.label}
    </components.Option>
  );
};

const customStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#ffffff" : provided.backgroundColor,
    color: state.isSelected ? "#000000" : provided.color,
    display: "flex",
    alignItems: "center",
  }),
};

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
  isDisabled = false,
  isClearable = false,
  showInactive = true,
}) => {
  const errClass = errMsg === "" ? "" : "error-message";
  const calulatedClass = errMsg === "" ? "" : "error-border";

  const visibleOptions =
    showInactive || options.length === 0 || !("isActive" in options[0])
      ? options
      : options.filter((o) => o.isActive || values?.some((v) => v.value === o.value));
  const items = [...visibleOptions, ...(values ?? []).filter((v) => !visibleOptions.some((o) => o.value === v.value))];

  return (
    <div>
      <div className={calulatedClass}>
        <Select
          id={id}
          options={items}
          onChange={(values) => {
            onChange(values);
          }}
          components={{ Option: CustomOption }}
          styles={customStyles}
          menuPlacement="auto"
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          placeholder={placeholder}
          classNamePrefix={classNamePrefix}
          className={calulatedClass}
          defaultValue={defaultValue}
          value={values}
          isMulti
          isDisabled={isDisabled}
          isClearable={isClearable}
        />
      </div>
      <div className={errClass}>{errMsg}</div>
    </div>
  );
};
